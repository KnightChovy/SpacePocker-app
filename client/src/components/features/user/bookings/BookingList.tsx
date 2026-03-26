import { useMemo, useState } from 'react';
import {
  Calendar,
  CircleCheckBig,
  CreditCard,
  MapPin,
  Star,
  Timer,
} from 'lucide-react';
import { toast } from 'react-toastify';
import type { BookingUser } from '@/types/user/user-type';
import type { MyBookingRequest } from '@/types/user/booking-request-api';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCreateFeedback } from '@/hooks/user/feedback/use-create-feedback';
import { useGetAmenities } from '@/hooks/user/amenities/use-get-amenities';
import { useGetServiceCategories } from '@/hooks/user/service-categories/use-get-service-categories';
import { useGetMyBookings } from '@/hooks/user/booking-requests/use-get-my-bookings';
import { useCheckInBooking } from '@/hooks/user/booking-requests/use-check-in-booking';
import { useCheckOutBooking } from '@/hooks/user/booking-requests/use-check-out-booking';
import { useCancelPaidBooking } from '@/hooks/user/booking-requests/use-cancel-paid-booking';
import { bookingPaymentApi } from '@/apis/booking-payment.api';
import type { LocalBookingRecord } from '@/stores/bookingDraft.store';
import { useBookingDraftStore } from '@/stores/bookingDraft.store';
import { useBookingReviewStore } from '@/stores/bookingReview.store';
import { formatVND } from '@/lib/utils';
import type { MyBooking } from '@/types/user/booking-requests.api.types';

type BookingListProps = {
  bookings: BookingUser[];
  requests: MyBookingRequest[];
  onCancelRequest?: (requestId: string) => Promise<void> | void;
  isCancelling?: boolean;
};

const getBookingMatchKey = (
  roomId: string,
  startTime: string,
  endTime: string
) => {
  const startTs = new Date(startTime).getTime();
  const endTs = new Date(endTime).getTime();

  if (Number.isNaN(startTs) || Number.isNaN(endTs)) {
    return `${roomId}:${startTime}:${endTime}`;
  }

  return `${roomId}:${startTs}:${endTs}`;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const maybeAxiosError = error as {
    response?: {
      data?: {
        message?: string;
      };
    };
  };

  return maybeAxiosError?.response?.data?.message ?? fallback;
};

