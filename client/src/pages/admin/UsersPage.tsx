import React, { useState, useMemo } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import { RoleBadge, StatusBadge } from '../../components/admin/Badge';
import type { User } from '../../types/admin-types';
import usersData from '../../data/admin-users.json';

const INITIAL_USERS: User[] = usersData.users.map(user => ({
  ...user,
  role: user.role as 'Admin' | 'Host' | 'Guest',
  status: user.status as 'Active' | 'Idle' | 'Offline' | 'Suspended',
}));

const UsersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [users] = useState<User[]>(INITIAL_USERS);

  const filteredUsers = useMemo(() => {
    return users.filter(
      user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.handle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light">
      <Sidebar
        activeItem={activeTab}
        setActiveItem={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <header className="px-6 py-4 glass-panel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 h-auto sm:h-22 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-gray-500 hover:text-primary rounded-lg"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                User Management
              </h2>
              <p className="text-sm text-text-secondary-light hidden sm:block">
                Manage 2,451 registered users.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none flex items-center h-10 bg-white rounded-lg px-3 border border-gray-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all w-full sm:w-64 shadow-sm">
              <span className="material-symbols-outlined text-gray-400">
                search
              </span>
              <input
                className="bg-transparent border-none focus:ring-0 text-sm w-full text-gray-700 placeholder-gray-400 ml-2"
                placeholder="Search users..."
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 h-10 px-4 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
              <span className="material-symbols-outlined text-[18px] text-gray-500">
                filter_list
              </span>
              <span className="hidden lg:inline">Filters</span>
            </button>
            <button className="flex items-center justify-center shrink-0 h-10 w-10 sm:w-auto sm:px-4 bg-primary text-white rounded-lg shadow-lg shadow-primary/30 hover:bg-indigo-600 transition-all">
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span className="hidden sm:inline ml-2 text-sm font-semibold">
                Add User
              </span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pt-6 pb-8 px-4 md:px-8">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            <div className="bg-surface-light rounded-2xl shadow-float border border-gray-100 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2 text-sm text-text-secondary-light">
                  <span className="material-symbols-outlined text-[18px]">
                    info
                  </span>
                  <span>Showing {filteredUsers.length} users</span>
                </div>
                <div className="flex gap-2">
                  <select className="form-select bg-transparent text-sm border-gray-200 rounded-lg text-gray-600 focus:ring-0 focus:border-primary py-1 pl-2 pr-8 cursor-pointer">
                    <option>Sort by: Newest</option>
                    <option>Sort by: Oldest</option>
                    <option>Sort by: Last Active</option>
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
                    {filteredUsers.map(user => (
                      <tr
                        key={user.id}
                        className={`group hover:bg-gray-50 transition-colors ${user.status === 'Suspended' ? 'bg-red-50/30' : ''}`}
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
                              className={`size-10 rounded-full bg-cover bg-center border border-gray-200 ${user.status === 'Suspended' ? 'grayscale' : ''}`}
                              style={{
                                backgroundImage: `url(${user.avatarUrl})`,
                              }}
                            />
                            <div className="flex flex-col">
                              <span
                                className={`font-semibold text-sm ${user.isRestricted ? 'text-gray-500 line-through decoration-red-400' : 'text-gray-900'}`}
                              >
                                {user.name}
                              </span>
                              <span
                                className={`text-xs ${user.isRestricted ? 'text-red-400 font-medium' : 'text-text-secondary-light'}`}
                              >
                                {user.handle}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td
                          className={`py-4 px-4 text-sm ${user.isRestricted ? 'text-gray-500' : 'text-gray-600'}`}
                        >
                          {user.email}
                        </td>
                        <td className="py-4 px-4">
                          <RoleBadge type={user.role} />
                        </td>
                        <td className="py-4 px-4">
                          <StatusBadge type={user.status} />
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-500 font-mono">
                          {user.lastLogin}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-100 transition-all">
                            <span className="material-symbols-outlined">
                              more_vert
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-500">
                  Showing page{' '}
                  <span className="font-medium text-gray-900">1</span> of{' '}
                  <span className="font-medium text-gray-900">245</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    disabled
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
                © {new Date().getFullYear()} SPACEPOCKER Inc. All rights
                reserved.{' '}
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
      </div>
    </div>
  );
};

export default UsersPage;
