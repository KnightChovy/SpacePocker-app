import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ManagerSidebar from './ManagerSidebar';
import ManagerHeader from './ManagerHeader';

interface ManagerLayoutProps {
  title?: string;
}

export default function ManagerLayout({
  title = 'Dashboard',
}: ManagerLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background-light overflow-hidden">
      <ManagerSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        <ManagerHeader title={title} onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
