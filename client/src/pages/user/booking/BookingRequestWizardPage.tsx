import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Calendar,
  Check,
  ChevronLeft,
  HelpCircle,
  Minus,
  Plus,
  Pencil,
} from 'lucide-react';

import { useGetRoomAmenitiesServices } from '@/hooks/user/rooms/use-get-room-amenities-services';
import { useGetAmenities } from '@/hooks/user/amenities/use-get-amenities';
import { useGetServiceCategories } from '@/hooks/user/service-categories/use-get-service-categories';
import { useGetRoomById } from '@/hooks/user/rooms/use-get-room-by-id';
import { useGetRooms } from '@/hooks/user/rooms/use-get-rooms';
import { useGetBuildingById } from '@/hooks/user/buildings/use-get-building-by-id';
import { useCreateBookingRequest } from '@/hooks/user/booking-requests/use-create-booking-request';
import type { ApiRoom, ApiRoomStatus } from '@/types/room-api';
import type { ApiService } from '@/types/booking-request-api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useBookingDraftStore } from '@/stores/bookingDraft.store';
import { formatVND } from '@/lib/utils';

type Step = 1 | 2 | 3;

const pad2 = (n: number) => String(n).padStart(2, '0');

const formatDateLabel = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

const formatTimeLabel = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const buildIsoFromDateTime = (date: string, time: string) => {
  if (!date || !time) return '';
  // Interpret as local time then convert to ISO.
  const dt = new Date(`${date}T${time}:00`);
  if (Number.isNaN(dt.getTime())) return '';
  return dt.toISOString().replace(/\.\d{3}Z$/, 'Z');
};

const durationHours = (startIso: string, endIso: string) => {
  const start = new Date(startIso);
  const end = new Date(endIso);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  return Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60));
};

const Stepper = ({ step }: { step: Step }) => {
  const steps: Array<{ n: Step; label: string }> = [
    { n: 1, label: 'Info' },
    { n: 2, label: 'Review' },
    { n: 3, label: 'Confirm' },
  ];

  return (
    <div className="flex items-center gap-6">
      {steps.map((s, idx) => {
        const isActive = s.n === step;
        const isDone = s.n < step;
        return (
          <div key={s.n} className="flex items-center gap-3">
            <div
              className={`size-7 rounded-full flex items-center justify-center text-xs font-semibold border transition-colors ${
                isDone
                  ? 'bg-primary border-primary text-white'
                  : isActive
                    ? 'border-primary text-primary bg-white'
                    : 'border-slate-200 text-slate-400 bg-white'
              }`}
            >
              {isDone ? <Check className="size-4" /> : s.n}
            </div>
            <span
              className={`text-xs font-semibold ${
                isActive ? 'text-primary' : 'text-slate-400'
              }`}
            >
              {s.label}
            </span>
            {idx < steps.length - 1 && (
              <div className="w-10 h-px bg-slate-200" />
            )}
          </div>
        );
      })}
    </div>
  );
};

const BookingRequestWizardPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const getDraft = useBookingDraftStore(s => s.getDraft);
  const upsertDraft = useBookingDraftStore(s => s.upsertDraft);
  const clearDraft = useBookingDraftStore(s => s.clearDraft);
  const addLocalBooking = useBookingDraftStore(s => s.addLocalBooking);

  const isRoomLocked = Boolean(searchParams.get('roomId'));

  const [step, setStep] = useState<Step>(1);
  const [roomId, setRoomId] = useState<string>(
    searchParams.get('roomId') ?? ''
  );

  const today = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
  }, []);

  const [startDate, setStartDate] = useState<string>(
    searchParams.get('startDate') ?? today
  );
  const [endDate, setEndDate] = useState<string>(
    searchParams.get('endDate') ?? today
  );
  const [startTime, setStartTime] = useState<string>(
    searchParams.get('startTime') ?? '09:00'
  );
  const [endTime, setEndTime] = useState<string>(
    searchParams.get('endTime') ?? '10:00'
  );
  const [purpose, setPurpose] = useState<string>('');

  const readExtrasDraft = (draftKey: string | null, draftRoomId: string) => {
    const storeDraft = draftRoomId ? getDraft(draftRoomId) : undefined;
    if (storeDraft) {
      return {
        amenityIds: storeDraft.amenityIds ?? [],
        services: storeDraft.services ?? {},
      };
    }

    if (!draftKey)
      return {
        amenityIds: [] as string[],
        services: {} as Record<string, number>,
      };

    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw)
        return {
          amenityIds: [] as string[],
          services: {} as Record<string, number>,
        };

      const parsed = JSON.parse(raw) as
        | {
            amenityIds?: string[];
            services?: Record<string, number>;
          }
        | undefined;

      const amenityIds = Array.isArray(parsed?.amenityIds)
        ? parsed!.amenityIds!
        : [];
      const services =
        parsed?.services && typeof parsed.services === 'object'
          ? parsed.services
          : {};

      return { amenityIds, services };
    } catch (e) {
      console.warn('Failed to load booking extras draft from localStorage', e);
      return {
        amenityIds: [] as string[],
        services: {} as Record<string, number>,
      };
    }
  };

  const initialRoomId = searchParams.get('roomId') ?? '';
  const initialDraftKey = initialRoomId
    ? `spacepocker:booking:extras:draft:${initialRoomId}`
    : null;
  const initialExtrasDraft = readExtrasDraft(initialDraftKey, initialRoomId);

  const [selectedAmenityIds, setSelectedAmenityIds] = useState<Set<string>>(
    () => new Set(initialExtrasDraft.amenityIds)
  );
  const [selectedServices, setSelectedServices] = useState<
    Record<string, number>
  >(() => initialExtrasDraft.services);

  useEffect(() => {
    if (!roomId) return;

    const amenityIds = Array.from(selectedAmenityIds);
    const hasServices = Object.keys(selectedServices).length > 0;

    if (amenityIds.length === 0 && !hasServices) {
      clearDraft(roomId);
      return;
    }

    upsertDraft({
      roomId,
      startDate,
      endDate,
      startTime,
      endTime,
      purpose,
      amenityIds,
      services: selectedServices,
      updatedAt: new Date().toISOString(),
    });
  }, [
    roomId,
    startDate,
    endDate,
    startTime,
    endTime,
    purpose,
    selectedAmenityIds,
    selectedServices,
    clearDraft,
    upsertDraft,
  ]);

  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const roomsQuery = useGetRooms({
    status: 'AVAILABLE' as ApiRoomStatus,
    limit: 100,
    offset: 0,
  });

  const rooms = roomsQuery.data?.rooms ?? [];
  const selectedRoomFromList: ApiRoom | undefined = rooms.find(
    r => r.id === roomId
  );

  const lockedRoomQuery = useGetRoomById(isRoomLocked ? roomId : undefined);
  const lockedRoom = lockedRoomQuery.data;

  const effectiveRoom: ApiRoom | undefined =
    (isRoomLocked ? lockedRoom : undefined) ?? selectedRoomFromList;

  const lockedBuildingQuery = useGetBuildingById(
    isRoomLocked &&
      effectiveRoom?.buildingId &&
      !effectiveRoom?.building?.buildingName
      ? effectiveRoom.buildingId
      : undefined
  );

  const effectiveBuildingName =
    effectiveRoom?.building?.buildingName ??
    lockedBuildingQuery.data?.buildingName;

  const roomExtrasQuery = useGetRoomAmenitiesServices(roomId || undefined);
  const roomAmenities = useMemo(
    () => roomExtrasQuery.data?.amenities ?? [],
    [roomExtrasQuery.data?.amenities]
  );
  const roomAmenityIdSet = useMemo(() => {
    return new Set(roomAmenities.map(a => a.id));
  }, [roomAmenities]);

  const [amenitiesInitializedForRoomId, setAmenitiesInitializedForRoomId] =
    useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;
    if (amenitiesInitializedForRoomId === roomId) return;

    if (selectedAmenityIds.size > 0) {
      setAmenitiesInitializedForRoomId(roomId);
      return;
    }

    if (roomAmenities.length > 0) {
      setSelectedAmenityIds(new Set(roomAmenities.map(a => a.id)));
      setAmenitiesInitializedForRoomId(roomId);
    }
  }, [
    amenitiesInitializedForRoomId,
    roomAmenities,
    roomId,
    selectedAmenityIds.size,
  ]);

  const allAmenitiesQuery = useGetAmenities();
  const allAmenities = useMemo(
    () => allAmenitiesQuery.data ?? [],
    [allAmenitiesQuery.data]
  );

  const allServiceCategoriesQuery = useGetServiceCategories();
  const allServiceCategories = useMemo(
    () => allServiceCategoriesQuery.data ?? [],
    [allServiceCategoriesQuery.data]
  );

  const allServices: ApiService[] = useMemo(() => {
    return allServiceCategories.flatMap(c => c.services);
  }, [allServiceCategories]);

  const startIso = useMemo(
    () => buildIsoFromDateTime(startDate, startTime),
    [startDate, startTime]
  );
  const endIso = useMemo(
    () => buildIsoFromDateTime(endDate, endTime),
    [endDate, endTime]
  );

  const hours = useMemo(
    () => durationHours(startIso, endIso),
    [startIso, endIso]
  );

  const pricing = useMemo(() => {
    const rate = effectiveRoom?.pricePerHour ?? 0;
    const roomLine = rate * hours;

    const servicesLine = Object.entries(selectedServices).reduce(
      (sum, [id, qty]) => {
        const svc = allServices.find(s => s.id === id);
        return sum + (svc ? svc.price * qty : 0);
      },
      0
    );

    const subtotal = roomLine + servicesLine;
    const total = subtotal;

    return {
      rate,
      roomLine,
      servicesLine,
      subtotal,
      total,
    };
  }, [allServices, effectiveRoom, hours, selectedServices]);

  const createBooking = useCreateBookingRequest();

  const bookingErrorMessage = useMemo(() => {
    if (!createBooking.error) return null;
    const err = createBooking.error as
      | { response?: { data?: { message?: string } } }
      | undefined;
    return (
      err?.response?.data?.message ??
      'Failed to create booking request. Please try again.'
    );
  }, [createBooking.error]);

  const canGoNextFromInfo = useMemo(() => {
    if (!roomId) return false;
    if (!startIso || !endIso) return false;
    const start = new Date(startIso);
    const end = new Date(endIso);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
      return false;
    if (start >= end) return false;
    return true;
  }, [roomId, startIso, endIso]);

  const selectedAmenityList = useMemo(() => {
    const ids = selectedAmenityIds;
    const source = allAmenities.length > 0 ? allAmenities : roomAmenities;
    return source.filter(a => ids.has(a.id));
  }, [allAmenities, roomAmenities, selectedAmenityIds]);

  const selectedServiceLines = useMemo(() => {
    return Object.entries(selectedServices)
      .filter(([, qty]) => qty > 0)
      .map(([serviceId, quantity]) => {
        const svc = allServices.find(s => s.id === serviceId);
        if (!svc) return null;
        return {
          serviceId,
          name: svc.name,
          price: svc.price,
          quantity,
          lineTotal: svc.price * quantity,
        };
      })
      .filter((line): line is NonNullable<typeof line> => line !== null);
  }, [allServices, selectedServices]);

  const toggleAmenity = (id: string) => {
    setSelectedAmenityIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const setServiceQty = (id: string, nextQty: number) => {
    setSelectedServices(prev => {
      const n = { ...prev };
      if (nextQty <= 0) {
        delete n[id];
      } else {
        n[id] = nextQty;
      }
      return n;
    });
  };

  const handleSubmitBookingRequest = async () => {
    if (!roomId || !startIso || !endIso) return;

    const servicesPayload = Object.entries(selectedServices)
      .filter(([, qty]) => qty > 0)
      .map(([serviceId, quantity]) => ({
        serviceId,
        quantity,
      }));

    const selectedAmenityIdList = Array.from(selectedAmenityIds);

    const payload = {
      roomId,
      startTime: startIso,
      endTime: endIso,
      purpose: purpose.trim() ? purpose.trim() : undefined,
    };

    const makeLocalId = () => {
      const cryptoObj = globalThis.crypto as unknown as
        | { randomUUID?: () => string }
        | undefined;
      const uuid = cryptoObj?.randomUUID?.();
      if (uuid) return uuid;
      return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    };

    try {
      const result = await createBooking.mutateAsync(payload);

      addLocalBooking({
        bookingRequestId: result.id,
        roomId,
        startTime: startIso,
        endTime: endIso,
        purpose: payload.purpose,
        amenityIds: selectedAmenityIdList,
        services: servicesPayload,
        savedAt: new Date().toISOString(),
      });
      clearDraft(roomId);

      setConfirmedId(result.id);
      setStep(3);
    } catch {
      const localId = makeLocalId();
      addLocalBooking({
        bookingRequestId: localId,
        roomId,
        startTime: startIso,
        endTime: endIso,
        purpose: payload.purpose,
        amenityIds: selectedAmenityIdList,
        services: servicesPayload,
        savedAt: new Date().toISOString(),
      });
      clearDraft(roomId);

      setConfirmedId(localId);
      setStep(3);
    }
  };

  const headerTitle =
    step === 1
      ? 'Configure your reservation'
      : step === 2
        ? 'Review your reservation'
        : 'Booking request submitted!';

  const headerSubtitle =
    step === 1
      ? `Enter the details for your upcoming booking${effectiveRoom ? ` at ${effectiveRoom.name}` : ''}.`
      : step === 2
        ? 'Please check the details below carefully before submitting your booking request.'
        : "We've saved your booking request. Your manager will review it before payment is required.";

  const rightCardTitle =
    step === 2
      ? 'Cost Breakdown'
      : step === 3
        ? 'Order Summary'
        : 'Booking Summary';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="h-20 bg-slate-900">
        <Navbar />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex items-center justify-between">
          <Stepper step={step} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {headerTitle}
            </h1>
            <p className="mt-2 text-slate-500 text-sm">{headerSubtitle}</p>

            {/* Content Card */}
            <div className="mt-6 bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
              {step === 1 && (
                <div className="space-y-8">
                  <section>
                    <p className="text-xs font-bold text-primary uppercase tracking-wider">
                      Date & Time
                    </p>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                          Room <span className="text-red-500">*</span>
                        </label>
                        {isRoomLocked ? (
                          <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800">
                            {lockedRoomQuery.isLoading
                              ? 'Loading room...'
                              : effectiveRoom
                                ? `${effectiveRoom.name}${effectiveBuildingName ? ` • ${effectiveBuildingName}` : ''}`
                                : roomId}
                          </div>
                        ) : (
                          <select
                            value={roomId}
                            onChange={e => {
                              const nextRoomId = e.target.value;
                              setRoomId(nextRoomId);

                              const nextDraftKey = nextRoomId
                                ? `spacepocker:booking:extras:draft:${nextRoomId}`
                                : null;
                              const nextDraft = readExtrasDraft(
                                nextDraftKey,
                                nextRoomId
                              );
                              setSelectedAmenityIds(
                                new Set(nextDraft.amenityIds)
                              );
                              setSelectedServices(nextDraft.services);
                            }}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30"
                          >
                            <option value="">Select a room...</option>
                            {rooms.map(r => (
                              <option key={r.id} value={r.id}>
                                {r.name}
                                {r.building?.buildingName
                                  ? ` • ${r.building.buildingName}`
                                  : ''}
                              </option>
                            ))}
                          </select>
                        )}
                        {roomsQuery.isLoading && !isRoomLocked && (
                          <p className="text-xs text-slate-400 mt-2">
                            Loading rooms...
                          </p>
                        )}
                        {roomsQuery.isError && !isRoomLocked && (
                          <p className="text-xs text-red-600 mt-2">
                            Failed to load rooms.
                          </p>
                        )}
                      </div>

                      <div className="hidden md:block" />

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                          Start Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                          <input
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={startTime}
                          onChange={e => setStartTime(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                          End Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                          <input
                            type="date"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={endTime}
                          onChange={e => setEndTime(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                    </div>
                  </section>

                  <div className="h-px bg-slate-100" />

                  <section>
                    <p className="text-xs font-bold text-primary uppercase tracking-wider">
                      Room Details
                    </p>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Amenities
                        </p>
                        <div className="border border-slate-200 rounded-xl p-3 max-h-56 overflow-auto">
                          {!roomId ? (
                            <p className="text-sm text-slate-400">
                              Select a room to see available amenities.
                            </p>
                          ) : allAmenitiesQuery.isLoading ? (
                            <p className="text-sm text-slate-400">Loading...</p>
                          ) : allAmenitiesQuery.isError ? (
                            <p className="text-sm text-red-600">
                              Failed to load amenities.
                            </p>
                          ) : roomExtrasQuery.isLoading ? (
                            <p className="text-sm text-slate-400">Loading...</p>
                          ) : allAmenities.length === 0 ? (
                            <p className="text-sm text-slate-400">
                              No amenities available.
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {allAmenities.map(a => {
                                const isAvailable = roomAmenityIdSet.has(a.id);
                                return (
                                  <label
                                    key={a.id}
                                    className={`flex items-center gap-2 text-sm ${
                                      isAvailable
                                        ? 'text-slate-700'
                                        : 'text-slate-400'
                                    } cursor-pointer`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedAmenityIds.has(a.id)}
                                      onChange={() => toggleAmenity(a.id)}
                                      className="size-4 accent-primary"
                                    />
                                    {a.name}
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Services
                        </p>
                        <div className="border border-slate-200 rounded-xl p-3 max-h-56 overflow-auto">
                          {!roomId ? (
                            <p className="text-sm text-slate-400">
                              Select a room to see available services.
                            </p>
                          ) : allServiceCategoriesQuery.isLoading ? (
                            <p className="text-sm text-slate-400">Loading...</p>
                          ) : allServiceCategoriesQuery.isError ? (
                            <p className="text-sm text-red-600">
                              Failed to load services.
                            </p>
                          ) : allServiceCategories.length === 0 ? (
                            <p className="text-sm text-slate-400">
                              No services available.
                            </p>
                          ) : (
                            <div className="space-y-4">
                              {allServiceCategories.map(cat => (
                                <div key={cat.id}>
                                  <p className="text-sm font-semibold text-slate-800">
                                    {cat.name}
                                  </p>
                                  {cat.description && (
                                    <p className="text-xs text-slate-400 mt-0.5">
                                      {cat.description}
                                    </p>
                                  )}
                                  <div className="mt-2 space-y-2">
                                    {cat.services.map(svc => {
                                      const qty = selectedServices[svc.id] ?? 0;
                                      return (
                                        <div
                                          key={svc.id}
                                          className="flex items-center justify-between gap-3"
                                        >
                                          <div className="min-w-0">
                                            <p className="text-sm truncate text-slate-700">
                                              {svc.name}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                              {formatVND(svc.price)}
                                            </p>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <button
                                              type="button"
                                              onClick={() =>
                                                setServiceQty(svc.id, qty - 1)
                                              }
                                              disabled={qty <= 0}
                                              className="size-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                              aria-label="decrease"
                                            >
                                              <Minus className="size-4 text-slate-500" />
                                            </button>
                                            <div className="w-10 text-center text-sm font-semibold text-slate-800">
                                              {qty}
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                setServiceQty(svc.id, qty + 1)
                                              }
                                              className="size-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                              aria-label="increase"
                                            >
                                              <Plus className="size-4 text-slate-500" />
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Purpose
                        </p>
                        <span className="text-xs text-slate-400">Optional</span>
                      </div>
                      <textarea
                        value={purpose}
                        onChange={e => setPurpose(e.target.value.slice(0, 500))}
                        placeholder="Describe the purpose of this booking"
                        className="mt-2 w-full min-h-28 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 resize-none"
                      />
                      <p className="text-xs text-slate-400 mt-2 text-right">
                        {purpose.length}/500 characters
                      </p>
                    </div>
                  </section>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-900">
                      Booking Details
                    </p>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-2"
                    >
                      <Pencil className="size-4" />
                      Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Space Selected
                      </p>
                      <p className="mt-2 text-slate-900 font-semibold">
                        {effectiveRoom?.name ?? '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Total Duration
                      </p>
                      <p className="mt-2 text-slate-900 font-semibold">
                        {hours ? `${hours} Hours` : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Start Time
                      </p>
                      <p className="mt-2 text-slate-900 font-semibold">
                        {startIso
                          ? `${formatDateLabel(startIso)} ${formatTimeLabel(startIso)}`
                          : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        End Time
                      </p>
                      <p className="mt-2 text-slate-900 font-semibold">
                        {endIso
                          ? `${formatDateLabel(endIso)} ${formatTimeLabel(endIso)}`
                          : '—'}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Amenities
                      </p>
                      {selectedAmenityList.length === 0 ? (
                        <p className="text-sm text-slate-400">—</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {selectedAmenityList.map(a => (
                            <span
                              key={a.id}
                              className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold"
                            >
                              {a.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Services
                      </p>
                      {selectedServiceLines.length === 0 ? (
                        <p className="text-sm text-slate-400">—</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedServiceLines.map(s => (
                            <div
                              key={s.serviceId}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-slate-700">
                                {s.name} (x{s.quantity})
                              </span>
                              <span className="font-semibold text-slate-900">
                                {formatVND(s.lineTotal)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Purpose / Notes
                    </p>
                    <textarea
                      value={purpose}
                      onChange={e => setPurpose(e.target.value.slice(0, 500))}
                      placeholder="Describe the purpose of this booking"
                      className="w-full min-h-24 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 resize-none"
                    />
                    <p className="text-xs text-slate-400 mt-2 text-right">
                      {purpose.length}/500 characters
                    </p>
                  </div>

                  <p className="text-xs text-slate-400">
                    By clicking "Submit booking request", you agree to the
                    SpacePocker Terms of Service and Privacy Policy.
                  </p>

                  {createBooking.isError && (
                    <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                      {bookingErrorMessage}
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="py-8 flex flex-col items-center text-center gap-4">
                  <div className="size-16 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="size-8 text-green-700" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-900">
                    Booking request submitted!
                  </h2>
                  <p className="text-sm text-slate-500 max-w-md">
                    We\'ve recorded your booking request. Once your manager
                    approves it, you can proceed with payment from My Bookings.
                  </p>
                  <div className="mt-2 px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Booking Reference
                    </p>
                    <p className="mt-2 text-xl font-extrabold text-slate-900">
                      {confirmedId ?? '—'}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => navigate('/user/bookings')}
                      className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 transition-all"
                    >
                      Go to My Bookings
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer nav */}
            {step !== 3 && (
              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (step === 1) navigate(-1);
                    else setStep((step - 1) as Step);
                  }}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700"
                >
                  <ChevronLeft className="size-4" />
                  Back
                </button>

                {step === 1 && (
                  <button
                    type="button"
                    disabled={!canGoNextFromInfo}
                    onClick={() => setStep(2)}
                    className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                  >
                    Next: Review
                  </button>
                )}

                {step === 2 && (
                  <button
                    type="button"
                    disabled={createBooking.isPending || !canGoNextFromInfo}
                    onClick={handleSubmitBookingRequest}
                    className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                  >
                    {createBooking.isPending
                      ? 'Submitting...'
                      : 'Submit booking request'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
              <div className="aspect-4/3 bg-slate-200">
                {effectiveRoom?.images?.[0] ? (
                  <img
                    src={effectiveRoom.images[0]}
                    alt={effectiveRoom.name}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
              <div className="p-6">
                <p className="font-extrabold text-slate-900">
                  {rightCardTitle}
                </p>

                <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Calendar className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {startIso ? formatDateLabel(startIso) : '—'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {startIso && endIso
                          ? `${formatTimeLabel(startIso)} - ${formatTimeLabel(endIso)} (${hours}h)`
                          : '—'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>
                      Rate ({hours} hrs x {formatVND(pricing.rate)})
                    </span>
                    <span className="font-semibold text-slate-900">
                      {formatVND(pricing.roomLine)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Services</span>
                    <span className="font-semibold text-slate-900">
                      {formatVND(pricing.servicesLine)}
                    </span>
                  </div>
                  <div className="h-px bg-slate-100 my-2" />
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-slate-500">Total Amount</p>
                      <p className="text-2xl font-extrabold text-slate-900">
                        {formatVND(pricing.total)}
                      </p>
                    </div>
                    <div className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold">
                      VND
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-white rounded-2xl border border-slate-100 shadow-soft p-5">
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <HelpCircle className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Cancellation Policy
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Free cancellation up to 24 hours before the booking start
                    time.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingRequestWizardPage;
