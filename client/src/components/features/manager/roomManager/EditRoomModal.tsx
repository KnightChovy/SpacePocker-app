import { useEffect, useMemo, useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useGetAmenities } from '@/hooks/admin/amenities/use-get-amenities';
import { useGetRoomById } from '@/hooks/manager/rooms/use-get-room-by-id';
import { useGetServiceCategoriesManager } from '@/hooks/manager/service-categories/use-get-service-categories';
import { useUpdateRoom } from '@/hooks/manager/rooms/use-update-room';
import type {
  ApiRoomStatus,
  ApiRoomType,
  UpdateRoomPayload,
} from '@/types/room-api';

interface EditRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string | null;
  buildings: Array<{ id: string; name: string }>;
}

type EditRoomFormData = {
  name: string;
  description: string;
  buildingId: string;
  roomType: ApiRoomType;
  capacity: string;
  area: string;
  pricePerHour: string;
  securityDeposit: string;
  status: ApiRoomStatus;
  imageUrlsText: string;
  amenityIds: string[];
  serviceCategoryIds: string[];
};

const EditRoomModal = ({
  isOpen,
  onClose,
  roomId,
  buildings,
}: EditRoomModalProps) => {
  const { data: room, isLoading } = useGetRoomById(roomId ?? undefined);
  const { data: amenities, isLoading: isAmenitiesLoading } = useGetAmenities();
  const { data: serviceCategories, isLoading: isServiceCategoriesLoading } =
    useGetServiceCategoriesManager();
  const updateRoomMutation = useUpdateRoom();

  const buildingLabel = useMemo(() => {
    if (!room?.buildingId) return '';
    return (
      buildings.find(b => b.id === room.buildingId)?.name || room.buildingId
    );
  }, [buildings, room?.buildingId]);

  const initialFormState = useMemo<EditRoomFormData | null>(() => {
    if (!room) return null;

    const currentAmenityIds = (room.amenities ?? [])
      .map(a => a.amenity?.id)
      .filter(Boolean) as string[];
    const currentServiceCategoryIds = (room.serviceCategories ?? [])
      .map(category => category.category?.id)
      .filter(Boolean) as string[];

    return {
      name: room.name ?? '',
      description: room.description ?? '',
      buildingId: room.buildingId,
      roomType: room.roomType,
      capacity: String(room.capacity ?? ''),
      area: room.area == null ? '' : String(room.area),
      pricePerHour: String(room.pricePerHour ?? ''),
      securityDeposit:
        room.securityDeposit == null ? '' : String(room.securityDeposit),
      status: room.status,
      imageUrlsText: (room.images ?? []).join('\n'),
      amenityIds: currentAmenityIds,
      serviceCategoryIds: currentServiceCategoryIds,
    };
  }, [room]);

  const [formData, setFormData] = useState<EditRoomFormData>({
    name: '',
    description: '',
    buildingId: '',
    roomType: 'MEETING',
    capacity: '',
    area: '',
    pricePerHour: '',
    securityDeposit: '',
    status: 'AVAILABLE',
    imageUrlsText: '',
    amenityIds: [],
    serviceCategoryIds: [],
  });

  useEffect(() => {
    if (isOpen && initialFormState) {
      setFormData(initialFormState);
    }
  }, [initialFormState, isOpen]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId) return;

    const body: UpdateRoomPayload = {
      name: formData.name.trim(),
      description: formData.description?.trim() || undefined,
      capacity: parseInt(formData.capacity, 10),
      area: formData.area.trim() === '' ? undefined : parseFloat(formData.area),
      pricePerHour: parseFloat(formData.pricePerHour),
      securityDeposit:
        formData.securityDeposit.trim() === ''
          ? undefined
          : parseFloat(formData.securityDeposit),
      roomType: formData.roomType,
      status: formData.status,
      images: formData.imageUrlsText
        .split(/\r?\n|,/)
        .map(url => url.trim())
        .filter(Boolean),
      amenities: formData.amenityIds,
      serviceCategories: formData.serviceCategoryIds,
    };

    await updateRoomMutation.mutateAsync({ roomId, body });
    onClose();
  };

  if (!isOpen || !roomId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute inset-0 bg-linear-to-br from-white via-white to-primary/5" />

        <div className="relative">
          <div className="flex items-start justify-between px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Edit Room</h2>
              <p className="text-sm text-slate-500 mt-1">
                Update details for this room.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 -m-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 rounded-xl transition-all duration-200"
            >
              <X className="size-5" />
            </button>
          </div>

          {isLoading ? (
            <div className="px-6 pb-8">
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin size-8 border-3 border-primary border-t-transparent rounded-full" />
              </div>
            </div>
          ) : !room ? (
            <div className="px-6 pb-8 text-sm text-slate-500">
              Room not found.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                      Room Name
                    </label>
                    <input
                      className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-800 placeholder-slate-400 backdrop-blur-sm transition-all duration-200 shadow-sm"
                      type="text"
                      value={formData.name}
                      onChange={e =>
                        setFormData(prev => ({ ...prev, name: e.target.value }))
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
                      value={formData.description}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                        Building
                      </label>
                      <input
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-700"
                        value={buildingLabel}
                        disabled
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                        Availability / Status
                      </label>
                      <div className="relative">
                        <select
                          className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-800 appearance-none cursor-pointer backdrop-blur-sm transition-all duration-200 shadow-sm"
                          value={formData.status}
                          onChange={e =>
                            setFormData(prev => ({
                              ...prev,
                              status: e.target.value as ApiRoomStatus,
                            }))
                          }
                          required
                        >
                          <option value="AVAILABLE">Available</option>
                          <option value="UNAVAILABLE">Unavailable</option>
                          <option value="PROCESS">Processing</option>
                          <option value="MAINTAIN">Maintenance</option>
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
                          setFormData(prev => ({
                            ...prev,
                            roomType: e.target.value as ApiRoomType,
                          }))
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
                    <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200/80 bg-white/70 backdrop-blur-sm shadow-sm p-3">
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
                </div>

                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                        Capacity
                      </label>
                      <input
                        className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-800 placeholder-slate-400 backdrop-blur-sm transition-all duration-200 shadow-sm"
                        type="number"
                        value={formData.capacity}
                        onChange={e =>
                          setFormData(prev => ({
                            ...prev,
                            capacity: e.target.value,
                          }))
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
                        type="number"
                        step="0.1"
                        value={formData.area}
                        onChange={e =>
                          setFormData(prev => ({
                            ...prev,
                            area: e.target.value,
                          }))
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
                        type="number"
                        step="0.01"
                        value={formData.pricePerHour}
                        onChange={e =>
                          setFormData(prev => ({
                            ...prev,
                            pricePerHour: e.target.value,
                          }))
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
                        type="number"
                        step="0.01"
                        value={formData.securityDeposit}
                        onChange={e =>
                          setFormData(prev => ({
                            ...prev,
                            securityDeposit: e.target.value,
                          }))
                        }
                        min={0}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                      Service Categories
                    </label>
                    <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200/80 bg-white/70 backdrop-blur-sm shadow-sm p-3">
                      {isServiceCategoriesLoading ? (
                        <div className="text-sm text-slate-500">
                          Loading service categories...
                        </div>
                      ) : !serviceCategories ||
                        serviceCategories.length === 0 ? (
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

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                      Image URLs
                    </label>
                    <textarea
                      className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-800 placeholder-slate-400 backdrop-blur-sm transition-all duration-200 shadow-sm min-h-28 resize-none"
                      value={formData.imageUrlsText}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          imageUrlsText: e.target.value,
                        }))
                      }
                      placeholder="https://example.com/room-1.jpg&#10;https://example.com/room-2.jpg"
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
                  disabled={updateRoomMutation.isPending}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditRoomModal;
