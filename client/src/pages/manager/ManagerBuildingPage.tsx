import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Bell, MessageSquare } from 'lucide-react';
import type {
  BuildingDetail,
  CreateBuildingPayload,
  UpdateBuildingPayload,
  BuildingQueryParams,
  GetAllBuildingsResponse,
} from '@/types/types';
import axiosInstance from '@/lib/axios';
import { useAuthStore } from '@/stores/auth.store';
import AppHeader from '@/components/layouts/AppHeader';
import AddBuildingModal from '@/components/features/manager/buildingManager/AddBuildingModal';
import EditBuildingModal from '@/components/features/manager/buildingManager/EditBuildingModal';
import ViewBuildingModal from '@/components/features/manager/buildingManager/ViewBuildingModal';
import BuildingFilters from '@/components/features/manager/buildingManager/BuildingFilters';
import BuildingTableView from '@/components/features/manager/buildingManager/BuildingTableView';

const LIMIT = 10;

const ManagerBuildingPage = () => {
  const { setSidebarOpen } = useOutletContext<{
    setSidebarOpen: (open: boolean) => void;
  }>();

  const headerActions = [
    { id: 'notifications', icon: <Bell className="h-5 w-5" />, badge: true },
    { id: 'messages', icon: <MessageSquare className="h-5 w-5" /> },
  ];

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
  const [viewingBuilding, setViewingBuilding] = useState<BuildingDetail | null>(
    null
  );

  const fetchBuildings = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get<{
        metadata: GetAllBuildingsResponse;
      }>('/buildings', {
        params: {
          search: searchQuery || undefined,
          campus: selectedCampus !== 'all' ? selectedCampus : undefined,
          sortBy,
          sortOrder,
          limit: LIMIT,
          offset: page * LIMIT,
        },
      });
      const result = response.data.metadata;
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

  const handleAdd = async (payload: CreateBuildingPayload) => {
    // Tự động lấy managerId từ user đã đăng nhập
    const currentUser = useAuthStore.getState().user;
    const body = {
      ...payload,
      managerId: payload.managerId || currentUser?.id,
    };
    const response = await axiosInstance.post<{
      metadata: { createBuilding: BuildingDetail };
    }>('/building', body);
    const created = response.data.metadata.createBuilding;
    setBuildings(prev => [created, ...prev]);
    setTotal(t => t + 1);
  };

  const handleUpdate = async (id: string, payload: UpdateBuildingPayload) => {
    const response = await axiosInstance.put<{
      metadata: { updateBuilding: BuildingDetail };
    }>(`/building/${id}`, payload);
    const updated = response.data.metadata.updateBuilding;
    setBuildings(prev => prev.map(b => (b.id === id ? updated : b)));
    setEditingBuilding(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this building?'))
      return;
    try {
      await axiosInstance.delete(`/building/${id}`);
      setBuildings(prev => prev.filter(b => b.id !== id));
      setTotal(t => t - 1);
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
            isLoading={isLoading}
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