const BookingList = ({
  bookings,
  requests,
  onCancelRequest,
  isCancelling = false,
}: BookingListProps) => {
  const amenitiesQuery = useGetAmenities();
  const serviceCategoriesQuery = useGetServiceCategories();
  const myBookingsQuery = useGetMyBookings();
  const checkInBookingMutation = useCheckInBooking();
  const checkOutBookingMutation = useCheckOutBooking();
  const cancelPaidBookingMutation = useCancelPaidBooking();

  const localBookingsById = useBookingDraftStore(
    state => state.localBookingsById
  );

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<'detail' | 'feedback' | 'pay'>(
    'detail'
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [activeBookingActionId, setActiveBookingActionId] = useState<
    string | null
  >(null);

  const selectedRequest = useMemo(() => {
    if (selectedIndex === null) return null;
    return requests[selectedIndex] ?? null;
  }, [requests, selectedIndex]);

  const selectedBooking = useMemo(() => {
    if (selectedIndex === null) return null;
    return bookings[selectedIndex] ?? null;
  }, [bookings, selectedIndex]);

  const selectedCancellationReason = useMemo(() => {
    if (!selectedRequest) return null;

    return (
      selectedRequest.refund?.reason ??
      selectedRequest.cancelReason ??
      selectedRequest.rejectionReason ??
      selectedRequest.reason ??
      null
    );
  }, [selectedRequest]);

  const bookingByRequestId = useMemo(() => {
    const linked = new Map<string, MyBooking>();
    const bookingsByKey = new Map<string, MyBooking[]>();

    for (const booking of myBookingsQuery.data ?? []) {
      const key = getBookingMatchKey(
        booking.roomId,
        booking.startTime,
        booking.endTime
      );
      const current = bookingsByKey.get(key) ?? [];
      current.push(booking);
      bookingsByKey.set(key, current);
    }

    for (const req of requests) {
      const key = getBookingMatchKey(req.roomId, req.startTime, req.endTime);
      const booking = bookingsByKey.get(key)?.[0];
      if (booking) {
        linked.set(req.id, booking);
      }
    }

    return linked;
  }, [myBookingsQuery.data, requests]);

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');

  const isRoomReviewed = useBookingReviewStore(s => s.isRoomReviewed);
  const isBookingReviewed = useBookingReviewStore(s => s.isBookingReviewed);
  const markReviewed = useBookingReviewStore(s => s.markReviewed);

  const createFeedback = useCreateFeedback();

  const amenityNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const a of amenitiesQuery.data ?? []) {
      map.set(a.id, a.name);
    }
    return map;
  }, [amenitiesQuery.data]);

  const serviceById = useMemo(() => {
    const map = new Map<string, { name: string; price: number }>();
    const categories = serviceCategoriesQuery.data ?? [];
    for (const cat of categories) {
      for (const s of cat.services ?? []) {
        map.set(s.id, { name: s.name, price: s.price });
      }
    }
    return map;
  }, [serviceCategoriesQuery.data]);

  const readPersistedBookingStorage = ():
    | { localBookingsById?: Record<string, LocalBookingRecord> }
    | undefined => {
    if (typeof window === 'undefined') return undefined;
    try {
      const raw = window.localStorage.getItem('spacepocker-booking-storage');
      if (!raw) return undefined;
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const state = parsed?.state ?? parsed;
      return {
        localBookingsById: (state as Record<string, unknown>)
          ?.localBookingsById as Record<string, LocalBookingRecord> | undefined,
      };
    } catch {
      return undefined;
    }
  };

  const selectedExtras = useMemo(() => {
    const empty = {
      amenityIds: [] as string[],
      services: {} as Record<string, number>,
    };

    if (!selectedRequest) return empty;

    const persisted = readPersistedBookingStorage();

    const fromLocal: LocalBookingRecord | undefined = selectedRequest.id
      ? (localBookingsById[selectedRequest.id] ??
        persisted?.localBookingsById?.[selectedRequest.id])
      : undefined;

    if (fromLocal) {
      const services: Record<string, number> = {};
      for (const item of fromLocal.services ?? []) {
        if (!item?.serviceId) continue;
        const qty = Number(item.quantity ?? 0);
        if (!Number.isFinite(qty) || qty <= 0) continue;
        services[item.serviceId] = (services[item.serviceId] ?? 0) + qty;
      }
      return {
        amenityIds: Array.isArray(fromLocal.amenityIds)
          ? fromLocal.amenityIds
          : [],
        services,
      };
    }

    return empty;
  }, [localBookingsById, selectedRequest]);

  const openDetail = (idx: number) => {
    setSelectedIndex(idx);
    setSheetMode('detail');
    setSheetOpen(true);
  };

  const openFeedback = (idx: number) => {
    setSelectedIndex(idx);
    setSheetMode('feedback');
    setRating(5);
    setComment('');
    setSheetOpen(true);
  };

  const openPay = (idx: number) => {
    setSelectedIndex(idx);
    setSheetMode('pay');
    setSheetOpen(true);
  };

  const pricing = useMemo(() => {
    if (!selectedRequest)
      return {
        hours: 0,
        subtotal: 0,
        total: 0,
      };

    const start = new Date(selectedRequest.startTime);
    const end = new Date(selectedRequest.endTime);
    const hours = Math.max(0, (end.getTime() - start.getTime()) / 3600000);

    const rate = selectedRequest.room?.pricePerHour ?? 0;
    const roomLine = rate * hours;

    const servicesLine = Object.entries(selectedExtras.services).reduce(
      (sum, [serviceId, qty]) => {
        const svc = serviceById.get(serviceId);
        if (!svc) return sum;
        return sum + svc.price * qty;
      },
      0
    );

    const subtotal = roomLine + servicesLine;
    const total = subtotal;

    return {
      hours,
      subtotal,
      total,
    };
  }, [selectedExtras.services, selectedRequest, serviceById]);

  const handlePay = async () => {
    if (!selectedRequest?.id) return;
    if (selectedRequest.status !== 'APPROVED') {
      toast.error('Can only pay for approved bookings');
      return;
    }

    try {
      setIsPaymentLoading(true);
      const paymentUrl = await bookingPaymentApi.getPaymentUrl(
        selectedRequest.id
      );
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to get payment URL. Please try again.');
      setIsPaymentLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedRequest) return;

    try {
      await createFeedback.mutateAsync({
        roomId: selectedRequest.roomId,
        rating,
        comment: comment.trim() ? comment.trim() : undefined,
      });

      markReviewed({
        roomId: selectedRequest.roomId,
        bookingRequestId: selectedRequest.id,
      });
      setSheetOpen(false);
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const message = axiosError?.response?.data?.message as string | undefined;
      if (message?.toLowerCase?.().includes('already left feedback')) {
        markReviewed({
          roomId: selectedRequest.roomId,
          bookingRequestId: selectedRequest.id,
        });
        setSheetOpen(false);
      }
    }
  };

  const handleCheckIn = async (request: MyBookingRequest) => {
    const linkedBooking = bookingByRequestId.get(request.id);
    if (!linkedBooking?.id) {
      toast.error('Cannot find paid booking to check in');
      return;
    }

    if (request.status !== 'COMPLETED') {
      toast.error('Check-in requires a paid booking');
      return;
    }

    if (request.status === 'CANCELLED' || request.status === 'REJECTED') {
      toast.error('Cancelled bookings cannot be checked in');
      return;
    }

    const now = new Date();
    const startTime = new Date(request.startTime);
    if (now < startTime) {
      toast.error('You can only check in after booking time starts');
      return;
    }

    try {
      setActiveBookingActionId(linkedBooking.id);
      await checkInBookingMutation.mutateAsync(linkedBooking.id);
      toast.success('Check-in successful');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Check-in failed'));
    } finally {
      setActiveBookingActionId(null);
    }
  };

  const handleCheckOut = async (request: MyBookingRequest) => {
    const linkedBooking = bookingByRequestId.get(request.id);
    if (!linkedBooking?.id) {
      toast.error('Cannot find booking for check-out');
      return;
    }

    if (request.status !== 'COMPLETED') {
      toast.error('Check-out requires a paid booking');
      return;
    }

    if (request.status === 'CANCELLED' || request.status === 'REJECTED') {
      toast.error('Cancelled bookings cannot be checked out');
      return;
    }

    if (linkedBooking.status !== 'CHECKED_IN') {
      toast.error('Please check in before check out');
      return;
    }

    try {
      setActiveBookingActionId(linkedBooking.id);
      await checkOutBookingMutation.mutateAsync(linkedBooking.id);
      toast.success('Check-out successful');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Check-out failed'));
    } finally {
      setActiveBookingActionId(null);
    }
  };

  const handleCancelPaidBooking = async (request: MyBookingRequest) => {
    const linkedBooking = bookingByRequestId.get(request.id);
    if (!linkedBooking?.id) {
      toast.error('Cannot find paid booking to cancel');
      return;
    }

    const startTime = new Date(request.startTime);
    if (new Date() > startTime) {
      toast.error('Cannot cancel a booking that has already started');
      return;
    }

    if (
      linkedBooking.status !== 'APPROVED' &&
      linkedBooking.status !== 'PENDING' &&
      linkedBooking.status !== 'COMPLETED'
    ) {
      toast.error('This booking cannot be cancelled now');
      return;
    }

    if (
      !window.confirm(
        'Cancel this paid booking? You may lose your deposit and receive an email notification.'
      )
    ) {
      return;
    }

    try {
      setActiveBookingActionId(linkedBooking.id);
      await cancelPaidBookingMutation.mutateAsync(linkedBooking.id);
      toast.success('Paid booking cancelled');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Cancel paid booking failed'));
    } finally {
      setActiveBookingActionId(null);
    }
  };

  if (!bookings.length) {
    return (
      <div className="rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-8 text-center text-sm text-text-sub-light dark:text-text-sub-dark">
        No bookings found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {bookings.map((booking, idx) => {
        const req = requests[idx];
        const linkedBooking = req ? bookingByRequestId.get(req.id) : undefined;
        const now = new Date();
        const startTime = req?.startTime ? new Date(req.startTime) : null;
        const isBeforeStart = startTime ? now < startTime : false;
        const reviewed =
          isBookingReviewed(req?.id) || isRoomReviewed(req?.roomId);

        const isRequestCancelled =
          req?.status === 'CANCELLED' || req?.status === 'REJECTED';
        const isPaid = req?.status === 'COMPLETED';
        const hasReachedBookingTime = !isBeforeStart;
        const canCheckIn =
          !!req &&
          !!linkedBooking?.id &&
          isPaid &&
          !isRequestCancelled &&
          linkedBooking.status === 'APPROVED' &&
          hasReachedBookingTime;
        const canCheckOut =
          !!req &&
          !!linkedBooking?.id &&
          isPaid &&
          !isRequestCancelled &&
          linkedBooking.status === 'CHECKED_IN';

        const checkInBlockedReasons: string[] = [];
        if (!canCheckIn) {
          if (!req) {
            checkInBlockedReasons.push('Missing booking request data.');
          } else {
            if (req.status !== 'COMPLETED') {
              checkInBlockedReasons.push('Booking has not been paid yet.');
            }

            if (isRequestCancelled) {
              checkInBlockedReasons.push(
                'Booking was cancelled or rejected and cannot check in.'
              );
            }

            if (!linkedBooking?.id) {
              checkInBlockedReasons.push(
                'No paid booking record was found for this request.'
              );
            }

            if (isBeforeStart) {
              checkInBlockedReasons.push(
                'Check-in is only available when booking time starts.'
              );
            }

            if (linkedBooking?.status === 'CHECKED_IN') {
              checkInBlockedReasons.push(
                'Booking is already checked in. Please check out instead.'
              );
            }

            if (linkedBooking?.status === 'COMPLETED') {
              checkInBlockedReasons.push(
                'Paid booking is currently marked COMPLETED by backend, so check-in endpoint will reject it.'
              );
            }
          }
        }

        const isBookingCompleted =
          linkedBooking?.status === 'COMPLETED' || (!linkedBooking && isPaid);

        const canWriteFeedback =
          isBookingCompleted && !!req?.roomId && !reviewed && !isBeforeStart;
        const isFeedbackSubmitted = !!req?.roomId && reviewed;

        const canPay = req?.status === 'APPROVED' && isBeforeStart;
        const canCancelRequest =
          !!req?.id &&
          req.status !== 'COMPLETED' &&
          req.status !== 'CANCELLED' &&
          req.status !== 'REJECTED' &&
          isBeforeStart;

        const canCancelPaidBooking =
          !!req &&
          !!linkedBooking?.id &&
          req.status === 'COMPLETED' &&
          !isRequestCancelled &&
          isBeforeStart &&
          (linkedBooking.status === 'APPROVED' ||
            linkedBooking.status === 'PENDING' ||
            linkedBooking.status === 'COMPLETED');

        return (
          <div
            key={booking.id}
            className="group flex flex-col md:flex-row bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
          >
            <div
              className="w-full md:w-60 h-48 md:h-auto rounded-xl bg-cover bg-center shrink-0 mb-4 md:mb-0 md:mr-6 relative overflow-hidden"
              style={{ backgroundImage: `url('${booking.image}')` }}
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono font-bold text-text-sub-light dark:text-text-sub-dark bg-background-light dark:bg-background-dark px-2 py-1 rounded-md border border-border-light dark:border-border-dark">
                      {booking.id}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${
                        linkedBooking?.status === 'CHECKED_IN'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                          : booking.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {linkedBooking?.status === 'CHECKED_IN'
                        ? 'Checked In'
                        : booking.status}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-1">
                    {booking.spaceName}
                  </h3>
                  <p className="text-sm text-text-sub-light dark:text-text-sub-dark flex items-center gap-1">
                    <MapPin className="w-4.5 h-4.5" /> {booking.location}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xl font-bold">
                    {formatVND(booking.price)}
                  </div>
                  <div className="text-xs text-text-sub-light dark:text-text-sub-dark mt-0.5">
                    {req?.status === 'COMPLETED'
                      ? 'Paid & Confirmed'
                      : canPay
                        ? 'Payment required'
                        : '—'}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-8 my-6 p-4 rounded-xl bg-background-light dark:bg-background-dark/50 border border-border-light dark:border-border-dark text-sm text-text-sub-light dark:text-text-sub-dark">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="font-medium text-text-main-light dark:text-text-main-dark">
                    {booking.date}
                  </span>
                </div>
                <div className="w-px h-4 bg-border-dark/20 dark:bg-border-light/20 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-primary" />
                  <span>
                    {booking.startTime} - {booking.endTime}
                  </span>
                  <span className="text-xs bg-surface-light dark:bg-surface-dark px-2 py-0.5 rounded border border-border-light dark:border-border-dark ml-1 font-semibold">
                    {booking.duration}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-border-light dark:border-border-dark mt-auto">
                <button
                  onClick={() => openDetail(idx)}
                  className="px-4 py-2 rounded-xl text-sm font-bold border border-border-light dark:border-border-dark text-text-sub-light dark:text-text-sub-dark hover:text-primary hover:border-primary hover:bg-surface-light dark:hover:bg-surface-dark transition-all flex items-center gap-2"
                >
                  Get Detail
                </button>

                {canCancelRequest ? (
                  <button
                    type="button"
                    onClick={() => onCancelRequest?.(req.id)}
                    disabled={isCancelling}
                    className="px-4 py-2 rounded-xl text-sm font-bold border border-red-200 text-red-600 hover:bg-red-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
                  </button>
                ) : null}

                {canCancelPaidBooking ? (
                  <button
                    type="button"
                    onClick={() => req && handleCancelPaidBooking(req)}
                    disabled={cancelPaidBookingMutation.isPending}
                    className="px-4 py-2 rounded-xl text-sm font-bold border border-red-200 text-red-600 hover:bg-red-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {cancelPaidBookingMutation.isPending &&
                    activeBookingActionId === linkedBooking?.id
                      ? 'Cancelling...'
                      : 'Cancel Paid Booking'}
                  </button>
                ) : null}

                {canCheckIn ? (
                  <button
                    type="button"
                    onClick={() => req && handleCheckIn(req)}
                    disabled={
                      checkInBookingMutation.isPending ||
                      checkOutBookingMutation.isPending
                    }
                    className="px-4 py-2 rounded-xl text-sm font-bold border border-primary text-primary hover:bg-primary/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {checkInBookingMutation.isPending &&
                    activeBookingActionId === linkedBooking?.id
                      ? 'Checking in...'
                      : 'Check In'}
                  </button>
                ) : null}

                {canCheckOut ? (
                  <button
                    type="button"
                    onClick={() => req && handleCheckOut(req)}
                    disabled={
                      checkOutBookingMutation.isPending ||
                      checkInBookingMutation.isPending
                    }
                    className="px-4 py-2 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {checkOutBookingMutation.isPending &&
                    activeBookingActionId === linkedBooking?.id
                      ? 'Checking out...'
                      : 'Check Out'}
                  </button>
                ) : null}

                {canPay ? (
                  <button
                    onClick={() => openPay(idx)}
                    className="px-5 py-2 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary/90 transition-all flex items-center gap-2 ml-auto"
                  >
                    <CreditCard className="h-5 w-5" /> Pay
                  </button>
                ) : isPaid &&
                  !canWriteFeedback &&
                  !canCheckIn &&
                  !canCheckOut ? (
                  <button
                    className="px-5 py-2 rounded-xl text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default flex items-center gap-2 ml-auto"
                    disabled
                  >
                    <CircleCheckBig className="h-5 w-5 text-emerald-600" /> Paid
                  </button>
                ) : null}

                {isFeedbackSubmitted ? (
                  <button
                    className="px-5 py-2 rounded-xl text-sm font-bold bg-background-light dark:bg-surface-dark text-text-sub-light border border-transparent shadow-none cursor-not-allowed flex items-center gap-2 ml-auto opacity-70"
                    disabled
                  >
                    <CircleCheckBig className="h-5 w-5 text-emerald-500" />{' '}
                    Review Submitted
                  </button>
                ) : canWriteFeedback ? (
                  <button
                    onClick={() => openFeedback(idx)}
                    className="px-5 py-2 rounded-xl text-sm font-bold bg-white dark:bg-surface-dark text-text-main-light dark:text-text-main-dark border border-border-light dark:border-border-dark shadow-sm hover:shadow hover:text-primary transition-all flex items-center gap-2 ml-auto"
                  >
                    <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                    Write Review
                  </button>
                ) : null}
              </div>

              {checkInBlockedReasons.length > 0 && !canCheckOut ? (
                <div className="mt-3 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2">
                  <div className="text-xs font-semibold text-text-main-light dark:text-text-main-dark mb-1">
                    Cannot check in yet:
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-text-sub-light dark:text-text-sub-dark">
                    {checkInBlockedReasons.map(reason => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        );
      })}

      <Sheet
        open={sheetOpen}
        onOpenChange={open => {
          setSheetOpen(open);
          if (!open) setSelectedIndex(null);
        }}
      >
        <SheetContent className="bg-background border-border-light dark:border-border-dark text-text-main-light dark:text-text-main-dark">
          {sheetMode === 'detail' ? (
            <>
              <SheetHeader>
                <SheetTitle>Booking Detail</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-4 text-sm">
                {selectedRequest ? (
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="text-xs font-mono font-bold mb-1 text-text-sub-light dark:text-text-sub-dark">
                        {selectedRequest.id}
                      </div>
                      <div className="text-base font-bold text-text-main-light dark:text-text-main-dark">
                        {selectedRequest.room?.name ?? '—'}
                      </div>
                      <div className="text-sm text-text-sub-light dark:text-text-sub-dark">
                        {selectedRequest.room?.building?.buildingName ?? '—'}
                        {selectedRequest.room?.building?.campus
                          ? ` • ${selectedRequest.room?.building?.campus}`
                          : ''}
                      </div>
                      {selectedRequest.room?.building?.address ? (
                        <div className="text-xs mt-1 text-text-sub-light dark:text-text-sub-dark">
                          {selectedRequest.room?.building?.address}
                        </div>
                      ) : null}
                    </div>

                    <div className="rounded-xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-text-sub-light dark:text-text-sub-dark">
                          Start
                        </span>
                        <span className="font-medium text-text-main-light dark:text-text-main-dark">
                          {new Date(selectedRequest.startTime).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-text-sub-light dark:text-text-sub-dark">
                          End
                        </span>
                        <span className="font-medium text-text-main-light dark:text-text-main-dark">
                          {new Date(selectedRequest.endTime).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-text-sub-light dark:text-text-sub-dark">
                          Status
                        </span>
                        <span className="font-medium text-text-main-light dark:text-text-main-dark">
                          {selectedBooking?.status ?? selectedRequest.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold mb-1">Purpose</div>
                      <div className="rounded-xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark p-3 text-text-sub-light dark:text-text-sub-dark">
                        {selectedRequest.purpose || '—'}
                      </div>
                    </div>

                    {(selectedRequest.status === 'CANCELLED' ||
                      selectedRequest.status === 'REJECTED') &&
                    selectedCancellationReason ? (
                      <div>
                        <div className="text-xs font-semibold mb-1">
                          Cancellation reason
                        </div>
                        <div className="rounded-xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark p-3 text-text-sub-light dark:text-text-sub-dark whitespace-pre-wrap wrap-break-word">
                          {selectedCancellationReason}
                        </div>
                      </div>
                    ) : null}

                    <div>
                      <div className="text-xs font-semibold mb-1">
                        Selected amenities
                      </div>
                      <div className="rounded-xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark p-3">
                        {selectedExtras.amenityIds.length ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedExtras.amenityIds.map(id => (
                              <span
                                key={id}
                                className="text-xs px-2 py-1 rounded-md bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-sub-light dark:text-text-sub-dark"
                              >
                                {amenityNameById.get(id) ?? id}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-text-sub-light dark:text-text-sub-dark">
                            —
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold mb-1">
                        Selected services
                      </div>
                      <div className="rounded-xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark p-3">
                        {(() => {
                          const entries = Object.entries(
                            selectedExtras.services
                          ).filter(([, qty]) => (qty ?? 0) > 0);

                          if (!entries.length) {
                            return (
                              <div className="text-sm text-text-sub-light dark:text-text-sub-dark">
                                —
                              </div>
                            );
                          }

                          return (
                            <div className="flex flex-col gap-2">
                              {entries.map(([serviceId, qty]) => {
                                const service = serviceById.get(serviceId);
                                return (
                                  <div
                                    key={serviceId}
                                    className="flex items-center justify-between text-sm"
                                  >
                                    <div className="text-text-sub-light dark:text-text-sub-dark">
                                      {service?.name ?? serviceId}
                                    </div>
                                    <div className="font-medium text-text-main-light dark:text-text-main-dark">
                                      x{qty}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-text-sub-light dark:text-text-sub-dark">
                    No booking selected.
                  </div>
                )}
              </div>
            </>
          ) : sheetMode === 'feedback' ? (
            <>
              <SheetHeader>
                <SheetTitle>Write Feedback</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-4 text-sm">
                {selectedRequest ? (
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="text-sm font-bold text-text-main-light dark:text-text-main-dark">
                        {selectedRequest.room?.name ?? '—'}
                      </div>
                      <div className="text-xs text-text-sub-light dark:text-text-sub-dark">
                        {selectedRequest.room?.building?.buildingName ?? '—'}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold mb-2 text-text-sub-light dark:text-text-sub-dark">
                        Rating
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const value = i + 1;
                          const active = value <= rating;
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setRating(value)}
                              className="p-1"
                              aria-label={`Rate ${value} star`}
                            >
                              <Star
                                className={`h-5 w-5 ${
                                  active
                                    ? 'text-amber-500 fill-amber-500'
                                    : 'text-text-sub-light/50'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold mb-2 text-text-sub-light dark:text-text-sub-dark">
                        Comment (optional)
                      </div>
                      <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        rows={4}
                        className="w-full rounded-xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark p-3 text-sm text-text-main-light dark:text-text-main-dark placeholder:text-text-sub-light/60 focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                        placeholder="Share what you liked..."
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setSheetOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSubmitFeedback}
                        disabled={createFeedback.isPending}
                      >
                        {createFeedback.isPending ? 'Submitting...' : 'Submit'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-text-sub-light dark:text-text-sub-dark">
                    No booking selected.
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <SheetHeader>
                <SheetTitle>Payment</SheetTitle>
              </SheetHeader>

              <div className="px-4 pb-4 text-sm">
                {selectedRequest ? (
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="text-xs font-mono font-bold mb-1 text-text-sub-light dark:text-text-sub-dark">
                        {selectedRequest.id}
                      </div>
                      <div className="text-base font-bold text-text-main-light dark:text-text-main-dark">
                        {selectedRequest.room?.name ?? '—'}
                      </div>
                      <div className="text-xs text-text-sub-light dark:text-text-sub-dark">
                        {new Date(selectedRequest.startTime).toLocaleString()} —{' '}
                        {new Date(selectedRequest.endTime).toLocaleString()}
                      </div>
                    </div>

                    {selectedRequest.status === 'COMPLETED' ? (
                      <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
                        This booking has been paid and confirmed.
                      </div>
                    ) : null}

                    <div className="rounded-xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-text-sub-light dark:text-text-sub-dark">
                          Subtotal
                        </span>
                        <span className="font-semibold">
                          {formatVND(pricing.subtotal)}
                        </span>
                      </div>
                      <div className="h-px bg-border-light dark:bg-border-dark my-3" />
                      <div className="flex items-center justify-between">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-lg">
                          {formatVND(pricing.total)}
                        </span>
                      </div>
                    </div>

                    {selectedRequest.status === 'COMPLETED' ? (
                      <button
                        type="button"
                        disabled
                        className="px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default flex items-center justify-center gap-2"
                      >
                        <CircleCheckBig className="h-5 w-5" /> Paid
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={
                          selectedRequest.status !== 'APPROVED' ||
                          isPaymentLoading
                        }
                        onClick={handlePay}
                        className="px-5 py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                      >
                        {isPaymentLoading
                          ? 'Processing...'
                          : `Pay ${formatVND(pricing.total)}`}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-text-sub-light dark:text-text-sub-dark">
                    No booking selected.
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default BookingList;
