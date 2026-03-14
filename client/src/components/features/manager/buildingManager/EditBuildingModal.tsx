import { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import type { BuildingDetail, UpdateBuildingPayload } from '@/types/types';

interface EditBuildingModalProps {
  isOpen: boolean;
  building: BuildingDetail | null;
  onClose: () => void;
  onUpdate: (id: string, payload: UpdateBuildingPayload) => Promise<void>;
}

const CAMPUS_OPTIONS = [
  'Main Campus',
  'North Campus',
  'South Campus',
  'East Campus',
  'West Campus',
];

const EditBuildingModal = ({
  isOpen,
  building,
  onClose,
  onUpdate,
}: EditBuildingModalProps) => {
  const [form, setForm] = useState<UpdateBuildingPayload>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (building) {
      setError(null);
      setForm({
        buildingName: building.buildingName,
        address: building.address,
        campus: building.campus,
      });
    } else {
      // Reset form khi đóng modal
      setForm({});
      setError(null);
    }
  }, [building]);

  const set = (field: keyof UpdateBuildingPayload, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!building) return;
    setError(null);
    try {
      setIsSubmitting(true);
      await onUpdate(building.id, form);
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Failed to update building. Please try again.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !building) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-white via-white to-primary/5" />

        <div className="relative">
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Edit Building
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Update details for{' '}
                <span className="font-semibold">{building.buildingName}</span>.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 -m-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 rounded-xl transition-all"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="px-6 pb-6 flex flex-col gap-4"
          >
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Building Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Building Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={form.buildingName ?? ''}
                onChange={e => set('buildingName', e.target.value)}
                className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 shadow-sm text-slate-800 placeholder-slate-400 transition-all"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={form.address ?? ''}
                onChange={e => set('address', e.target.value)}
                className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 shadow-sm text-slate-800 placeholder-slate-400 transition-all"
              />
            </div>

            {/* Campus */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Campus <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={form.campus ?? ''}
                  onChange={e => set('campus', e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer shadow-sm text-slate-800"
                >
                  <option value="">Select campus...</option>
                  {CAMPUS_OPTIONS.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none size-4" />
              </div>
            </div>

            {/* Manager ID - Read Only */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Manager ID
              </label>
              <input
                disabled
                readOnly
                value={building.managerId}
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200/80 rounded-xl text-sm shadow-sm text-slate-600 cursor-not-allowed"
              />
              <p className="text-xs text-slate-400 mt-1">
                Manager ID cannot be changed
              </p>
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
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 disabled:opacity-60 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
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

export default EditBuildingModal;
