import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import type { CreateBuildingPayload } from '@/types/types';

interface AddBuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (payload: CreateBuildingPayload) => Promise<void>;
}

const CAMPUS_OPTIONS = [
  'Main Campus',
  'North Campus',
  'South Campus',
  'East Campus',
  'West Campus',
];

const INITIAL: CreateBuildingPayload = {
  buildingName: '',
  address: '',
  campus: '',
  managerId: '',
};

const AddBuildingModal = ({
  isOpen,
  onClose,
  onAdd,
}: AddBuildingModalProps) => {
  const [form, setForm] = useState<CreateBuildingPayload>(INITIAL);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof CreateBuildingPayload, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setIsSubmitting(true);
      await onAdd(form);
      setForm(INITIAL);
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Failed to create building. Please try again.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-white via-white to-primary/5" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />

        <div className="relative">
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Add Building</h2>
              <p className="text-sm text-slate-500 mt-1">
                Create a new building record.
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
                value={form.buildingName}
                onChange={e => set('buildingName', e.target.value)}
                placeholder="e.g. Building A"
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
                value={form.address}
                onChange={e => set('address', e.target.value)}
                placeholder="e.g. 123 Main Street"
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
                  value={form.campus}
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

            {/* Manager ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Manager ID <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={form.managerId}
                onChange={e => set('managerId', e.target.value)}
                placeholder="Enter a valid manager UUID"
                className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 shadow-sm text-slate-800 placeholder-slate-400 transition-all"
              />
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
                {isSubmitting ? 'Creating...' : 'Create Building'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBuildingModal;
