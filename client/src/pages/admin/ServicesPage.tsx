import React, { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import AppHeader from '@/components/layouts/AppHeader';
import { useAuthStore } from '@/stores/auth.store';
import { getAvatarUrl } from '@/lib/utils';
import { useGetServiceCategories } from '@/hooks/user/service-categories/use-get-service-categories';
import { useCreateService } from '@/hooks/admin/services/use-create-service';
import { useGetServices } from '@/hooks/admin/services/use-get-services';
import { useUpdateService } from '@/hooks/admin/services/use-update-service';
import { useDeleteService } from '@/hooks/admin/services/use-delete-service';
import type { ApiService } from '@/types/booking-request-api';

type ServiceModalMode = 'create' | 'edit';

const ServicesPage = () => {
  const { setSidebarOpen } = useOutletContext<{
    setSidebarOpen: (open: boolean) => void;
  }>();

  const authUser = useAuthStore(state => state.user);

  const categoriesQuery = useGetServiceCategories();
  const categories = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data]
  );

  const servicesQuery = useGetServices();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ServiceModalMode>('create');
  const [editingService, setEditingService] = useState<ApiService | null>(null);

  const [nameInput, setNameInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [priceInput, setPriceInput] = useState<string>('');
  const [categoryIdInput, setCategoryIdInput] = useState('');

  const services = useMemo(
    () => servicesQuery.data ?? [],
    [servicesQuery.data]
  );

  const categoryNameById = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach(c => map.set(c.id, c.name));
    return map;
  }, [categories]);

  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return services;
    return services.filter(s => {
      const categoryName = categoryNameById.get(s.categoryId) ?? '';
      return (
        s.name.toLowerCase().includes(q) ||
        (s.description ?? '').toLowerCase().includes(q) ||
        categoryName.toLowerCase().includes(q)
      );
    });
  }, [services, searchQuery, categoryNameById]);

  const openCreate = () => {
    setModalMode('create');
    setEditingService(null);
    setNameInput('');
    setDescriptionInput('');
    setPriceInput('');
    setCategoryIdInput('');
    setIsModalOpen(true);
  };

  const openEdit = (service: ApiService) => {
    setModalMode('edit');
    setEditingService(service);
    setNameInput(service.name ?? '');
    setDescriptionInput(service.description ?? '');
    setPriceInput(String(service.price ?? 0));
    setCategoryIdInput(service.categoryId ?? '');
    setIsModalOpen(true);
  };

  const resetModalState = () => {
    setNameInput('');
    setDescriptionInput('');
    setPriceInput('');
    setCategoryIdInput('');
    setEditingService(null);
    setModalMode('create');
  };

  const closeModal = () => {
    if (createMutation.isPending || updateMutation.isPending) return;
    setIsModalOpen(false);
    resetModalState();
  };

  const canSubmit = useMemo(() => {
    const name = nameInput.trim();
    const categoryId = categoryIdInput.trim();
    const price = Number(priceInput);
    if (!name || !categoryId || priceInput.trim().length === 0) return false;
    if (Number.isNaN(price) || price < 0) return false;
    if (createMutation.isPending || updateMutation.isPending) return false;
    return true;
  }, [
    nameInput,
    categoryIdInput,
    priceInput,
    createMutation.isPending,
    updateMutation.isPending,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const name = nameInput.trim();
    const description = descriptionInput.trim();
    const price = Number(priceInput);
    const categoryId = categoryIdInput.trim();

    if (!name || !categoryId || Number.isNaN(price) || price < 0) return;

    if (modalMode === 'create') {
      createMutation.mutate(
        {
          name,
          description: description || undefined,
          price,
          categoryId,
        },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            resetModalState();
          },
        }
      );
      return;
    }

    if (!editingService) return;

    updateMutation.mutate(
      {
        id: editingService.id,
        name,
        description: description || undefined,
        price,
        categoryId,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          resetModalState();
        },
      }
    );
  };

  const handleDelete = (service: ApiService) => {
    if (deleteMutation.isPending) return;
    if (!window.confirm(`Delete service "${service.name}"?`)) return;
    deleteMutation.mutate(service.id);
  };

  return (
    <>
      <AppHeader
        title="Service Management"
        subtitle="Create small services like projector, cables, whiteboard."
        onMenuClick={() => setSidebarOpen(true)}
        showSearch={true}
        searchPlaceholder="Search services..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
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
                <span className="material-symbols-outlined text-[18px]">
                  info
                </span>
                <span>
                  {servicesQuery.isLoading
                    ? 'Loading services...'
                    : servicesQuery.isError
                      ? 'Failed to load services'
                      : `Showing ${filteredServices.length} services`}
                </span>
              </div>

              <button
                onClick={openCreate}
                className="flex items-center gap-2 h-10 px-4 bg-primary text-white rounded-lg shadow-lg shadow-primary/30 hover:bg-indigo-600 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">
                  add
                </span>
                <span className="text-sm font-semibold">Add</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-200">
                <thead>
                  <tr className="bg-gray-50/50 text-xs font-semibold text-text-secondary-light uppercase tracking-wider border-b border-gray-200">
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {servicesQuery.isError ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-10 px-6 text-center text-sm text-red-600"
                      >
                        Failed to load services. Please try again.
                      </td>
                    </tr>
                  ) : null}

                  {!servicesQuery.isLoading &&
                  !servicesQuery.isError &&
                  filteredServices.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-10 px-6 text-center text-sm text-gray-500"
                      >
                        No services found.
                      </td>
                    </tr>
                  ) : null}

                  {filteredServices.map(service => (
                    <tr
                      key={service.id}
                      className="group hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <span className="size-9 rounded-lg bg-indigo-50 text-indigo-600 inline-flex items-center justify-center border border-indigo-100">
                            <span className="material-symbols-outlined text-[18px]">
                              home_repair_service
                            </span>
                          </span>
                          <div className="min-w-0">
                            <div className="font-semibold text-sm text-gray-900 truncate">
                              {service.name}
                            </div>
                            {service.description ? (
                              <div className="text-xs text-gray-500 truncate">
                                {service.description}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700">
                        {categoryNameById.get(service.categoryId) ??
                          service.categoryId}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700">
                        {service.price}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500 font-mono">
                        {service.id}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => openEdit(service)}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(service)}
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
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-float border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <div className="text-base font-bold text-gray-900">
                  {modalMode === 'create' ? 'Add Service' : 'Edit Service'}
                </div>
                <div className="text-sm text-gray-500">
                  {modalMode === 'create'
                    ? 'Create a new service.'
                    : 'Update the service information.'}
                </div>
              </div>
              <button
                onClick={closeModal}
                className="size-9 inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Name
                </label>
                <input
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  placeholder="e.g. Projector"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Category
                </label>
                <select
                  value={categoryIdInput}
                  onChange={e => setCategoryIdInput(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Select a category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {categoriesQuery.isLoading ? (
                  <div className="text-xs text-gray-500">
                    Loading categories...
                  </div>
                ) : categoriesQuery.isError ? (
                  <div className="text-xs text-red-600">
                    Failed to load categories.
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-xs text-amber-600">
                    No categories yet. Ask a manager to create a service
                    category first.
                  </div>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Price
                </label>
                <input
                  value={priceInput}
                  onChange={e => setPriceInput(e.target.value)}
                  inputMode="decimal"
                  placeholder="0"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Description (optional)
                </label>
                <textarea
                  value={descriptionInput}
                  onChange={e => setDescriptionInput(e.target.value)}
                  placeholder="Short description..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="h-11 px-5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? modalMode === 'create'
                      ? 'Creating...'
                      : 'Saving...'
                    : modalMode === 'create'
                      ? 'Create Service'
                      : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ServicesPage;
