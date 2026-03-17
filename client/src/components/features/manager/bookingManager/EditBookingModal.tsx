import { useState, useEffect } from 'react';
import { X, ChevronDown, Calendar, Clock } from 'lucide-react';
import type { Booking, BookingStatus } from '@/types/types';
import { bookingService } from '@/services/bookingService';

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onUpdated: () => void;
}

const ROOM_OPTIONS = [
  { value: 'r1', label: 'Lab 305 - Science Building' },
  { value: 'r2', label: 'Studio 4 - Arts Center' },
  { value: 'r3', label: 'Room A-101 - Science Building' },
  { value: 'r4', label: 'Auditorium - Main Hall' },
];

const ROOM_MAP: Record<string, { name: string; building: string }> = {
  r1: { name: 'Lab 305', building: 'Science Building' },
  r2: { name: 'Studio 4', building: 'Arts Center' },
  r3: { name: 'Room A-101', building: 'Science Building' },
  r4: { name: 'Auditorium', building: 'Main Hall' },
};

const STATUS_OPTIONS: { value: BookingStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const EditBookingModal = ({
  isOpen,
  onClose,
  booking,
  onUpdated,
}: EditBookingModalProps) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerDepartment: '',
    roomId: '',
    scheduleDate: '',
    startTime: '09:00',
    endTime: '10:00',
    amount: '',
    status: 'pending' as BookingStatus,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (booking) {
      setFormData({
        customerName: booking.customer.name,
        customerDepartment: booking.customer.department ?? '',
        roomId: booking.room.id,
        scheduleDate: booking.scheduleDate,
        startTime: booking.startTime,
        endTime: booking.endTime,
        amount: String(booking.amount),
        status: booking.status,
      });
    }
  }, [booking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    setIsSubmitting(true);
    try {
      const room = ROOM_MAP[formData.roomId] ?? {
        name: booking.room.name,
        building: booking.room.building,
      };

      await bookingService.updateBooking({
        id: booking.id,
        customerName: formData.customerName,
        customerDepartment: formData.customerDepartment,
        roomId: formData.roomId,
        roomName: room.name,
        roomBuilding: room.building,
        scheduleDate: formData.scheduleDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        amount: parseFloat(formData.amount),
        status: formData.status,
      });
      onUpdated();
      onClose();
    } catch (err) {
      console.error('Failed to update booking:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute inset-0 bg-linear-to-br from-white via-white to-amber-50/40" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-start justify-between px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Edit Booking</h2>
              <p className="text-sm text-slate-500 mt-1 font-mono">
                {booking.bookingNumber}
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
            {/* Customer */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                  Customer Name
                </label>
                <input
                  className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-800 placeholder-slate-400 transition-all shadow-sm"
                  type="text"
                  value={formData.customerName}
                  onChange={e =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                  Department
                </label>
                <input
                  className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-800 placeholder-slate-400 transition-all shadow-sm"
                  type="text"
                  value={formData.customerDepartment}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      customerDepartment: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Room */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Room
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer transition-all shadow-sm text-slate-800"
                  value={formData.roomId}
                  onChange={e =>
                    setFormData({ ...formData, roomId: e.target.value })
                  }
                >
                  <option value="">Select room...</option>
                  {ROOM_OPTIONS.map(r => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none size-4" />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Schedule Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                <input
                  className="w-full pl-10 pr-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 transition-all shadow-sm text-slate-800"
                  type="date"
                  value={formData.scheduleDate}
                  onChange={e =>
                    setFormData({ ...formData, scheduleDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Time + Amount */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                  Start
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <input
                    className="w-full pl-10 pr-2 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 transition-all shadow-sm text-slate-800"
                    type="time"
                    value={formData.startTime}
                    onChange={e =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                  End
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <input
                    className="w-full pl-10 pr-2 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 transition-all shadow-sm text-slate-800"
                    type="time"
                    value={formData.endTime}
                    onChange={e =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                  Amount (VND)
                </label>
                <input
                  className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 transition-all shadow-sm text-slate-800"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={e =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Status
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer transition-all shadow-sm text-slate-800"
                  value={formData.status}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      status: e.target.value as BookingStatus,
                    })
                  }
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none size-4" />
              </div>
            </div>

            {/* Actions */}
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
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-60 rounded-xl shadow-lg shadow-amber-500/20 transition-all"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBookingModal;
