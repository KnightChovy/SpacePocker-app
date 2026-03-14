import { useEffect, useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface RoomFormData {
  name: string;
  buildingId: string;
  capacity: string;
  rate: string;
  isAvailable: boolean;
}

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: RoomFormData) => void;
  buildings: Array<{ id: string; name: string }>;
}

const AddRoomModal = ({
  isOpen,
  onClose,
  onAdd,
  buildings,
}: AddRoomModalProps) => {
  const [formData, setFormData] = useState<RoomFormData>({
    name: '',
    buildingId: buildings[0]?.id || '',
    capacity: '',
    rate: '',
    isAvailable: true,
  });

  useEffect(() => {
    if (!formData.buildingId && buildings[0]?.id) {
      setFormData(prev => ({ ...prev, buildingId: buildings[0].id }));
    }
  }, [buildings, formData.buildingId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
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
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-violet-100/40 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-start justify-between px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Add New Room</h2>
              <p className="text-sm text-slate-500 mt-1">
                Enter details for the new space.
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
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Room Name
              </label>
              <input
                className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-800 placeholder-slate-400 backdrop-blur-sm transition-all duration-200 shadow-sm"
                placeholder="e.g. Innovation Hub"
                type="text"
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                  Building
                </label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-800 appearance-none cursor-pointer backdrop-blur-sm transition-all duration-200 shadow-sm"
                    value={formData.buildingId}
                    onChange={e =>
                      setFormData({ ...formData, buildingId: e.target.value })
                    }
                    required
                  >
                    {buildings.length === 0 ? (
                      <option value="" disabled>
                        No buildings
                      </option>
                    ) : (
                      buildings.map(b => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))
                    )}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none size-4" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                  Capacity
                </label>
                <input
                  className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-800 placeholder-slate-400 backdrop-blur-sm transition-all duration-200 shadow-sm"
                  placeholder="Seats"
                  type="number"
                  value={formData.capacity}
                  onChange={e =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Hourly Rate ($)
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
                  value={formData.rate}
                  onChange={e =>
                    setFormData({ ...formData, rate: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-3 py-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.isAvailable}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        isAvailable: e.target.checked,
                      })
                    }
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:shadow-sm after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary transition-colors duration-200"></div>
                </div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                  Available for immediate booking
                </span>
              </label>
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
                Create Room
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRoomModal;
