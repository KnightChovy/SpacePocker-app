import { Gem, CalendarIcon, Users } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn, formatVND } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';

interface SpaceDetailBookingProps {
  spaceId: string;
  price: number;
  rating: number;
  capacity: number;
}

const MIN_BOOKING_HOURS = 1;
const MAX_BOOKING_HOURS = 8;
const HOUR_IN_MS = 60 * 60 * 1000;

const pad2 = (value: number) => value.toString().padStart(2, '0');

const getDateKey = (date: Date) => {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
};

const buildDateWithTime = (date: Date, time: string) => {
  const [hour, minute] = time.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hour, minute, 0, 0);
  return result;
};

const formatHHmm = (date: Date) => {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
};

const formatTimeDisplay = (time: string) => {
  const [hour] = time.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:00 ${period}`;
};

const formatEndDateTimeDisplay = (target: Date, start: Date) => {
  const dayOffset = Math.floor(
    (new Date(
      target.getFullYear(),
      target.getMonth(),
      target.getDate()
    ).getTime() -
      new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate()
      ).getTime()) /
      (24 * HOUR_IN_MS)
  );

  if (dayOffset > 0) {
    return `${formatTimeDisplay(formatHHmm(target))} (+${dayOffset} day)`;
  }

  return formatTimeDisplay(formatHHmm(target));
};

const SpaceDetailBooking: React.FC<SpaceDetailBookingProps> = ({
  spaceId,
  price,
  capacity,
}) => {
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState<string>('10:00');
  const [endValue, setEndValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60_000);
    return () => clearInterval(timer);
  }, []);

  const maxDate = useMemo(() => {
    const today = new Date();
    const max = new Date(today);
    max.setDate(today.getDate() + 30);
    return max;
  }, []);

  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const accessToken = useAuthStore(s => s.accessToken);

  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let hour = 6; hour <= 23; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      slots.push(timeString);
    }
    return slots;
  }, []);

  const dateKey = useMemo(() => (date ? getDateKey(date) : null), [date]);
  const todayKey = useMemo(() => getDateKey(now), [now]);

  const availableStartTimes = useMemo(() => {
    if (!date || !dateKey) return timeSlots;
    if (dateKey !== todayKey) return timeSlots;

    return timeSlots.filter(slot => {
      const slotDateTime = buildDateWithTime(date, slot);
      return slotDateTime.getTime() >= now.getTime();
    });
  }, [date, dateKey, now, timeSlots, todayKey]);

  const effectiveStartTime = useMemo(() => {
    if (availableStartTimes.includes(startTime)) return startTime;
    return availableStartTimes[0] ?? '';
  }, [availableStartTimes, startTime]);

  const startDateTime = useMemo(() => {
    if (!date || !effectiveStartTime) return null;
    return buildDateWithTime(date, effectiveStartTime);
  }, [date, effectiveStartTime]);

  const availableEndOptions = useMemo(() => {
    if (!startDateTime)
      return [] as Array<{
        value: string;
        date: string;
        time: string;
        label: string;
        hours: number;
      }>;

    return Array.from({ length: MAX_BOOKING_HOURS }, (_, index) => {
      const duration = index + MIN_BOOKING_HOURS;
      const endDateTime = new Date(
        startDateTime.getTime() + duration * HOUR_IN_MS
      );

      return {
        value: endDateTime.toISOString(),
        date: getDateKey(endDateTime),
        time: formatHHmm(endDateTime),
        label: formatEndDateTimeDisplay(endDateTime, startDateTime),
        hours: duration,
      };
    });
  }, [startDateTime]);

  const effectiveEndValue = useMemo(() => {
    if (availableEndOptions.length === 0) return '';
    if (availableEndOptions.some(option => option.value === endValue)) {
      return endValue;
    }
    return availableEndOptions[0].value;
  }, [availableEndOptions, endValue]);

  const selectedEndOption = useMemo(
    () =>
      availableEndOptions.find(option => option.value === effectiveEndValue) ??
      null,
    [availableEndOptions, effectiveEndValue]
  );

  const hours = useMemo(() => {
    return selectedEndOption?.hours ?? 0;
  }, [selectedEndOption]);

  const totalPrice = useMemo(() => {
    return price * hours;
  }, [hours, price]);

  const hasValidBookingWindow = Boolean(
    date && effectiveStartTime && selectedEndOption
  );

  const handleBooking = async () => {
    if (!date || !selectedEndOption || !effectiveStartTime) {
      alert('Please select a date');
      return;
    }

    if (hours < MIN_BOOKING_HOURS || hours > MAX_BOOKING_HOURS) {
      alert('Please select valid time range');
      return;
    }

    setIsLoading(true);
    try {
      if (!accessToken || !user || user.role !== 'USER') {
        navigate('/auth-login');
        return;
      }

      const day = format(date, 'yyyy-MM-dd');
      const search = new URLSearchParams({
        roomId: spaceId,
        startDate: day,
        endDate: selectedEndOption.date,
        startTime: effectiveStartTime,
        endTime: selectedEndOption.time,
      });

      navigate(`/user/booking?${search.toString()}`);
    } catch (error) {
      console.error('❌ Booking Error:', error);
      alert('Failed to start booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 flex flex-col gap-6">
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-gray-900">
            {formatVND(price)}
          </span>
          <span className="text-gray-500 font-medium">/ hour</span>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200">
        <div className="flex divide-x divide-gray-200 h-h-18">
          <div className="w-2/3 p-3 hover:bg-gray-50 transition-colors flex flex-col justify-center">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 leading-none">
              Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start text-left font-normal p-0 h-6 hover:bg-transparent leading-none',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                  <span className="text-sm truncate leading-none block overflow-hidden whitespace-nowrap text-ellipsis">
                    {date ? format(date, 'MMMM do') : 'Pick a date'}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={date => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today || date > maxDate;
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="w-1/2 p-3 flex flex-col justify-center">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 leading-none">
              Guests
            </label>
            <div className="flex items-center text-gray-900 h-6">
              <Users className="mr-2 h-4 w-4 shrink-0" />
              <span className="font-medium text-sm leading-none">
                {capacity} Guests
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50/50">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            Time
          </label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <select
                value={effectiveStartTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                disabled={!date || availableStartTimes.length === 0}
              >
                {availableStartTimes.map(time => (
                  <option key={time} value={time}>
                    {formatTimeDisplay(time)}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-gray-400">→</span>
            <div className="flex-1">
              <select
                value={effectiveEndValue}
                onChange={e => setEndValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                disabled={!date || availableEndOptions.length === 0}
              >
                {availableEndOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-3 text-center">
            <span className="text-sm font-medium text-cyan-600">
              {hours > 0
                ? `${hours} hour${hours !== 1 ? 's' : ''} selected`
                : 'Invalid time range'}
            </span>
          </div>
          {date && availableStartTimes.length === 0 && (
            <p className="mt-2 text-xs text-red-600 text-center">
              No valid start time left for this date.
            </p>
          )}
          <p className="mt-1 text-[11px] text-gray-500 text-center">
            Booking duration is limited from 1 to 8 hours.
          </p>
        </div>
      </div>

      <button
        onClick={handleBooking}
        disabled={isLoading || !hasValidBookingWindow || hours <= 0}
        className="w-full bg-linear-to-br from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-200 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? 'Processing...' : 'Book Space'}
      </button>

      <p className="text-center text-xs text-gray-400 font-medium italic">
        You won't be charged yet
      </p>

      <div className="space-y-3 pt-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span className="underline decoration-gray-300 underline-offset-4">
            {formatVND(price)} x {hours} hour{hours !== 1 ? 's' : ''}
          </span>
          <span>{formatVND(price * hours)}</span>
        </div>

        <div className="h-px bg-gray-100 my-2"></div>
        <div className="flex justify-between text-lg font-bold text-gray-900">
          <span>Total</span>
          <span>{formatVND(totalPrice)}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl border border-teal-100">
        <span className=" text-teal-600 material-fill">
          <Gem />
        </span>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-teal-900">
            This is a rare find
          </span>
          <span className="text-[10px] text-teal-700">
            This place is usually fully booked.
          </span>
        </div>
      </div>
    </div>
  );
};

export default SpaceDetailBooking;
