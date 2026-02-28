import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  X,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface MenuItem {
  label: string;
  to: string;
  icon: ReactNode;
}

interface ManagerSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MANAGER_MENU: MenuItem[] = [
  {
    label: 'Dashboard',
    to: '/manager',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: 'Schedule',
    to: '/manager/schedule',
    icon: <CalendarDays className="h-5 w-5" />,
  },
  { label: 'Rooms', to: '/manager/rooms', icon: <Users className="h-5 w-5" /> },
  {
    label: 'Bookings',
    to: '/manager/bookings',
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    label: 'Analytics',
    to: '/manager/analytics',
    icon: <Settings className="h-5 w-5" />,
  },
];

function getSidebarItemClasses(isActive: boolean) {
  const baseClass =
    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium';

  if (isActive) {
    return cn(
      baseClass,
      'bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-primary font-semibold'
    );
  }
  return cn(baseClass, 'text-slate-600 hover:bg-white hover:text-primary');
}

interface SidebarContentProps {
  onLinkClick: () => void;
}

function SidebarContent({ onLinkClick }: SidebarContentProps) {
  return (
    <ScrollArea className="h-full flex flex-col">
      <div className="flex flex-col h-full p-4">
        {/* Logo */}
        <div className="flex gap-3 px-2 py-4 mb-6">
          <div className="bg-primary aspect-square rounded-xl h-10 w-10 flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-slate-900 text-base font-bold leading-tight tracking-tight">
              SpacePocket
            </h1>
            <p className="text-slate-500 text-xs font-medium">Manager Portal</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {MANAGER_MENU.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onLinkClick}
              className={({ isActive }) => getSidebarItemClasses(isActive)}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}

          <div className="my-2 border-t border-border-light" />
        </nav>

        {/* Optimization Card */}
        <div className="mt-auto mb-4">
          <div className="bg-linear-to-br from-[#0e0d1b] to-[#1c1e31] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 right-0 h-24 w-24 bg-primary blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative z-10">
              <div className="bg-white/10 w-fit p-2 rounded-lg mb-3 backdrop-blur-sm">
                <Zap className="h-5 w-5 text-yellow-300" />
              </div>
              <h4 className="font-bold text-sm mb-1">Quick Optimization</h4>
              <p className="text-xs text-slate-300 mb-3">
                Optimize space usage with one click.
              </p>
              <span className="text-xs font-bold text-primary-light flex items-center gap-1 group-hover:gap-2 transition-all">
                Run Analysis <span className="text-sm">→</span>
              </span>
            </div>
          </div>
        </div>

        {/* Help Card */}
        <div className="bg-linear-to-br from-primary/10 to-primary/5 rounded-2xl p-4 border border-primary/10">
          <div className="flex items-start gap-3">
            <div className="bg-white p-2 rounded-lg shadow-sm text-primary">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Need Help?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Contact support for booking issues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

export default function ManagerSidebar({
  open,
  onOpenChange,
}: ManagerSidebarProps) {
  const handleLinkClick = () => onOpenChange(false);

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-72 p-0 [&>button]:hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-bold text-gray-900">Manager Portal</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <SidebarContent onLinkClick={handleLinkClick} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col bg-background-light border-r border-border-light h-full shrink-0">
        <SidebarContent onLinkClick={handleLinkClick} />
      </aside>
    </>
  );
}
