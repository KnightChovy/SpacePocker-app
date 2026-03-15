import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import { useLogout } from '@/hooks/auth/use-logout';
import { useAuthStore } from '@/stores/auth.store';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const user = useAuthStore(state => state.user);

  const getActiveItemFromPath = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/users')) return 'users';
    if (path.includes('/spaces')) return 'spaces';
    if (path.includes('/amenities')) return 'amenities';
    if (path.includes('/services')) return 'services';
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
          id: 'amenities',
          label: 'Amenities',
          path: '/admin/amenities',
          icon: 'checklist',
        },
        {
          id: 'services',
          label: 'Services',
          path: '/admin/services',
          icon: 'home_repair_service',
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

  const handleLogout = () => {
    const userId = user?.id;
    if (!userId) return;

    logoutMutation.mutate(userId, {
      onSuccess: () => {
        navigate('/');
      },
    });
  };

  const footerCards = [
    {
      renderCustom: () => (
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl h-12 px-4 border border-border-light dark:border-border-dark hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-200 dark:hover:border-red-900/30 text-text-sub-light dark:text-text-sub-dark hover:text-red-600 transition-all group"
        >
          <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">
            logout
          </span>
          <span className="text-sm font-bold">Log Out</span>
        </button>
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
