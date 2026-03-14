import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import AppHeader from '@/components/layouts/AppHeader';
import { useAuthStore } from '@/stores/auth.store';
import { getAvatarUrl } from '@/lib/utils';
import type { ApiAmenity } from '@/types/room-api';
import { useGetAmenities } from '@/hooks/admin/amenities/use-get-amenities';
import { useCreateAmenity } from '@/hooks/admin/amenities/use-create-amenity';
import { useUpdateAmenity } from '@/hooks/admin/amenities/use-update-amenity';
import { useDeleteAmenity } from '@/hooks/admin/amenities/use-delete-amenity';

type AmenityModalMode = 'create' | 'edit';

const AmenitiesPage: React.FC = () => {
  const { setSidebarOpen } = useOutletContext<{
    setSidebarOpen: (open: boolean) => void;
  }>();

  const authUser = useAuthStore(state => state.user);

  const { data, isLoading, isError } = useGetAmenities();
  const createMutation = useCreateAmenity();
  const updateMutation = useUpdateAmenity();
  const deleteMutation = useDeleteAmenity();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<AmenityModalMode>('create');
  const [editingAmenity, setEditingAmenity] = useState<ApiAmenity | null>(null);
  const [nameInput, setNameInput] = useState('');

  const amenities = useMemo(() => data ?? [], [data]);

  const filteredAmenities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return amenities;
    return amenities.filter(a => a.name.toLowerCase().includes(q));
  }, [amenities, searchQuery]);

  const openCreate = () => {
    setModalMode('create');
    setEditingAmenity(null);
    setNameInput('');
    setIsModalOpen(true);
  };

  const openEdit = (amenity: ApiAmenity) => {
    setModalMode('edit');
    setEditingAmenity(amenity);
    setNameInput(amenity.name);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (createMutation.isPending || updateMutation.isPending) return;
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!isModalOpen) {
      setNameInput('');
      setEditingAmenity(null);
      setModalMode('create');
    }
  }, [isModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameInput.trim();
    if (!name) return;

    if (modalMode === 'create') {
      createMutation.mutate(
        { name },
        {
          onSuccess: () => {
            setIsModalOpen(false);
          },
        }
      );
      return;
    }

    if (!editingAmenity) return;

    updateMutation.mutate(
      { id: editingAmenity.id, name },
      {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      }
    );
  };

  const handleDelete = (amenity: ApiAmenity) => {
    if (deleteMutation.isPending) return;
    if (!window.confirm(`Delete amenity "${amenity.name}"?`)) return;
    deleteMutation.mutate(amenity.id);
  };

  const headerActions = [
    {
      id: 'add-amenity',
      icon: (
        <span className="material-symbols-outlined text-[20px]">
          add_circle
        </span>
      ),
      label: 'Add Amenity',
      variant: 'primary' as const,
      onClick: openCreate,
    },
  ];

  return (
    <>
      <AppHeader
        title="Amenity Management"
        subtitle="Manage amenities available across rooms."
        onMenuClick={() => setSidebarOpen(true)}
        showSearch={true}
        searchPlaceholder="Search amenities..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        actions={headerActions}
        profile={{
          name: authUser?.name || 'Admin',
          subtitle: authUser?.role || 'ADMIN',
          avatarUrl: getAvatarUrl(authUser?.name, 'Admin'),
          showDropdown: true,
        }}
        iconType="material"
      />

      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-surface-light rounded-2xl shadow-float border border-gray-100 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2 text-sm text-text-secondary-light">
                <span className="material-symbols-outlined text-[18px]">info</span>
                <span>
                  {isLoading
                    ? 'Loading amenities...'
                    : isError
                      ? 'Failed to load amenities'
                      : `Showing ${filteredAmenities.length} amenities`}
                </span>
              </div>
              <button
                onClick={openCreate}
                className="flex items-center gap-2 h-10 px-4 bg-primary text-white rounded-lg shadow-lg shadow-primary/30 hover:bg-indigo-600 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                <span className="text-sm font-semibold">Add</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-200">
                <thead>
                  <tr className="bg-gray-50/50 text-xs font-semibold text-text-secondary-light uppercase tracking-wider border-b border-gray-200">
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isError ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-10 px-6 text-center text-sm text-red-600"
                      >
                        Failed to load amenities. Please try again.
                      </td>
                    </tr>
                  ) : null}

                  {!isLoading && !isError && filteredAmenities.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-10 px-6 text-center text-sm text-gray-500"
                      >
                        No amenities found.
                      </td>
                    </tr>
                  ) : null}

                  {filteredAmenities.map(amenity => (
                    <tr
                      key={amenity.id}
                      className="group hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <span className="size-9 rounded-lg bg-indigo-50 text-indigo-600 inline-flex items-center justify-center border border-indigo-100">
                            <span className="material-symbols-outlined text-[18px]">
                              checklist
                            </span>
                          </span>
                          <span className="font-semibold text-sm text-gray-900">
                            {amenity.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500 font-mono">
                        {amenity.id}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => openEdit(amenity)}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(amenity)}
                            disabled={deleteMutation.isPending}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-red-600 bg-white hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <footer className="mt-8 text-center text-xs text-text-secondary-light pb-4">
            <p>
              © {new Date().getFullYear()} SPACEPOCKER Inc. All rights reserved.
            </p>
          </footer>
        </div>
      </main>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-float border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <div className="text-base font-bold text-gray-900">
                  {modalMode === 'create' ? 'Add Amenity' : 'Edit Amenity'}
                </div>
                <div className="text-sm text-gray-500">
                  {modalMode === 'create'
                    ? 'Create a new amenity.'
                    : 'Update the amenity name.'}
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Name
                </label>
                <input
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="e.g. WiFi"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 h-11 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 h-11 rounded-xl bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/30 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  disabled={
                    !nameInput.trim() ||
                    createMutation.isPending ||
                    updateMutation.isPending
                  }
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AmenitiesPage;
