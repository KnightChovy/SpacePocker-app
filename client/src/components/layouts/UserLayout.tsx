import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import {
  LayoutDashboard,
  CalendarDays,
  Bookmark,
  CreditCard,
  Settings,
  LogOut,
} from 'lucide-react';

const UserLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getActiveItemFromPath = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/bookings')) return 'bookings';
    if (path.includes('/favorites')) return 'favorites';
    if (path.includes('/billing')) return 'billing';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const currentActiveItem = getActiveItemFromPath();

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
          id: 'favorites',
          label: 'Favorites',
          path: '/user/favorites',
          icon: <Bookmark />,
        },
        {
          id: 'billing',
          label: 'Billing',
          path: '/user/billing',
          icon: <CreditCard />,
        },
        {
          id: 'settings',
          label: 'Settings',
          path: '/user/settings',
          icon: <Settings />,
        },
      ],
    },
  ];

  const footerCards = [
    {
      title: 'Need Help?',
      description: 'Contact our support team for any booking issues.',
      buttonText: 'Contact Support',
      variant: 'help' as const,
    },
    {
      renderCustom: () => (
        <button className="flex w-full items-center justify-center gap-2 rounded-xl h-12 px-4 border border-border-light dark:border-border-dark hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-200 dark:hover:border-red-900/30 text-text-sub-light dark:text-text-sub-dark hover:text-red-600 transition-all group">
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