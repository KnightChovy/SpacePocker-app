import { useRef, useEffect, useState } from 'react';
import { scheduleService } from '@/services/scheduleService';
import type { BookingType, ScheduleRoom, ScheduleBooking } from '@/types/types';
import { Plus, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import AddScheduleBookingModal from './AddScheduleBookingModal';

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

interface ScheduleTimelineProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date) => void;
}

export default function ScheduleTimeline({
  selectedDate,
  onDateChange,
}: ScheduleTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTimeX, setCurrentTimeX] = useState<number>(0);
  const [rooms, setRooms] = useState<ScheduleRoom[]>([]);
  const [bookings, setBookings] = useState<ScheduleBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setIsLoading(true);
        const [roomsData, bookingsData] = await Promise.all([
          scheduleService.getRooms({ date: selectedDate }),
          scheduleService.getBookings({ date: selectedDate }),
        ]);
        setRooms(roomsData);
        setBookings(bookingsData);
      } catch (error) {
        console.error('Failed to fetch schedule data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScheduleData();
  }, [selectedDate]);

  const getTimePosition = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = (hours - START_HOUR) * 60 + minutes;
    return (totalMinutes / 60) * SLOT_WIDTH;
  };

  const getTimeWidth = (start: string, end: string) => {
    return getTimePosition(end) - getTimePosition(start);
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();

      if (h >= START_HOUR && h < END_HOUR) {
        setCurrentTimeX(getTimePosition(`${h}:${m}`));
      } else {
        setCurrentTimeX(getTimePosition('11:30'));
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

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

  return (
    <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-border-light relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-border-light gap-4">
        <div className="flex items-center gap-4">
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
            <span className="text-sm font-bold text-slate-900 min-w-25 text-center">
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
        rooms={rooms}
        onAdd={data => {
          const newBooking: ScheduleBooking = {
            id: `booking-${Date.now()}`,
            roomId: data.roomId,
            title: data.title,
            subtitle: data.subtitle,
            startTime: data.startTime,
            endTime: data.endTime,
            type: data.type,
          };
          setBookings(prev => [...prev, newBooking]);
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
              rooms.map(room => (
                <div
                  key={room.id}
                  className="h-24 p-4 border-b border-border-light flex flex-col justify-center"
                >
                  <span className="text-sm font-semibold text-slate-800">
                    {room.name}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <span className="text-[10px]">👥</span> Cap: {room.capacity}
                  </span>
                </div>
              ))
            )}
          </div>

          <div
            className="flex-1 relative overflow-x-auto no-scrollbar"
            ref={containerRef}
          >
            <div
              className="h-full relative"
              style={{ width: TIME_SLOTS.length * SLOT_WIDTH }}
            >
              <div className="absolute inset-0 flex pointer-events-none">
                {TIME_SLOTS.map((_, i) => (
                  <div
                    key={i}
                    className="h-full border-r border-border-light/50 border-dashed"
                    style={{ width: SLOT_WIDTH }}
                  />
                ))}
              </div>

              <div
                className="absolute top-0 bottom-0 w-px bg-red-500 z-20 pointer-events-none"
                style={{ left: currentTimeX }}
              >
                <div className="absolute -top-1.5 -left-1.5 h-3 w-3 bg-red-500 rounded-full" />
              </div>

              {rooms.map(room => (
                <div
                  key={room.id}
                  className="h-24 border-b border-border-light relative hover:bg-slate-50/50 transition-colors"
                >
                  {bookings
                    .filter(b => b.roomId === room.id)
                    .map(booking => (
                      <div
                        key={booking.id}
                        className={`absolute top-2 bottom-2 border-l-4 rounded-r-md px-3 py-2 cursor-pointer hover:shadow-md transition-shadow flex items-center gap-3 overflow-hidden ${getVariantStyles(booking.type)}`}
                        style={{
                          left: getTimePosition(booking.startTime),
                          width: getTimeWidth(
                            booking.startTime,
                            booking.endTime
                          ),
                        }}
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate">
                            {booking.title}
                          </p>
                          <p className="text-[10px] opacity-70 truncate">
                            {booking.subtitle}
                          </p>
                        </div>
                      </div>
                    ))}

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
