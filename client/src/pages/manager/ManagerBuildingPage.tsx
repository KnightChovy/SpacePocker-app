import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Plus,
  Search,
  Building2,
  ChevronDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Bell,
  MessageSquare,
  MapPin,
  GraduationCap,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type {
  BuildingDetail,
  CreateBuildingPayload,
  UpdateBuildingPayload,
  BuildingQueryParams,
} from '@/types/types';
import { buildingService } from '@/services/buildingService';
import AppHeader from '@/components/layouts/AppHeader';
import AddBuildingModal from '@/components/features/manager/buildingManager/AddBuildingModal';
import EditBuildingModal from '@/components/features/manager/buildingManager/EditBuildingModal';

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatDate = (iso?: string) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// ─── Row ────────────────────────────────────────────────────────────────────

const BuildingRow = ({
  building,
  onEdit,
  onDelete,
  onView,
}: {
  building: BuildingDetail;
  onEdit: (b: BuildingDetail) => void;
  onDelete: (id: string) => void;
  onView: (b: BuildingDetail) => void;
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      {/* Building Name */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Building2 className="size-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-text-dark leading-tight">
              {building.buildingName}
            </p>
            <p className="text-xs text-text-gray mt-0.5">ID: {building.id}</p>
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

      {/* Manager ID */}
      <td className="py-4 px-4">
        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-mono">
          {building.managerId}
        </span>
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
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 min-w-32">
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

// ─── Page ────────────────────────────────────────────────────────────────────

const LIMIT = 10;

const CAMPUS_OPTIONS = [
  'Main Campus',
  'North Campus',
  'South Campus',
  'East Campus',
  'West Campus',
];

const ManagerBuildingPage = () => {
  const { setSidebarOpen } = useOutletContext<{
    setSidebarOpen: (open: boolean) => void;
  }>();

  const headerActions = [
    { id: 'notifications', icon: <Bell className="h-5 w-5" />, badge: true },
    { id: 'messages', icon: <MessageSquare className="h-5 w-5" /> },
  ];

  // ── State ──────────────────────────────────────────────────────────────────
  const [buildings, setBuildings] = useState<BuildingDetail[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [sortBy, setSortBy] =
    useState<BuildingQueryParams['sortBy']>('buildingName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<BuildingDetail | null>(
    null
  );

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchBuildings = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await buildingService.getAllBuildings({
        search: searchQuery || undefined,
        campus: selectedCampus !== 'all' ? selectedCampus : undefined,
        sortBy,
        sortOrder,
        limit: LIMIT,
        offset: page * LIMIT,
      });
      setBuildings(result.buildings);
      setTotal(result.pagination.total);
    } catch (err) {
      console.error('Failed to fetch buildings:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCampus, sortBy, sortOrder, page]);

  useEffect(() => {
    setPage(0);
  }, [searchQuery, selectedCampus, sortBy, sortOrder]);

  useEffect(() => {
    fetchBuildings();
  }, [fetchBuildings]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleAdd = async (payload: CreateBuildingPayload) => {
    const created = await buildingService.createBuilding(payload);
    setBuildings(prev => [created, ...prev]);
    setTotal(t => t + 1);
  };

  const handleUpdate = async (id: string, payload: UpdateBuildingPayload) => {
    const updated = await buildingService.updateBuilding(id, payload);
    setBuildings(prev => prev.map(b => (b.id === id ? updated : b)));
    setEditingBuilding(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this building?'))
      return;
    try {
      await buildingService.deleteBuilding(id);
      setBuildings(prev => prev.filter(b => b.id !== id));
      setTotal(t => t - 1);
    } catch (err) {
      console.error('Failed to delete building:', err);
    }
  };

  const handleView = (b: BuildingDetail) => {
    // TODO: open detail panel / drawer
    console.log('View building:', b);
  };

  const totalPages = Math.ceil(total / LIMIT);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <AppHeader
        title="Building Management"
        subtitle="Manage all buildings, campuses, and facilities."
        onMenuClick={() => setSidebarOpen(true)}
        actions={headerActions}
        profile={{
          name: 'Alex Morgan',
          subtitle: 'Manager',
          avatarUrl: 'https://picsum.photos/id/64/100/100',
          showDropdown: true,
        }}
      />

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 custom-scrollbar">
        <div className="max-w-300 mx-auto w-full pb-10">
          {/* ── Filter Bar ── */}
          <div className="flex flex-wrap gap-3 mb-6">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search buildings..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* Campus filter */}
            <div className="relative">
              <select
                value={selectedCampus}
                onChange={e => setSelectedCampus(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
              >
                <option value="all">All Campuses</option>
                {CAMPUS_OPTIONS.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={`${sortBy}:${sortOrder}`}
                onChange={e => {
                  const [by, order] = e.target.value.split(':') as [
                    BuildingQueryParams['sortBy'],
                    'asc' | 'desc',
                  ];
                  setSortBy(by);
                  setSortOrder(order);
                }}
                className="appearance-none pl-4 pr-8 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
              >
                <option value="buildingName:asc">Name A → Z</option>
                <option value="buildingName:desc">Name Z → A</option>
                <option value="campus:asc">Campus A → Z</option>
                <option value="createdAt:desc">Newest First</option>
                <option value="createdAt:asc">Oldest First</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Add Building */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 shadow-sm shadow-primary/20 transition-all active:scale-95 ml-auto"
            >
              <Plus className="size-4" />
              Add Building
            </button>
          </div>

          {/* ── Table ── */}
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
                        onEdit={setEditingBuilding}
                        onDelete={handleDelete}
                        onView={handleView}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Pagination ── */}
            {!isLoading && totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <p className="text-sm text-text-gray">
                  Showing{' '}
                  <span className="font-semibold text-text-dark">
                    {page * LIMIT + 1}–{Math.min((page + 1) * LIMIT, total)}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold text-text-dark">{total}</span>{' '}
                  buildings
                </p>
                <div className="flex items-center gap-1">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage(p => p - 1)}
                    className="size-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`size-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        page === i
                          ? 'bg-primary text-white'
                          : 'border border-gray-200 hover:bg-gray-50 text-text-dark'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={page === totalPages - 1}
                    onClick={() => setPage(p => p + 1)}
                    className="size-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <AddBuildingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAdd}
      />
      <EditBuildingModal
        isOpen={!!editingBuilding}
        building={editingBuilding}
        onClose={() => setEditingBuilding(null)}
        onUpdate={handleUpdate}
      />
    </>
  );
};

export default ManagerBuildingPage;
