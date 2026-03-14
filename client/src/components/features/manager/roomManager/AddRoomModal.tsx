import { useEffect, useMemo, useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface RoomFormData {
  name: string;
  description: string;
  buildingId: string;
  roomType: 'MEETING' | 'CLASSROOM' | 'EVENT' | 'OTHER';
  capacity: string;
  area: string;
  pricePerHour: string;
  securityDeposit: string;
  roomCode: string;
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
  const defaultBuildingId = useMemo(() => buildings[0]?.id || '', [buildings]);
  const initialFormState = useMemo<RoomFormData>(
    () => ({
      name: '',
      description: '',
      buildingId: defaultBuildingId,
      roomType: 'MEETING',
      capacity: '',
      area: '',
      pricePerHour: '',
      securityDeposit: '',
      roomCode: '',
    }),
    [defaultBuildingId],
  );
  const [formData, setFormData] = useState<RoomFormData>({
    name: '',
    description: '',
    buildingId: defaultBuildingId,
    roomType: 'MEETING',
    capacity: '',
    area: '',
    pricePerHour: '',
    securityDeposit: '',
    roomCode: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormState);
    }
  }, [initialFormState, isOpen]);

  useEffect(() => {
    if (!formData.buildingId && defaultBuildingId) {
      setFormData(prev => ({ ...prev, buildingId: defaultBuildingId }));
    }
  }, [defaultBuildingId, formData.buildingId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
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

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Description
              </label>
              <textarea
                className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-800 placeholder-slate-400 backdrop-blur-sm transition-all duration-200 shadow-sm min-h-24 resize-none"
                placeholder="Large conference room with projector"
                value={formData.description}
                onChange={e =>
                  setFormData({ ...formData, description: e.target.value })
                }
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
                  Room Type
                </label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-800 appearance-none cursor-pointer backdrop-blur-sm transition-all duration-200 shadow-sm"
                    value={formData.roomType}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        roomType: e.target.value as RoomFormData['roomType'],
                      })
                    }
                    required
                  >
                    <option value="MEETING">Meeting</option>
                    <option value="CLASSROOM">Classroom</option>
                    <option value="EVENT">Event</option>
                    <option value="OTHER">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none size-4" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  min={1}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                  Area (m²)
                </label>
                <input
                  className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-800 placeholder-slate-400 backdrop-blur-sm transition-all duration-200 shadow-sm"
                  placeholder="Optional"
                  type="number"
                  step="0.1"
                  value={formData.area}
                  onChange={e =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                  min={0}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Price Per Hour ($)
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
                  value={formData.pricePerHour}
                  onChange={e =>
                    setFormData({ ...formData, pricePerHour: e.target.value })
                  }
                  min={0}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Security Deposit ($)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                  $
                </span>
                <input
                  className="w-full pl-9 pr-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-800 placeholder-slate-400 backdrop-blur-sm transition-all duration-200 shadow-sm"
                  placeholder="Optional"
                  type="number"
                  step="0.01"
                  value={formData.securityDeposit}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      securityDeposit: e.target.value,
                    })
                  }
                  min={0}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Room Code
              </label>
              <input
                className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-800 placeholder-slate-400 backdrop-blur-sm transition-all duration-200 shadow-sm"
                placeholder="Leave blank to auto-generate"
                type="text"
                value={formData.roomCode}
                onChange={e =>
                  setFormData({ ...formData, roomCode: e.target.value })
                }
              />
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
