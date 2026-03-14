import { useEffect } from 'react';
import { X, Building2, MapPin, GraduationCap, Calendar } from 'lucide-react';
import type { BuildingDetail } from '@/types/types';

interface ViewBuildingModalProps {
  isOpen: boolean;
  building: BuildingDetail | null;
  onClose: () => void;
  onEdit?: (building: BuildingDetail) => void;
}

const formatDate = (iso?: string) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ViewBuildingModal = ({
  isOpen,
  building,
  onClose,
  onEdit,
}: ViewBuildingModalProps) => {
  // Prevent scroll khi modal mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !building) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-white via-white to-primary/5" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

        <div className="relative">
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 className="size-7 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {building.buildingName}
                </h2>
                <p className="text-sm text-slate-500 mt-1">Building Details</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 -m-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 rounded-xl transition-all"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 flex flex-col gap-5">
            {/* Address */}
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="size-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Address
                </p>
                <p className="text-base text-slate-800">{building.address}</p>
              </div>
            </div>

            {/* Campus */}
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                <GraduationCap className="size-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Campus
                </p>
                <p className="text-base text-slate-800">{building.campus}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Latitude
                </p>
                <p className="text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                  {building.latitude ?? '—'}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Longitude
                </p>
                <p className="text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                  {building.longitude ?? '—'}
                </p>
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="size-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Created At
                  </p>
                  <p className="text-sm text-slate-700">
                    {formatDate(building.createdAt)}
                  </p>
                </div>
              </div>

              {building.updatedAt && (
                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="size-5 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Updated At
                    </p>
                    <p className="text-sm text-slate-700">
                      {formatDate(building.updatedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-slate-50/50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
            >
              Close
            </button>
            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onEdit(building);
                  onClose();
                }}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                Edit Building
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBuildingModal;
