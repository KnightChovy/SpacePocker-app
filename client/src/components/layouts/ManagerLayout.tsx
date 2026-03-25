import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  BarChart3,
  Building2,
  UserCircle,
  Tags,
  LogOut,
} from 'lucide-react';
import { useLogout } from '@/hooks/auth/use-logout';
import { useAuthStore } from '@/stores/auth.store';

export default function ManagerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const user = useAuthStore(state => state.user);

  const menuSections = [
    {
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          path: '/manager/dashboard',
          icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
          id: 'schedule',
          label: 'Schedule',
          path: '/manager/schedule',
          icon: <CalendarDays className="h-5 w-5" />,
        },
        {
          id: 'rooms',
          label: 'Rooms',
          path: '/manager/rooms',
          icon: <Users className="h-5 w-5" />,
        },
        {
          id: 'bookings',
          label: 'Bookings',
          path: '/manager/bookings',
          icon: <BarChart3 className="h-5 w-5" />,
        },
        {
          id: 'buildings',
          label: 'Buildings',
          path: '/manager/buildings',
          icon: <Building2 className="h-5 w-5" />,
        },
        {
          id: 'service-categories',
          label: 'Service Categories',
          path: '/manager/service-categories',
          icon: <Tags className="h-5 w-5" />,
        },
        {
          id: 'profile',
          label: 'Profile',
          path: '/manager/profile',
          icon: <UserCircle className="h-5 w-5" />,
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
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Log Out</span>
        </button>
      ),
      title: '',
      description: '',
    },
  ];

  return (
    <div className="flex h-screen w-full bg-background-light overflow-hidden">
      <AppSidebar
        brandName="SpacePocket"
        brandSubtitle="Manager Portal"
        brandIcon={<LayoutDashboard className="h-5 w-5" />}
        brandIconBg="bg-primary"
        menuSections={menuSections}
        footerCards={footerCards}
        isOpen={sidebarOpen}
        onOpenChange={setSidebarOpen}
        iconType="lucide"
      />
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        <Outlet context={{ setSidebarOpen }} />
      </main>
    </div>
  );
}
