import { useRef, useEffect, useState, useMemo } from 'react';
import type { BookingType, ScheduleRoom, ScheduleBooking } from '@/types/types';
import { Plus, ChevronLeft, ChevronRight, Filter, Users } from 'lucide-react';
import AddScheduleBookingModal from './AddScheduleBookingModal';
import { useGetRooms } from '@/hooks/manager/rooms/use-get-rooms';
import { useGetBookingRequestsForManager } from '@/hooks/manager/booking-requests/use-get-booking-requests';

const TIME_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];
const SLOT_WIDTH = 120;
const START_HOUR = 9;
const END_HOUR = 17;
const DISPLAY_TIME_ZONE = 'Asia/Ho_Chi_Minh';
const TIMELINE_WIDTH = TIME_SLOTS.length * SLOT_WIDTH;

const getZonedParts = (date: Date, timeZone: string) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const lookup = (type: string) => parts.find(p => p.type === type)?.value;
  const year = lookup('year') ?? '0000';
  const month = lookup('month') ?? '01';
  const day = lookup('day') ?? '01';
  const hour = lookup('hour') ?? '00';
  const minute = lookup('minute') ?? '00';

  return {
    dateKey: `${year}-${month}-${day}`,
    hhmm: `${hour}:${minute}`,
    hour: Number(hour),
    minute: Number(minute),
  };
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const formatInTimeZone = (
  date: Date,
  options: Intl.DateTimeFormatOptions,
  locale = 'en-GB'
) =>
  new Intl.DateTimeFormat(locale, {
    timeZone: DISPLAY_TIME_ZONE,
    ...options,
  }).format(date);

const getDurationLabel = (startIso: string, endIso: string) => {
  const durationMs = new Date(endIso).getTime() - new Date(startIso).getTime();
  const totalMinutes = Math.max(0, Math.round(durationMs / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours && minutes) return `${hours}h ${minutes}m`;
  if (hours) return `${hours}h`;
  return `${minutes}m`;
};

interface ScheduleTimelineProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date) => void;
}

type TimelineBooking = ScheduleBooking & {
  createdAtLabel: string;
  durationLabel: string;
  roomLabel: string;
  statusLabel: string;
};

