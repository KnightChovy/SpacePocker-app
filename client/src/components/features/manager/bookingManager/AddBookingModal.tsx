import { useState } from 'react';
import { X, ChevronDown, Calendar, Clock } from 'lucide-react';

interface BookingFormData {
  customerName: string;
  customerDepartment: string;
  roomId: string;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  amount: string;
}

interface AddBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: BookingFormData) => void;
}

const AddBookingModal = ({ isOpen, onClose, onAdd }: AddBookingModalProps) => {
  const [formData, setFormData] = useState<BookingFormData>({
    customerName: '',
    customerDepartment: '',
    roomId: '',
    scheduleDate: '',
    startTime: '09:00',
    endTime: '10:00',
    amount: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      customerName: '',
      customerDepartment: '',
      roomId: '',
      scheduleDate: '',
      startTime: '09:00',
      endTime: '10:00',
      amount: '',
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

      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute inset-0 bg-linear-to-br from-white via-white to-primary/5" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-violet-100/40 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-start justify-between px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-slate-800">New Booking</h2>
              <p className="text-sm text-slate-500 mt-1">
                Create a new room booking reservation.
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
            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                  Customer Name
                </label>
                <input
                  className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-800 placeholder-slate-400 backdrop-blur-sm transition-all duration-200 shadow-sm"
                  placeholder="e.g. John Doe"
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
                  className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-800 placeholder-slate-400 backdrop-blur-sm transition-all duration-200 shadow-sm"
                  placeholder="e.g. Marketing"
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

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Select Room
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-800 appearance-none cursor-pointer backdrop-blur-sm transition-all duration-200 shadow-sm"
                  value={formData.roomId}
                  onChange={e =>
                    setFormData({ ...formData, roomId: e.target.value })
                  }
                  required
                >
                  <option value="">Choose a room...</option>
                  <option value="r1">Lab 305 - Science Building</option>
                  <option value="r2">Studio 4 - Arts Center</option>
                  <option value="r3">Room A-101 - Science Building</option>
                  <option value="r4">Auditorium - Main Hall</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none size-4" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Schedule Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                <input
                  className="w-full pl-10 pr-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-800 placeholder-slate-400 backdrop-blur-sm transition-all duration-200 shadow-sm"
                  type="date"
                  value={formData.scheduleDate}
                  onChange={e =>
                    setFormData({ ...formData, scheduleDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                  Start Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-800 placeholder-slate-400 backdrop-blur-sm transition-all duration-200 shadow-sm"
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
                  End Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-800 placeholder-slate-400 backdrop-blur-sm transition-all duration-200 shadow-sm"
                    type="time"
                    value={formData.endTime}
                    onChange={e =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Amount ($)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                  $
                </span>
                <input
                  className="w-full pl-9 pr-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-800 placeholder-slate-400 backdrop-blur-sm transition-all duration-200 shadow-sm"
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={e =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100/80 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200"
              >
                Create Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBookingModal;
