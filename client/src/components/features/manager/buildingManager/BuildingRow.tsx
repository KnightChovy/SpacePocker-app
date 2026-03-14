import { useLayoutEffect, useRef, useState } from 'react';
import {
  Building2,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  MapPin,
  GraduationCap,
  CalendarDays,
} from 'lucide-react';
import type { BuildingDetail } from '@/types/types';

const formatDate = (iso?: string) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

interface BuildingRowProps {
  building: BuildingDetail;
  onEdit: (b: BuildingDetail) => void;
  onDelete: (id: string) => void;
  onView: (b: BuildingDetail) => void;
}

const BuildingRow = ({
  building,
  onEdit,
  onDelete,
  onView,
}: BuildingRowProps) => {
  const [showActions, setShowActions] = useState(false);
  const actionBtnRef = useRef<HTMLButtonElement | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useLayoutEffect(() => {
    if (!showActions) return;
    const btn = actionBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 6,
      left: rect.right,
    });
  }, [showActions]);

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Building2 className="size-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-text-dark leading-tight">
              {building.buildingName}
            </p>
          </div>
        </div>
      </td>

      {/* Address */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-1.5 text-sm text-text-dark">
          <MapPin className="size-3.5 text-slate-400 shrink-0" />
          <span className="truncate max-w-48">{building.address}</span>
        </div>
      </td>

      {/* Campus */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-1.5">
          <GraduationCap className="size-3.5 text-slate-400 shrink-0" />
          <span className="text-sm text-text-dark">{building.campus}</span>
        </div>
      </td>

      {/* Created At */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-1.5 text-sm text-text-gray">
          <CalendarDays className="size-3.5 text-slate-400 shrink-0" />
          <span>{formatDate(building.createdAt)}</span>
        </div>
      </td>

      {/* Actions */}
      <td className="py-4 px-4">
        <div className="relative">
          <button
            ref={actionBtnRef}
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreHorizontal className="size-4 text-text-gray" />
          </button>

          {showActions && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowActions(false)}
              />
              <div
                className="fixed bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 min-w-32 transform -translate-x-full"
                style={{
                  top: menuPosition?.top ?? 0,
                  left: menuPosition?.left ?? 0,
                }}
              >
                <button
                  onClick={() => {
                    onView(building);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-dark hover:bg-gray-50"
                >
                  <Eye className="size-4" />
                  View
                </button>
                <button
                  onClick={() => {
                    onEdit(building);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-dark hover:bg-gray-50"
                >
                  <Edit className="size-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(building.id);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="size-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default BuildingRow;
