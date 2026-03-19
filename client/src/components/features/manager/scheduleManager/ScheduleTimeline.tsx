import { useEffect, useMemo, useState } from 'react';
import { useGetBookingRequestsForManager } from '@/hooks/manager/booking-requests/use-get-booking-requests';
import type { BookingRequestForManager } from '@/types/user/booking-request-api';
import type { BookingType, ScheduleBooking, ScheduleRoom } from '@/types/user/types';
import AddScheduleBookingModal from './AddScheduleBookingModal';

type ViewMode = 'day' | 'week' | 'month';

interface ScheduleTimelineProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

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
const DAY_COLUMN_WIDTH = 140;

interface TimelineBooking extends ScheduleBooking {
  startDate: Date;
  endDate: Date;
}

const toStartOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const addMonths = (date: Date, months: number) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
};

const getStartOfWeek = (date: Date) => {
  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  return toStartOfDay(addDays(date, mondayOffset));
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const toTimeLabel = (date: Date) =>
  date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const toDayKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

const formatToHourMinute = (date: Date) =>
  date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

const combineDateAndTime = (date: Date, time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
};

const mapRequestToBookingType = (
  status: BookingRequestForManager['status']
): BookingType => {
  if (status === 'COMPLETED') {
    return 'teal';
  }
  return 'primary';
};

const getBookingVariantClass = (type: BookingType) => {
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

export default function ScheduleTimeline({
  selectedDate,
  onDateChange,
}: ScheduleTimelineProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [currentTimeX, setCurrentTimeX] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [localBookings, setLocalBookings] = useState<TimelineBooking[]>([]);

  const completedQuery = useGetBookingRequestsForManager('COMPLETED');
  const approvedQuery = useGetBookingRequestsForManager('APPROVED');

  const requests = useMemo(
    () => [...(approvedQuery.data ?? []), ...(completedQuery.data ?? [])],
    [approvedQuery.data, completedQuery.data]
  );

  const rooms = useMemo<ScheduleRoom[]>(() => {
    const roomMap = new Map<string, ScheduleRoom>();

    requests.forEach(request => {
      if (!request.room?.id) {
        return;
      }

      if (!roomMap.has(request.room.id)) {
        roomMap.set(request.room.id, {
          id: request.room.id,
          name: request.room.name || request.room.roomCode || 'Unknown room',
          type: 'Room',
          capacity: 0,
        });
      }
    });

    return Array.from(roomMap.values());
  }, [requests]);

  const apiBookings = useMemo<TimelineBooking[]>(() => {
    return requests.reduce<TimelineBooking[]>((acc, request) => {
      const startDate = new Date(request.startTime);
      const endDate = new Date(request.endTime);

      if (
        !request.roomId ||
        Number.isNaN(startDate.getTime()) ||
        Number.isNaN(endDate.getTime())
      ) {
        return acc;
      }

      const title = request.purpose?.trim() || request.user?.name || 'Booking';
      const subtitle = `${request.room?.name ?? 'Room'} • ${request.user?.name ?? 'User'}`;

      acc.push({
        id: request.id,
        roomId: request.roomId,
        title,
        subtitle,
        startTime: formatToHourMinute(startDate),
        endTime: formatToHourMinute(endDate),
        type: mapRequestToBookingType(request.status),
        icon: request.status === 'COMPLETED' ? 'task_alt' : 'event_available',
        startDate,
        endDate,
      });

      return acc;
    }, []);
  }, [requests]);

  const bookings = useMemo(
    () => [...apiBookings, ...localBookings],
    [apiBookings, localBookings]
  );

  const currentDate = useMemo(
    () => toStartOfDay(selectedDate ?? new Date()),
    [selectedDate]
  );

  const dayColumns = useMemo(() => {
    if (viewMode === 'day') {
      return [currentDate];
    }

    if (viewMode === 'week') {
      const weekStart = getStartOfWeek(currentDate);
      return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    }

    const monthStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const totalDays = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();

    return Array.from({ length: totalDays }, (_, i) => addDays(monthStart, i));
  }, [currentDate, viewMode]);

  const timelineWidth =
    viewMode === 'day'
      ? TIME_SLOTS.length * SLOT_WIDTH
      : dayColumns.length * DAY_COLUMN_WIDTH;

  const periodLabel = useMemo(() => {
    if (viewMode === 'day') {
      return toTimeLabel(currentDate);
    }

    if (viewMode === 'week') {
      const start = dayColumns[0];
      const end = dayColumns[dayColumns.length - 1];
      const sameMonth = start.getMonth() === end.getMonth();
      const left = start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      const right = end.toLocaleDateString('en-US', {
        month: sameMonth ? undefined : 'short',
        day: 'numeric',
        year: 'numeric',
      });
      return `${left} - ${right}`;
    }

    return currentDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }, [currentDate, dayColumns, viewMode]);

  const periodBookingCount = useMemo(() => {
    const periodKeys = new Set(dayColumns.map(day => toDayKey(day)));
    return bookings.filter(booking =>
      periodKeys.has(toDayKey(toStartOfDay(booking.startDate)))
    ).length;
  }, [bookings, dayColumns]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();

      if (h >= START_HOUR && h < END_HOUR) {
        const totalMinutes = (h - START_HOUR) * 60 + m;
        setCurrentTimeX((totalMinutes / 60) * SLOT_WIDTH);
      } else {
        setCurrentTimeX(2.5 * SLOT_WIDTH);
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const goToPrev = () => {
    if (viewMode === 'day') {
      onDateChange(addDays(currentDate, -1));
      return;
    }

    if (viewMode === 'week') {
      onDateChange(addDays(currentDate, -7));
      return;
    }

    onDateChange(addMonths(currentDate, -1));
  };

  const goToNext = () => {
    if (viewMode === 'day') {
      onDateChange(addDays(currentDate, 1));
      return;
    }

    if (viewMode === 'week') {
      onDateChange(addDays(currentDate, 7));
      return;
    }

    onDateChange(addMonths(currentDate, 1));
  };

  const handleGoToToday = () => {
    onDateChange(new Date());
  };

  const getTimePosition = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = (hours - START_HOUR) * 60 + minutes;
    return (totalMinutes / 60) * SLOT_WIDTH;
  };

  const getTimeWidth = (start: string, end: string) => {
    return getTimePosition(end) - getTimePosition(start);
  };

  const shouldShowCurrentTime =
    viewMode === 'day' && isSameDay(currentDate, toStartOfDay(new Date()));

  const handleAddBooking = (newBooking: Omit<ScheduleBooking, 'id'>) => {
    const bookingDate = toStartOfDay(selectedDate ?? new Date());
    const startDate = combineDateAndTime(bookingDate, newBooking.startTime);
    const endDate = combineDateAndTime(bookingDate, newBooking.endTime);

    setLocalBookings(prev => [
      ...prev,
      {
        ...newBooking,
        id: `b-${Date.now()}`,
        startDate,
        endDate,
      },
    ]);
  };

  const isLoadingBookings = approvedQuery.isLoading || completedQuery.isLoading;
  const isErrorBookings = approvedQuery.isError || completedQuery.isError;

  const getBookingsForRoomByDay = (roomId: string, day: Date) => {
    const dayKey = toDayKey(day);
    return bookings
      .filter(booking => booking.roomId === roomId)
      .filter(booking => toDayKey(toStartOfDay(booking.startDate)) === dayKey);
  };

  return (
    <>
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-border-light relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-border-light gap-4">
          <div className="flex items-center gap-4">
            <div className="flex bg-background-light p-1 rounded-xl border border-border-light">
              {(['day', 'week', 'month'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === mode
                      ? 'bg-white text-slate-900 shadow-sm border border-black/5'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {mode[0].toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={goToPrev}
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <span className="text-sm font-bold text-slate-900 min-w-32 text-center">
                {periodLabel}
              </span>
              <button
                onClick={goToNext}
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
              <button
                onClick={handleGoToToday}
                className="text-xs font-semibold text-primary hover:text-primary-dark ml-2"
              >
                Today
              </button>
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                {periodBookingCount} bookings
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>New Booking</span>
          </button>
        </div>

        <div className="flex border-b border-border-light bg-background-light/50">
          <div className="w-48 xl:w-60 p-3 shrink-0 border-r border-border-light flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-400 text-sm">
              filter_alt
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Resources
            </span>
          </div>
          <div className="flex-1 overflow-x-auto relative no-scrollbar">
            <div className="flex" style={{ width: timelineWidth }}>
              {viewMode === 'day'
                ? TIME_SLOTS.map(time => (
                    <div
                      key={time}
                      className="py-3 text-center border-r border-border-light text-xs font-medium text-slate-500"
                      style={{ width: SLOT_WIDTH }}
                    >
                      {time}
                    </div>
                  ))
                : dayColumns.map(day => (
                    <div
                      key={day.toISOString()}
                      className="py-3 text-center border-r border-border-light text-xs font-medium text-slate-500"
                      style={{ width: DAY_COLUMN_WIDTH }}
                    >
                      {day.toLocaleDateString('en-US', {
                        weekday: viewMode === 'week' ? 'short' : undefined,
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="flex min-h-full">
            <div className="w-48 xl:w-60 shrink-0 sticky left-0 z-10 bg-white border-r border-border-light">
              {rooms.map(room => (
                <div
                  key={room.id}
                  className="h-24 p-4 border-b border-border-light flex flex-col justify-center"
                >
                  <span className="text-sm font-semibold text-slate-800">
                    {room.name}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[10px]">
                      group
                    </span>{' '}
                    {room.type}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex-1 relative overflow-x-auto no-scrollbar">
              <div className="h-full relative" style={{ width: timelineWidth }}>
                <div className="absolute inset-0 flex pointer-events-none">
                  {(viewMode === 'day' ? TIME_SLOTS : dayColumns).map(
                    (item, i) => (
                      <div
                        key={
                          viewMode === 'day'
                            ? String(item)
                            : dayColumns[i].toISOString()
                        }
                        className="h-full border-r border-border-light/50 border-dashed"
                        style={{
                          width:
                            viewMode === 'day' ? SLOT_WIDTH : DAY_COLUMN_WIDTH,
                        }}
                      />
                    )
                  )}
                </div>

                {shouldShowCurrentTime && (
                  <div
                    className="absolute top-0 bottom-0 w-px bg-red-500 z-20 pointer-events-none"
                    style={{ left: currentTimeX }}
                  >
                    <div className="absolute -top-1.5 -left-1.5 h-3 w-3 bg-red-500 rounded-full" />
                  </div>
                )}

                {rooms.map(room => (
                  <div
                    key={room.id}
                    className="h-24 border-b border-border-light relative hover:bg-slate-50/50 transition-colors"
                  >
                    {viewMode === 'day' &&
                      getBookingsForRoomByDay(room.id, currentDate).map(
                        booking => (
                          <div
                            key={booking.id}
                            className={`absolute top-2 bottom-2 border-l-4 rounded-r-md px-3 py-2 cursor-pointer hover:shadow-md transition-shadow flex items-center gap-3 overflow-hidden ${getBookingVariantClass(
                              booking.type
                            )}`}
                            style={{
                              left: Math.max(
                                0,
                                getTimePosition(booking.startTime)
                              ),
                              width: Math.max(
                                12,
                                getTimeWidth(booking.startTime, booking.endTime)
                              ),
                            }}
                          >
                            {booking.icon && (
                              <div
                                className={`p-1 rounded shrink-0 ${booking.type === 'primary' ? 'bg-primary/20' : 'bg-black/5'}`}
                              >
                                <span className="material-symbols-outlined text-sm">
                                  {booking.icon}
                                </span>
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-bold truncate">
                                {booking.title}
                              </p>
                              <p className="text-[10px] opacity-70 truncate">
                                {room.name} · {booking.startTime}-
                                {booking.endTime}
                              </p>
                            </div>
                          </div>
                        )
                      )}

                    {viewMode !== 'day' && (
                      <div className="absolute inset-0 flex">
                        {dayColumns.map(day => {
                          const dayBookings = getBookingsForRoomByDay(
                            room.id,
                            day
                          ).slice(0, 2);

                          return (
                            <div
                              key={`${room.id}-${day.toISOString()}`}
                              className="h-full border-r border-border-light/40 px-1 py-1.5"
                              style={{ width: DAY_COLUMN_WIDTH }}
                            >
                              <div className="flex flex-col gap-1">
                                {dayBookings.map(booking => (
                                  <div
                                    key={booking.id}
                                    className={`rounded-md border-l-2 px-2 py-1 text-[10px] leading-tight ${getBookingVariantClass(
                                      booking.type
                                    )}`}
                                  >
                                    <p className="font-semibold truncate">
                                      {booking.title}
                                    </p>
                                    <p className="opacity-70 truncate">
                                      {booking.startTime}-{booking.endTime}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="absolute inset-0 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20 backdrop-blur-sm"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                ))}

                {!isLoadingBookings &&
                  !isErrorBookings &&
                  rooms.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-500">
                      No approved/completed booking requests to display.
                    </div>
                  )}

                {isLoadingBookings && (
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-500 bg-white/70">
                    Loading schedule from booking requests...
                  </div>
                )}

                {isErrorBookings && (
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-red-600 bg-white/70">
                    Failed to load approved/completed booking requests.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddScheduleBookingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        rooms={rooms}
        onAdd={handleAddBooking}
      />
    </>
  );
}
