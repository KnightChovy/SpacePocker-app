import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  BarChart3,
  Building2,
  Settings,
  HelpCircle,
  Zap,
} from 'lucide-react';

export default function ManagerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          id: 'analytics',
          label: 'Analytics',
          path: '/manager/analytics',
          icon: <Settings className="h-5 w-5" />,
        },
      ],
    },
  ];

  const footerCards = [
    {
      title: 'Quick Optimization',
      description: 'Optimize space usage with one click.',
      buttonText: 'Run Analysis',
      icon: <Zap className="h-5 w-5 text-yellow-300" />,
      variant: 'action' as const,
    },
    {
      title: 'Need Help?',
      description: 'Contact support for booking issues.',
      icon: <HelpCircle className="h-5 w-5" />,
      variant: 'help' as const,
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
