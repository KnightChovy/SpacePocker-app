import { useEffect, useMemo, useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useGetAmenities } from '@/hooks/admin/amenities/use-get-amenities';
import { useGetServiceCategoriesManager } from '@/hooks/manager/service-categories/use-get-service-categories';
import type { ApiRoomStatus } from '@/types/room-api';

interface RoomFormData {
  name: string;
  description: string;
  buildingId: string;
  roomType: 'MEETING' | 'CLASSROOM' | 'EVENT' | 'OTHER';
  status: ApiRoomStatus;
  capacity: string;
  area: string;
  pricePerHour: string;
  securityDeposit: string;
  roomCode: string;
  imageUrlsText: string;
  amenityIds: string[];
  serviceCategoryIds: string[];
}

type AddRoomSubmitData = RoomFormData & {
  imageUrls: string[];
};

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: AddRoomSubmitData) => void;
  buildings: Array<{ id: string; name: string }>;
}

const AddRoomModal = ({
  isOpen,
  onClose,
  onAdd,
  buildings,
}: AddRoomModalProps) => {
  const { data: amenities, isLoading: isAmenitiesLoading } = useGetAmenities();
  const { data: serviceCategories, isLoading: isServiceCategoriesLoading } =
    useGetServiceCategoriesManager();

  const defaultBuildingId = useMemo(() => buildings[0]?.id || '', [buildings]);
  const initialFormState = useMemo<RoomFormData>(
    () => ({
      name: '',
      description: '',
      buildingId: defaultBuildingId,
      roomType: 'MEETING',
      status: 'AVAILABLE',
      capacity: '',
      area: '',
      pricePerHour: '',
      securityDeposit: '',
      roomCode: '',
      imageUrlsText: '',
      amenityIds: [],
      serviceCategoryIds: [],
    }),
    [defaultBuildingId]
  );
  const [formData, setFormData] = useState<RoomFormData>({
    name: '',
    description: '',
    buildingId: defaultBuildingId,
    roomType: 'MEETING',
    status: 'AVAILABLE',
    capacity: '',
    area: '',
    pricePerHour: '',
    securityDeposit: '',
    roomCode: '',
    imageUrlsText: '',
    amenityIds: [],
    serviceCategoryIds: [],
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
    onAdd({
      ...formData,
      imageUrls: formData.imageUrlsText
        .split(/\r?\n|,/)
        .map(url => url.trim())
        .filter(Boolean),
    });
  };

  const toggleAmenity = (amenityId: string) => {
    setFormData(prev => {
      const exists = prev.amenityIds.includes(amenityId);
      return {
        ...prev,
        amenityIds: exists
          ? prev.amenityIds.filter(id => id !== amenityId)
          : [...prev.amenityIds, amenityId],
      };
    });
  };

  const toggleServiceCategory = (categoryId: string) => {
    setFormData(prev => {
      const exists = prev.serviceCategoryIds.includes(categoryId);
      return {
        ...prev,
        serviceCategoryIds: exists
          ? prev.serviceCategoryIds.filter(id => id !== categoryId)
          : [...prev.serviceCategoryIds, categoryId],
      };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
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

          <form onSubmit={handleSubmit} className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-5">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                      Building
                    </label>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-800 appearance-none cursor-pointer backdrop-blur-sm transition-all duration-200 shadow-sm"
                        value={formData.buildingId}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            buildingId: e.target.value,
                          })
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
                      Availability
                    </label>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-800 appearance-none cursor-pointer backdrop-blur-sm transition-all duration-200 shadow-sm"
                        value={formData.status}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            status: e.target.value as ApiRoomStatus,
                          })
                        }
                        required
                      >
                        <option value="AVAILABLE">Available</option>
                        <option value="UNAVAILABLE">Unavailable</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none size-4" />
                    </div>
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

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                    Amenities
                  </label>
                  <div className="max-h-36 overflow-y-auto rounded-xl border border-slate-200/80 bg-white/70 backdrop-blur-sm shadow-sm p-3">
                    {isAmenitiesLoading ? (
                      <div className="text-sm text-slate-500">
                        Loading amenities...
                      </div>
                    ) : !amenities || amenities.length === 0 ? (
                      <div className="text-sm text-slate-500">
                        No amenities available.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {amenities.map(a => (
                          <label
                            key={a.id}
                            className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none"
                          >
                            <input
                              type="checkbox"
                              className="rounded border-slate-300 text-primary focus:ring-primary/20"
                              checked={formData.amenityIds.includes(a.id)}
                              onChange={() => toggleAmenity(a.id)}
                            />
                            <span className="truncate" title={a.name}>
                              {a.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                    Service Categories
                  </label>
                  <div className="max-h-36 overflow-y-auto rounded-xl border border-slate-200/80 bg-white/70 backdrop-blur-sm shadow-sm p-3">
                    {isServiceCategoriesLoading ? (
                      <div className="text-sm text-slate-500">
                        Loading service categories...
                      </div>
                    ) : !serviceCategories || serviceCategories.length === 0 ? (
                      <div className="text-sm text-slate-500">
                        No service categories available.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {serviceCategories.map(category => (
                          <label
                            key={category.id}
                            className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none"
                          >
                            <input
                              type="checkbox"
                              className="rounded border-slate-300 text-primary focus:ring-primary/20"
                              checked={formData.serviceCategoryIds.includes(
                                category.id
                              )}
                              onChange={() =>
                                toggleServiceCategory(category.id)
                              }
                            />
                            <span className="truncate" title={category.name}>
                              {category.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-5">
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
                    Price Per Hour (VND)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                      ₫
                    </span>
                    <input
                      className="w-full pl-9 pr-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-800 placeholder-slate-400 backdrop-blur-sm transition-all duration-200 shadow-sm"
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      value={formData.pricePerHour}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          pricePerHour: e.target.value,
                        })
                      }
                      min={0}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                    Security Deposit (VND)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                      ₫
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

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                    Image URLs
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-800 placeholder-slate-400 backdrop-blur-sm transition-all duration-200 shadow-sm min-h-28 resize-none"
                    placeholder="https://example.com/room-1.jpg&#10;https://example.com/room-2.jpg"
                    value={formData.imageUrlsText}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        imageUrlsText: e.target.value,
                      })
                    }
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Enter one URL per line or separate with commas.
                  </p>
                </div>
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
