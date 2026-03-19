import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import AppHeader from '@/components/layouts/AppHeader';
import { RoleBadge, StatusBadge } from '@/components/features/admin/Badge';
import { useAuthStore } from '@/stores/auth.store';
import { getAvatarUrl } from '@/lib/utils';
import { useGetUsers } from '@/hooks/admin/users/use-get-users';
import { usePromoteUserToManager } from '@/hooks/admin/users/use-promote-user-to-manager';
import type { ApiUser, ApiUserRole } from '@/types/admin/users-api';

type UiStatus = 'Active' | 'Idle' | 'Offline' | 'Suspended';
type UserSortOption = 'newest' | 'oldest' | 'lastActive';

const toHandle = (email: string) => {
  const atIndex = email.indexOf('@');
  const prefix = atIndex === -1 ? email : email.slice(0, atIndex);
  return `@${prefix}`;
};

const roleOptions: Array<{ label: string; value?: ApiUserRole }> = [
  { label: 'All Roles', value: undefined },
  { label: 'ADMIN', value: 'ADMIN' },
  { label: 'MANAGER', value: 'MANAGER' },
  { label: 'USER', value: 'USER' },
];

const UsersPage: React.FC = () => {
  const { setSidebarOpen } = useOutletContext<{
    setSidebarOpen: (open: boolean) => void;
  }>();
  const user = useAuthStore(state => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [roleFilter, setRoleFilter] = useState<ApiUserRole | undefined>(
    undefined
  );
  const [sortBy, setSortBy] = useState<UserSortOption>('newest');

  const { data, isLoading, isError } = useGetUsers({
    search: searchQuery || undefined,
    role: roleFilter,
    page,
    limit,
  });

  const promoteMutation = usePromoteUserToManager();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [searchQuery, roleFilter]);

  const users: ApiUser[] = useMemo(() => {
    const rawUsers = data?.users ?? [];
    const sortedUsers = [...rawUsers];

    if (sortBy === 'oldest') {
      sortedUsers.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      return sortedUsers;
    }

    if (sortBy === 'lastActive') {
      sortedUsers.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      return sortedUsers;
    }

    sortedUsers.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return sortedUsers;
  }, [data?.users, sortBy]);
  const pagination = data?.pagination;
  const totalUsers = pagination?.total;
  const totalPages = pagination?.totalPages ?? 1;
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <>
      <AppHeader
        title="User Management"
        subtitle={
          typeof totalUsers === 'number'
            ? `Manage ${totalUsers.toLocaleString()} registered users.`
            : 'Manage registered users.'
        }
        onMenuClick={() => setSidebarOpen(true)}
        showSearch={true}
        searchPlaceholder="Search users..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        profile={{
          name: user?.name || 'Admin',
          subtitle: user?.role || 'ADMIN',
          avatarUrl: getAvatarUrl(user?.name, 'Admin'),
          showDropdown: true,
        }}
        iconType="material"
      />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between gap-3">
            <select
              className="form-select bg-transparent text-sm border-gray-200 rounded-lg text-gray-600 focus:ring-0 focus:border-primary h-10 py-1 pl-3 pr-8 cursor-pointer"
              value={roleFilter ?? ''}
              onChange={e =>
                setRoleFilter(
                  (e.target.value || undefined) as ApiUserRole | undefined
                )
              }
            >
              {roleOptions.map(opt => (
                <option key={opt.label} value={opt.value ?? ''}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-surface-light rounded-2xl shadow-float border border-gray-100 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2 text-sm text-text-secondary-light">
                <span className="material-symbols-outlined text-[18px]">
                  info
                </span>
                <span>
                  {isLoading
                    ? 'Loading users...'
                    : isError
                      ? 'Failed to load users'
                      : `Showing ${users.length} users`}
                </span>
              </div>
              <div className="flex gap-2">
                <select
                  className="form-select bg-transparent text-sm border-gray-200 rounded-lg text-gray-600 focus:ring-0 focus:border-primary py-1 pl-2 pr-8 cursor-pointer"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as UserSortOption)}
                >
                  <option value="newest">Sort by: Newest</option>
                  <option value="oldest">Sort by: Oldest</option>
                  <option value="lastActive">Sort by: Last Active</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-200">
                <thead>
                  <tr className="bg-gray-50/50 text-xs font-semibold text-text-secondary-light uppercase tracking-wider border-b border-gray-200">
                    <th className="py-4 px-6 w-12 text-center">
                      <input
                        className="rounded border-gray-300 text-primary focus:ring-primary/20"
                        type="checkbox"
                      />
                    </th>
                    <th className="py-4 px-4">User</th>
                    <th className="py-4 px-4">Email Address</th>
                    <th className="py-4 px-4">Role</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4">Last Login</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isError ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-10 px-6 text-center text-sm text-red-600"
                      >
                        Failed to load users. Please try again.
                      </td>
                    </tr>
                  ) : null}

                  {!isLoading && !isError && users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-10 px-6 text-center text-sm text-gray-500"
                      >
                        No users found.
                      </td>
                    </tr>
                  ) : null}

                  {users.map(u => {
                    const status: UiStatus = 'Active';
                    const handle = toHandle(u.email);
                    const canPromote = u.role === 'USER';

                    return (
                      <tr
                        key={u.id}
                        className="group hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-6 text-center">
                          <input
                            className="rounded border-gray-300 text-primary focus:ring-primary/20"
                            type="checkbox"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="size-10 rounded-full bg-cover bg-center border border-gray-200"
                              style={{
                                backgroundImage: `url(${getAvatarUrl(u.name, 'User')})`,
                              }}
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold text-sm text-gray-900">
                                {u.name}
                              </span>
                              <span className="text-xs text-text-secondary-light">
                                {handle}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {u.email}
                        </td>
                        <td className="py-4 px-4">
                          <RoleBadge type={u.role} />
                        </td>
                        <td className="py-4 px-4">
                          <StatusBadge type={status} />
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-500 font-mono">
                          {new Date(u.updatedAt).toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-right">
                          {canPromote ? (
                            <button
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              disabled={promoteMutation.isPending}
                              onClick={() => {
                                if (
                                  !window.confirm(
                                    `Promote ${u.email} to MANAGER?`
                                  )
                                ) {
                                  return;
                                }
                                promoteMutation.mutate(u.id);
                              }}
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                upgrade
                              </span>
                              {promoteMutation.isPending
                                ? 'Promoting...'
                                : 'Promote'}
                            </button>
                          ) : (
                            <button
                              className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              disabled={!canGoNext || isLoading}
                              onClick={() =>
                                setPage(p => Math.min(totalPages, p + 1))
                              }
                            >
                              Next
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                Showing page{' '}
                <span className="font-medium text-gray-900">{page}</span> of{' '}
                <span className="font-medium text-gray-900">{totalPages}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={!canGoPrev || isLoading}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Previous
                </button>
                <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>

          <footer className="mt-8 text-center text-xs text-text-secondary-light pb-4">
            <p>
              © {new Date().getFullYear()} SPACEPOCKER Inc. All rights reserved.{' '}
              <a
                className="hover:text-primary ml-2 underline underline-offset-4"
                href="#"
              >
                Privacy Policy
              </a>
            </p>
          </footer>
        </div>
      </main>
    </>
  );
};

export default UsersPage;