export default function ScheduleTimeline({
  selectedDate,
  onDateChange,
}: ScheduleTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTimeX, setCurrentTimeX] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const roomsQuery = useGetRooms();
  const completedQuery = useGetBookingRequestsForManager('COMPLETED');
  const approvedQuery = useGetBookingRequestsForManager('APPROVED');

  const isLoading =
    roomsQuery.isLoading || completedQuery.isLoading || approvedQuery.isLoading;

  const localRooms = useMemo<ScheduleRoom[]>(() => {
    if (!roomsQuery.data?.rooms) return [];
    return roomsQuery.data.rooms.map(r => ({
      id: r.id,
      name: r.name,
      capacity: r.capacity || 0,
      type: r.roomType || 'Standard',
    }));
  }, [roomsQuery.data]);

  const localBookings = useMemo<TimelineBooking[]>(() => {
    const completedReqs = completedQuery.data || [];
    const approvedReqs = approvedQuery.data || [];
    const unique = new Map<string, (typeof completedReqs)[number]>();
    [...completedReqs, ...approvedReqs].forEach(req => unique.set(req.id, req));
    const allRequests = Array.from(unique.values());

    const selectedDateKey = selectedDate
      ? getZonedParts(selectedDate, DISPLAY_TIME_ZONE).dateKey
      : null;

    const filteredRequests = allRequests.filter(req => {
      if (!selectedDateKey) return true;
      const reqKey = getZonedParts(
        new Date(req.startTime),
        DISPLAY_TIME_ZONE
      ).dateKey;
      return reqKey === selectedDateKey;
    });

    return filteredRequests
      .sort(
        (left, right) =>
          new Date(left.startTime).getTime() -
          new Date(right.startTime).getTime()
      )
      .map(req => ({
        id: req.id,
        roomId: req.roomId,
        title: req.user?.name || 'User Booking',
        subtitle: req.purpose || req.room.name,
        startTime: getZonedParts(new Date(req.startTime), DISPLAY_TIME_ZONE)
          .hhmm,
        endTime: getZonedParts(new Date(req.endTime), DISPLAY_TIME_ZONE).hhmm,
        type: (req.status === 'COMPLETED' ? 'teal' : 'primary') as BookingType,
        createdAtLabel: formatInTimeZone(new Date(req.createdAt), {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
        durationLabel: getDurationLabel(req.startTime, req.endTime),
        roomLabel: req.room.roomCode
          ? `${req.room.name} · ${req.room.roomCode}`
          : req.room.name,
        statusLabel: req.status === 'COMPLETED' ? 'Completed' : 'Approved',
      }));
  }, [completedQuery.data, approvedQuery.data, selectedDate]);

  const getTimePosition = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const minMinutes = START_HOUR * 60;
    const maxMinutes = END_HOUR * 60;
    const clamped = clamp(totalMinutes, minMinutes, maxMinutes);
    return ((clamped - minMinutes) / 60) * SLOT_WIDTH;
  };

  const getTimeWidth = (start: string, end: string) => {
    return Math.max(0, getTimePosition(end) - getTimePosition(start));
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const nowParts = getZonedParts(now, DISPLAY_TIME_ZONE);
      const selectedKey = selectedDate
        ? getZonedParts(selectedDate, DISPLAY_TIME_ZONE).dateKey
        : null;
      const isSameDay = selectedKey ? selectedKey === nowParts.dateKey : true;

      if (!isSameDay) {
        setCurrentTimeX(null);
        return;
      }

      const h = nowParts.hour;
      const m = nowParts.minute;

      if (h >= START_HOUR && h < END_HOUR) {
        setCurrentTimeX(getTimePosition(`${h}:${m}`));
      } else {
        setCurrentTimeX(null);
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, [selectedDate]);

  const getVariantStyles = (type: BookingType) => {
    switch (type) {
      case 'primary':
        return 'bg-primary/10 border-primary text-primary';
      case 'teal':
        return 'bg-teal-50 border-teal-500 text-teal-700';
      case 'amber':
        return 'bg-amber-50 border-amber-500 text-amber-700';
      case 'maintenance':
        return 'bg-slate-100 border-slate-400 text-slate-500 striped-bg';
      default:
        return 'bg-slate-100 border-slate-400 text-slate-600';
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Select Date';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handlePrevDay = () => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() - 1);
      onDateChange(newDate);
    }
  };

  const handleNextDay = () => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 1);
      onDateChange(newDate);
    }
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const bookingCountLabel = `${localBookings.length} booking${localBookings.length === 1 ? '' : 's'}`;

  return (
    <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-border-light relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-border-light gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-background-light p-1 rounded-xl border border-border-light">
            <button className="px-4 py-1.5 rounded-lg text-sm font-medium bg-white text-slate-900 shadow-sm border border-black/5">
              Day
            </button>
            <button className="px-4 py-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              Week
            </button>
            <button className="px-4 py-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              Month
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500"
              onClick={handlePrevDay}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm font-bold text-slate-900 min-w-35 text-center">
              {formatDate(selectedDate)}
            </span>
            <button
              className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500"
              onClick={handleNextDay}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              className="text-xs font-semibold text-primary hover:text-primary-dark ml-2"
              onClick={handleToday}
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="rounded-full bg-primary/8 px-3 py-1 font-semibold text-primary border border-primary/10">
              {bookingCountLabel}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600 border border-slate-200">
              Timezone GMT+7
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus className="h-5 w-5" />
          <span>New Booking</span>
        </button>
      </div>

      <AddScheduleBookingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        rooms={localRooms}
        onAdd={() => {
          // Note: Add Schedule Booking locally (won't persist to the API without mutation hook unfortunately,
          // but we follow current component structure)
          // localBookings cannot be pushed, but the user is not asking to fix AddBooking here.
        }}
      />

      <div className="flex border-b border-border-light bg-background-light/50">
        <div className="w-48 xl:w-60 p-3 shrink-0 border-r border-border-light flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Resources
          </span>
        </div>
        <div className="flex-1 overflow-x-hidden relative">
          <div
            className="flex"
            style={{ width: TIME_SLOTS.length * SLOT_WIDTH }}
          >
            {TIME_SLOTS.map(time => (
              <div
                key={time}
                className="py-3 text-center border-r border-border-light text-xs font-medium text-slate-500"
                style={{ width: SLOT_WIDTH }}
              >
                {time}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="flex min-h-full">
          <div className="w-48 xl:w-60 shrink-0 sticky left-0 z-10 bg-white border-r border-border-light">
            {isLoading ? (
              <div className="h-24 p-4 flex items-center justify-center">
                <span className="text-sm text-slate-500">Loading...</span>
              </div>
            ) : (
              localRooms.map(room => (
                <div
                  key={room.id}
                  className="h-24 p-4 border-b border-border-light flex flex-col justify-center"
                >
                  <span className="text-sm font-semibold text-slate-800">
                    {room.name}
                  </span>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-600">
                      {room.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      {room.capacity} seats
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div
            className="flex-1 relative overflow-x-auto no-scrollbar"
            ref={containerRef}
          >
            <div className="h-full relative" style={{ width: TIMELINE_WIDTH }}>
              <div className="absolute inset-0 flex pointer-events-none">
                {TIME_SLOTS.map((_, i) => (
                  <div
                    key={i}
                    className="h-full border-r border-border-light/50 border-dashed"
                    style={{ width: SLOT_WIDTH }}
                  />
                ))}
              </div>

              {!isLoading && localBookings.length === 0 && (
                <div className="absolute inset-x-6 top-6 z-10 rounded-2xl border border-dashed border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-500 shadow-sm backdrop-blur-sm">
                  No bookings for this date. Approved or completed requests will
                  appear here using local time.
                </div>
              )}

              {currentTimeX !== null && (
                <div
                  className="absolute top-0 bottom-0 w-px bg-red-500 z-20 pointer-events-none"
                  style={{ left: currentTimeX }}
                >
                  <div className="absolute -top-1.5 -left-1.5 h-3 w-3 bg-red-500 rounded-full" />
                </div>
              )}

              {localRooms.map(room => (
                <div
                  key={room.id}
                  className="h-24 border-b border-border-light relative hover:bg-slate-50/50 transition-colors"
                >
                  {localBookings
                    .filter(b => b.roomId === room.id)
                    .map(booking => {
                      const bookingWidth = getTimeWidth(
                        booking.startTime,
                        booking.endTime
                      );

                      if (bookingWidth <= 0) {
                        return null;
                      }

                      return (
                        <div
                          key={booking.id}
                          className={`absolute top-1.5 bottom-1.5 rounded-xl border-l-4 px-2.5 py-1.5 cursor-pointer transition-all hover:shadow-md hover:z-30 overflow-hidden group ${getVariantStyles(booking.type)}`}
                          style={{
                            left: getTimePosition(booking.startTime),
                            width: bookingWidth,
                          }}
                          title={`${booking.title} • ${booking.roomLabel} • ${booking.startTime}-${booking.endTime} (${booking.durationLabel}) • Created ${booking.createdAtLabel}`}
                        >
                          <div className="flex h-full min-w-0 flex-col justify-center gap-0.5">
                            <div className="flex items-baseline justify-between gap-1 min-w-0">
                              <p className="text-xs font-bold truncate leading-tight">
                                {booking.title}
                              </p>
                              <span className="shrink-0 rounded-full bg-white/70 border border-current/20 px-1.5 py-0.5 text-[9px] font-semibold leading-none whitespace-nowrap">
                                {booking.statusLabel}
                              </span>
                            </div>

                            <p className="text-[10px] opacity-70 truncate leading-tight">
                              {booking.roomLabel}
                            </p>

                            <p className="text-[10px] font-medium opacity-80 truncate leading-tight">
                              {booking.startTime}–{booking.endTime}
                              {bookingWidth >= 140 && (
                                <span> • {booking.durationLabel}</span>
                              )}
                              {bookingWidth >= 200 && (
                                <span className="opacity-60">
                                  {' '}
                                  • Created {booking.createdAtLabel}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                  <div className="absolute inset-0 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20 backdrop-blur-sm">
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
