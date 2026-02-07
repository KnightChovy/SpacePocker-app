import { Gem, CalendarIcon, Users } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createBooking } from '@/services/spaceService';
import type { BookingData } from '@/types/types';

interface SpaceDetailBookingProps {
  spaceId: string;
  price: number;
  rating: number;
  capacity: number;
}

const SpaceDetailBooking: React.FC<SpaceDetailBookingProps> = ({
  spaceId,
  price,
  capacity,
}) => {
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState<string>('10:00');
  const [endTime, setEndTime] = useState<string>('14:00');
  const [isLoading, setIsLoading] = useState(false);

  const maxDate = useMemo(() => {
    const today = new Date();
    const max = new Date(today);
    max.setDate(today.getDate() + 30);
    return max;
  }, []);

  const hours = useMemo(() => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startInMinutes = startHour * 60 + startMinute;
    const endInMinutes = endHour * 60 + endMinute;

    const diffInMinutes = endInMinutes - startInMinutes;
    return Math.max(0, diffInMinutes / 60);
  }, [startTime, endTime]);

  const totalPrice = useMemo(() => {
    return price * hours;
  }, [hours, price]);

  const navigate = useNavigate();

  const timeSlots = useMemo(() => {
    const slots = [];
    // 6:00 AM đến 23:00 PM
    for (let hour = 6; hour <= 23; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      slots.push(timeString);
    }
    return slots;
  }, []);

  const availableEndTimes = useMemo(() => {
    const [startHour] = startTime.split(':').map(Number);
    return timeSlots.filter(time => {
      const [hour] = time.split(':').map(Number);
      return hour > startHour;
    });
  }, [startTime, timeSlots]);

  useMemo(() => {
    const [startHour] = startTime.split(':').map(Number);
    const [endHour] = endTime.split(':').map(Number);
    if (endHour <= startHour && availableEndTimes.length > 0) {
      setEndTime(availableEndTimes[0]);
    }
  }, [startTime, endTime, availableEndTimes]);

  const formatTimeDisplay = (time: string) => {
    const [hour] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${period}`;
  };

  const handleBooking = async () => {
    if (!date) {
      alert('Please select a date');
      return;
    }

    if (hours <= 0) {
      alert('Please select valid time range');
      return;
    }

    setIsLoading(true);
    try {
      const bookingData: BookingData = {
        spaceId,
        date: date.toISOString().split('T')[0],
        startTime,
        endTime,
        hours,
        totalPrice: totalPrice,
        guests: capacity,
      };

      const response = await createBooking(bookingData);
      console.log('✅ Booking Response:', response);

      navigate('/spaces/booking', { state: { bookingData, response } });
    } catch (error) {
      console.error('❌ Booking Error:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 flex flex-col gap-6">
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-gray-900">
            ${price}
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
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
              >
                {timeSlots.map(time => (
                  <option key={time} value={time}>
                    {formatTimeDisplay(time)}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-gray-400">→</span>
            <div className="flex-1">
              <select
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                disabled={availableEndTimes.length === 0}
              >
                {availableEndTimes.map(time => (
                  <option key={time} value={time}>
                    {formatTimeDisplay(time)}
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
        </div>
      </div>

      <button
        onClick={handleBooking}
        disabled={isLoading || !date || hours <= 0}
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
            ${price} x {hours} hour{hours !== 1 ? 's' : ''}
          </span>
          <span>${(price * hours).toFixed(2)}</span>
        </div>

        <div className="h-px bg-gray-100 my-2"></div>
        <div className="flex justify-between text-lg font-bold text-gray-900">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
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
