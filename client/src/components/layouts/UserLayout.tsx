import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import { LayoutDashboard, CalendarDays, Settings, LogOut } from 'lucide-react';
import { useLogout } from '@/hooks/auth/use-logout';
import { useAuthStore } from '@/stores/auth.store';

const UserLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const user = useAuthStore(state => state.user);

  const getActiveItemFromPath = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/bookings')) return 'bookings';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const currentActiveItem = getActiveItemFromPath();

  const handleLogout = () => {
    const userId = user?.id;
    if (!userId) return;

    logoutMutation.mutate(userId, {
      onSuccess: () => {
        navigate('/');
      },
    });
  };

  const menuSections = [
    {
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          path: '/user/dashboard',
          icon: <LayoutDashboard />,
        },
        {
          id: 'bookings',
          label: 'My Bookings',
          path: '/user/bookings',
          icon: <CalendarDays />,
        },
        {
          id: 'settings',
          label: 'Profile',
          path: '/user/settings',
          icon: <Settings />,
        },
      ],
    },
  ];

  const footerCards = [
    {
      renderCustom: () => (
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl h-12 px-4 border border-border-light dark:border-border-dark hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-200 dark:hover:border-red-900/30 text-text-sub-light dark:text-text-sub-dark hover:text-red-600 transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Log Out</span>
        </button>
      ),
      title: '',
      description: '',
    },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark transition-colors duration-300">
      <AppSidebar
        brandName="SPACEPOCKER"
        brandSubtitle="Rental Platform"
        brandIcon={
          <img src="/space-pocker.png" alt="Logo" className="w-8 h-6" />
        }
        brandIconBg="bg-primary dark:bg-primary/20"
        menuSections={menuSections}
        footerCards={footerCards}
        activeItemId={currentActiveItem}
        isOpen={sidebarOpen}
        onOpenChange={setSidebarOpen}
        iconType="lucide"
        activeLinkClassName="bg-primary text-white shadow-lg shadow-primary/30"
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Outlet context={{ setSidebarOpen }} />
      </main>
    </div>
  );
};

export default UserLayout;
