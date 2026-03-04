import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppSidebar from './AppSidebar';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getActiveItemFromPath = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/users')) return 'users';
    if (path.includes('/spaces')) return 'spaces';
    if (path.includes('/finance')) return 'finance';
    if (path.includes('/settings')) return 'settings';
    if (path.includes('/security')) return 'security';
    return 'dashboard';
  };

  const currentActiveItem = getActiveItemFromPath();

  const menuSections = [
    {
      title: 'Main Menu',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          path: '/admin/dashboard',
          icon: 'dashboard',
        },
        {
          id: 'users',
          label: 'Users',
          path: '/admin/users',
          icon: 'group',
        },
        {
          id: 'spaces',
          label: 'Spaces',
          path: '/admin/spaces',
          icon: 'apartment',
        },
        {
          id: 'finance',
          label: 'Finance',
          path: '/admin/finance',
          icon: 'payments',
        },
      ],
    },
    {
      title: 'System',
      items: [
        {
          id: 'settings',
          label: 'Settings',
          path: '/admin/settings',
          icon: 'settings',
        },
        {
          id: 'security',
          label: 'Security Logs',
          path: '/admin/security',
          icon: 'shield',
        },
      ],
    },
  ];

  const footerCards = [
    {
      renderCustom: () => (
        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-border-dark">
          <img
            src="https://picsum.photos/seed/marcus/100/100"
            alt="Admin"
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-gray-900 dark:text-text-main-dark truncate">
              Marcus Chen
            </div>
            <div className="text-xs text-gray-500 dark:text-text-sub-dark">
              Super Admin
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-text-main-dark transition-colors">
            <span className="material-symbols-outlined text-[20px]">
              more_vert
            </span>
          </button>
        </div>
      ),
      title: '',
      description: '',
    },
  ];

  return (
    <div className="flex h-screen bg-[#f8f9fc] overflow-hidden">
      <AppSidebar
        brandName="SPACEPOCKER"
        brandSubtitle="Admin Console"
        brandIcon={
          <span className="material-symbols-outlined text-2xl">
            rocket_launch
          </span>
        }
        brandIconBg="bg-indigo-600 shadow-indigo-200"
        menuSections={menuSections}
        footerCards={footerCards}
        activeItemId={currentActiveItem}
        isOpen={sidebarOpen}
        onOpenChange={setSidebarOpen}
        iconType="material"
        sidebarClassName="bg-white"
        activeLinkClassName="bg-indigo-50 text-indigo-600 font-semibold"
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Outlet context={{ setSidebarOpen }} />
      </div>
    </div>
  );
}
