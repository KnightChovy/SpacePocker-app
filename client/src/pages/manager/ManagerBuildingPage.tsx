import { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import type {
  BuildingDetail,
  CreateBuildingPayload,
  UpdateBuildingPayload,
  BuildingQueryParams,
} from '@/types/user/types';
import AppHeader from '@/components/layouts/AppHeader';
import AddBuildingModal from '@/components/features/manager/buildingManager/AddBuildingModal';
import EditBuildingModal from '@/components/features/manager/buildingManager/EditBuildingModal';
import ViewBuildingModal from '@/components/features/manager/buildingManager/ViewBuildingModal';
import BuildingFilters from '@/components/features/manager/buildingManager/BuildingFilters';
import BuildingTableView from '@/components/features/manager/buildingManager/BuildingTableView';
import { useGetBuildings } from '@/hooks/manager/buildings/use-get-buildings';
import { useCreateBuilding } from '@/hooks/manager/buildings/use-create-building';
import { useDeleteBuilding } from '@/hooks/manager/buildings/use-delete-building';
import { useUpdateBuilding } from '@/hooks/manager/buildings/use-update-building';
import { useAuthStore } from '@/stores/auth.store';
import { getAvatarUrl } from '@/lib/utils';

const LIMIT = 10;

const ManagerBuildingPage = () => {
  const { setSidebarOpen } = useOutletContext<{
    setSidebarOpen: (open: boolean) => void;
  }>();
  const user = useAuthStore(state => state.user);

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
  const [viewingBuilding, setViewingBuilding] = useState<BuildingDetail | null>(
    null
  );

  const queryParams = useMemo<BuildingQueryParams>(
    () => ({
      search: searchQuery || undefined,
      campus: selectedCampus !== 'all' ? selectedCampus : undefined,
      sortBy,
      sortOrder,
      limit: LIMIT,
      offset: page * LIMIT,
    }),
    [searchQuery, selectedCampus, sortBy, sortOrder, page]
  );

  const {
    data: buildingsData,
    isLoading,
    isFetching,
  } = useGetBuildings(queryParams);

  const buildings = buildingsData?.buildings ?? [];
  const total = buildingsData?.pagination.total ?? 0;

  const createBuildingMutation = useCreateBuilding();
  const updateBuildingMutation = useUpdateBuilding();
  const deleteBuildingMutation = useDeleteBuilding();

  useEffect(() => {
    setPage(0);
  }, [searchQuery, selectedCampus, sortBy, sortOrder]);

  const handleAdd = async (payload: CreateBuildingPayload) => {
    await createBuildingMutation.mutateAsync(payload);
  };

  const handleUpdate = async (id: string, payload: UpdateBuildingPayload) => {
    await updateBuildingMutation.mutateAsync({ id, body: payload });
    setEditingBuilding(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this building?'))
      return;
    try {
      await deleteBuildingMutation.mutateAsync(id);
    } catch (err) {
      console.error('Failed to delete building:', err);
    }
  };

  const handleView = (b: BuildingDetail) => {
    setViewingBuilding(b);
  };

  return (
    <>
      <AppHeader
        title="Building Management"
        subtitle="Manage all buildings, campuses, and facilities."
        onMenuClick={() => setSidebarOpen(true)}
        profile={{
          name: user?.name || 'Manager',
          subtitle: user?.role || 'MANAGER',
          avatarUrl: getAvatarUrl(user?.name, 'Manager'),
          showDropdown: true,
        }}
      />

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 custom-scrollbar">
        <div className="max-w-300 mx-auto w-full pb-10">
          <BuildingFilters
            searchQuery={searchQuery}
            selectedCampus={selectedCampus}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSearchChange={setSearchQuery}
            onCampusChange={setSelectedCampus}
            onSortChange={(by, order) => {
              setSortBy(by);
              setSortOrder(order);
            }}
            onAddClick={() => setIsAddModalOpen(true)}
          />

          <BuildingTableView
            buildings={buildings}
            isLoading={isLoading || isFetching}
            total={total}
            currentPage={page}
            limit={LIMIT}
            onEdit={setEditingBuilding}
            onDelete={handleDelete}
            onView={handleView}
            onPageChange={setPage}
          />
        </div>
      </div>

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
      <ViewBuildingModal
        isOpen={!!viewingBuilding}
        building={viewingBuilding}
        onClose={() => setViewingBuilding(null)}
        onEdit={building => {
          setViewingBuilding(null);
          setEditingBuilding(building);
        }}
      />
    </>
  );
};

export default ManagerBuildingPage;
