import { useState } from 'react';
import { X, ChevronDown, Clock } from 'lucide-react';
import type { ScheduleRoom, BookingType } from '@/types/user/types';

interface AddScheduleBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: ScheduleRoom[];
  onAdd: (data: {
    roomId: string;
    title: string;
    subtitle: string;
    startTime: string;
    endTime: string;
    type: BookingType;
  }) => void;
}

const TYPE_OPTIONS: { value: BookingType; label: string; color: string }[] = [
  { value: 'primary', label: 'Class / Lecture', color: 'text-primary' },
  { value: 'teal', label: 'Meeting', color: 'text-teal-600' },
  { value: 'amber', label: 'Workshop / Event', color: 'text-amber-600' },
  { value: 'maintenance', label: 'Maintenance', color: 'text-slate-500' },
];

const TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
];

const AddScheduleBookingModal = ({
  isOpen,
  onClose,
  rooms,
  onAdd,
}: AddScheduleBookingModalProps) => {
  const [formData, setFormData] = useState({
    roomId: '',
    title: '',
    subtitle: '',
    startTime: '09:00',
    endTime: '10:00',
    type: 'primary' as BookingType,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      roomId: '',
      title: '',
      subtitle: '',
      startTime: '09:00',
      endTime: '10:00',
      type: 'primary',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute inset-0 bg-linear-to-br from-white via-white to-primary/5" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-start justify-between px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-slate-800">New Booking</h2>
              <p className="text-sm text-slate-500 mt-1">
                Add a booking to the schedule timeline.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 -m-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 rounded-xl transition-all duration-200"
            >
              <X className="size-5" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="px-6 pb-6 flex flex-col gap-5"
          >
            {/* Room */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Room
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer shadow-sm text-slate-800"
                  value={formData.roomId}
                  onChange={e =>
                    setFormData({ ...formData, roomId: e.target.value })
                  }
                  required
                >
                  <option value="">Select room...</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} (cap: {r.capacity})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none size-4" />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Title
              </label>
              <input
                className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 shadow-sm text-slate-800 placeholder-slate-400 transition-all"
                placeholder="e.g. Physics 101 Lecture"
                type="text"
                value={formData.title}
                onChange={e =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Subtitle{' '}
                <span className="normal-case font-normal">(optional)</span>
              </label>
              <input
                className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 shadow-sm text-slate-800 placeholder-slate-400 transition-all"
                placeholder="e.g. Prof. Smith · 25 students"
                type="text"
                value={formData.subtitle}
                onChange={e =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
              />
            </div>

            {/* Start / End */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                  Start Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <select
                    className="w-full pl-10 pr-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer shadow-sm text-slate-800"
                    value={formData.startTime}
                    onChange={e =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                  >
                    {TIME_SLOTS.slice(0, -1).map(t => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none size-4" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                  End Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <select
                    className="w-full pl-10 pr-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer shadow-sm text-slate-800"
                    value={formData.endTime}
                    onChange={e =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                  >
                    {TIME_SLOTS.slice(1).map(t => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none size-4" />
                </div>
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Booking Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TYPE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, type: opt.value })
                    }
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                      formData.type === opt.value
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-primary/40'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                Add Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddScheduleBookingModal;
