import React, { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import AppHeader from '@/components/layouts/AppHeader';
import { useAuthStore } from '@/stores/auth.store';
import { getAvatarUrl } from '@/lib/utils';
import { useCreateServiceCategory } from '@/hooks/manager/service-categories/use-create-service-category';
import { useGetServiceCategoriesManager } from '@/hooks/manager/service-categories/use-get-service-categories';
import { useUpdateServiceCategory } from '@/hooks/manager/service-categories/use-update-service-category';
import { useDeleteServiceCategory } from '@/hooks/manager/service-categories/use-delete-service-category';
import type { ApiServiceCategory } from '@/types/user/booking-request-api';

type CategoryModalMode = 'create' | 'edit';

const ManagerServiceCategoriesPage = () => {
  const { setSidebarOpen } = useOutletContext<{
    setSidebarOpen: (open: boolean) => void;
  }>();

  const user = useAuthStore(state => state.user);

  const categoriesQuery = useGetServiceCategoriesManager();
  const createMutation = useCreateServiceCategory();
  const updateMutation = useUpdateServiceCategory();
  const deleteMutation = useDeleteServiceCategory();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<CategoryModalMode>('create');
  const [editingCategory, setEditingCategory] =
    useState<ApiServiceCategory | null>(null);

  const [nameInput, setNameInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');

  const categories = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data]
  );

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(c => {
      return (
        c.name.toLowerCase().includes(q) ||
        (c.description ?? '').toLowerCase().includes(q)
      );
    });
  }, [categories, searchQuery]);

  const resetModalState = () => {
    setNameInput('');
    setDescriptionInput('');
    setEditingCategory(null);
    setModalMode('create');
  };

  const openCreate = () => {
    setModalMode('create');
    setEditingCategory(null);
    setNameInput('');
    setDescriptionInput('');
    setIsModalOpen(true);
  };

  const openEdit = (category: ApiServiceCategory) => {
    setModalMode('edit');
    setEditingCategory(category);
    setNameInput(category.name ?? '');
    setDescriptionInput(category.description ?? '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (createMutation.isPending || updateMutation.isPending) return;
    setIsModalOpen(false);
    resetModalState();
  };

  const canSubmit = useMemo(() => {
    const name = nameInput.trim();
    if (!name) return false;
    if (createMutation.isPending || updateMutation.isPending) return false;
    return true;
  }, [nameInput, createMutation.isPending, updateMutation.isPending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const name = nameInput.trim();
    const description = descriptionInput.trim();
    if (!name) return;

    if (modalMode === 'create') {
      createMutation.mutate(
        {
          name,
          description: description || undefined,
          managerId: user?.id || '',
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

    if (!editingCategory) return;

    updateMutation.mutate(
      {
        id: editingCategory.id,
        name,
        description: description || undefined,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          resetModalState();
        },
      }
    );
  };

  const handleDelete = (category: ApiServiceCategory) => {
    if (deleteMutation.isPending) return;
    if (!window.confirm(`Delete service category "${category.name}"?`)) return;
    deleteMutation.mutate(category.id);
  };

  const headerActions = [
    {
      id: 'add-category',
      icon: (
        <span className="material-symbols-outlined text-[20px]">
          add_circle
        </span>
      ),
      label: 'Add Category',
      variant: 'primary' as const,
      onClick: openCreate,
    },
  ];

  return (
    <>
      <AppHeader
        title="Service Categories"
        subtitle="Manager creates service categories (overview like “Projector”)."
        onMenuClick={() => setSidebarOpen(true)}
        showSearch={true}
        searchPlaceholder="Search categories..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        actions={headerActions}
        profile={{
          name: user?.name || 'Manager',
          subtitle: user?.role || 'MANAGER',
          avatarUrl: getAvatarUrl(user?.name, 'Manager'),
          showDropdown: true,
        }}
      />

      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 custom-scrollbar relative">
        <div className="max-w-350 mx-auto w-full pb-10 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="material-symbols-outlined text-[18px]">
                  info
                </span>
                <span>
                  {categoriesQuery.isLoading
                    ? 'Loading categories...'
                    : categoriesQuery.isError
                      ? 'Failed to load categories'
                      : `Showing ${filteredCategories.length} categories`}
                </span>
              </div>

              <button
                onClick={openCreate}
                className="flex items-center gap-2 h-10 px-4 bg-primary text-white rounded-lg shadow-sm hover:bg-primary-dark transition-all"
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
                  <tr className="bg-gray-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-gray-200">
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Services</th>
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categoriesQuery.isError ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-10 px-6 text-center text-sm text-red-600"
                      >
                        Failed to load categories. Please try again.
                      </td>
                    </tr>
                  ) : null}

                  {!categoriesQuery.isLoading &&
                  !categoriesQuery.isError &&
                  filteredCategories.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-10 px-6 text-center text-sm text-gray-500"
                      >
                        No categories found.
                      </td>
                    </tr>
                  ) : null}

                  {filteredCategories.map(category => (
                    <tr
                      key={category.id}
                      className="group hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <span className="size-9 rounded-lg bg-indigo-50 text-indigo-600 inline-flex items-center justify-center border border-indigo-100">
                            <span className="material-symbols-outlined text-[18px]">
                              category
                            </span>
                          </span>
                          <div className="min-w-0">
                            <div className="font-semibold text-sm text-gray-900 truncate">
                              {category.name}
                            </div>
                            {category.description ? (
                              <div className="text-xs text-gray-500 truncate">
                                {category.description}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700">
                        {category.services?.length ?? 0}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500 font-mono">
                        {category.id}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => openEdit(category)}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(category)}
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
        </div>
      </main>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-float border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <div className="text-base font-bold text-gray-900">
                  {modalMode === 'create'
                    ? 'Add Service Category'
                    : 'Edit Service Category'}
                </div>
                <div className="text-sm text-gray-500">
                  {modalMode === 'create'
                    ? 'Create a new service category.'
                    : 'Update the category information.'}
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
                  className="h-11 px-5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? modalMode === 'create'
                      ? 'Creating...'
                      : 'Saving...'
                    : modalMode === 'create'
                      ? 'Create Category'
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

export default ManagerServiceCategoriesPage;
