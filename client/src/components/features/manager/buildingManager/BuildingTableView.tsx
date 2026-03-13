import { Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { BuildingDetail } from '@/types/types';
import BuildingRow from './BuildingRow';

interface BuildingTableViewProps {
  buildings: BuildingDetail[];
  isLoading: boolean;
  total: number;
  currentPage: number;
  limit: number;
  onEdit: (b: BuildingDetail) => void;
  onDelete: (id: string) => void;
  onView: (b: BuildingDetail) => void;
  onPageChange: (page: number) => void;
}

const BuildingTableView = ({
  buildings,
  isLoading,
  total,
  currentPage,
  limit,
  onEdit,
  onDelete,
  onView,
  onPageChange,
}: BuildingTableViewProps) => {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-soft overflow-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin size-8 border-3 border-primary border-t-transparent rounded-full" />
        </div>
      ) : buildings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Building2 className="size-12 mb-3" />
          <p className="text-lg font-medium">No buildings found</p>
          <p className="text-sm">
            Try adjusting your filters or add a new building.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {[
                    { label: 'Building', w: '' },
                    { label: 'Address', w: '' },
                    { label: 'Campus', w: '' },
                    { label: 'Manager ID', w: '' },
                    { label: 'Created At', w: '' },
                    { label: '', w: 'w-12' },
                  ].map((col, i) => (
                    <th
                      key={i}
                      className={`text-left py-3 px-4 text-xs font-semibold text-text-gray uppercase tracking-wider ${col.w}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {buildings.map(b => (
                  <BuildingRow
                    key={b.id}
                    building={b}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-sm text-text-gray">
                Showing{' '}
                <span className="font-semibold text-text-dark">
                  {currentPage * limit + 1}–
                  {Math.min((currentPage + 1) * limit, total)}
                </span>{' '}
                of <span className="font-semibold text-text-dark">{total}</span>{' '}
                buildings
              </p>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 0}
                  onClick={() => onPageChange(currentPage - 1)}
                  className="size-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="size-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`size-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      currentPage === i
                        ? 'bg-primary text-white'
                        : 'border border-gray-200 hover:bg-gray-50 text-text-dark'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages - 1}
                  onClick={() => onPageChange(currentPage + 1)}
                  className="size-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BuildingTableView;
