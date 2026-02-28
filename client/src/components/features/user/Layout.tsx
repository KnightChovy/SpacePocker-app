import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { USER_INFO } from '@/data/constant';
import {
  BellRing,
  Bookmark,
  CalendarDays,
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/user/dashboard') return 'Dashboard';
    if (path === '/user/bookings') return 'My Bookings';
    if (path === '/user/favorites') return 'Favorites';
    if (path === '/user/settings') return 'Settings';
    return 'Rental Platform';
  };

  const navItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/user/dashboard' },
    { name: 'My Bookings', icon: 'calendar_month', path: '/user/bookings' },
    { name: 'Favorites', icon: 'favorite', path: '/user/favorites' },
    { name: 'Billing', icon: 'credit_card', path: '/user/billing' },
    { name: 'Settings', icon: 'settings', path: '/user/settings' },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark transition-colors duration-300">
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-70 flex flex-col border-r border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      >
        <div className="flex flex-col h-full p-6 justify-between">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <div className="bg-primary dark:bg-primary/20 p-2 rounded-xl">
                <span className=" text-primary text-2xl">
                  <img src="/space-pocker.png" alt="Logo" className="w-8 h-6" />
                </span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold tracking-tight">
                  SPACEPOCKER
                </h1>
                <p className="text-text-sub-light dark:text-text-sub-dark text-xs font-medium">
                  Rental Platform
                </p>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              {navItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                    ${
                      isActive
                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                        : 'text-text-sub-light dark:text-text-sub-dark hover:bg-background-light dark:hover:bg-background-dark/50 hover:text-primary'
                    }
                  `}
                >
                  <span
                    className={` text-[20px] transition-transform ${location.pathname !== item.path ? 'group-hover:scale-110' : ''}`}
                  >
                    {item.icon === 'dashboard' && <LayoutDashboard />}
                    {item.icon === 'calendar_month' && <CalendarDays />}
                    {item.icon === 'favorite' && <Bookmark />}
                    {item.icon === 'credit_card' && <CreditCard />}
                    {item.icon === 'settings' && <Settings />}
                  </span>
                  <span className="text-sm font-semibold">{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <div>
            <div className="bg-background-light dark:bg-background-dark rounded-xl p-4 mb-4 border border-border-light dark:border-border-dark">
              <div className="flex items-center gap-3 mb-2">
                <p className="text-sm font-semibold">Need Help?</p>
              </div>
              <p className="text-xs text-text-sub-light dark:text-text-sub-dark mb-3 leading-relaxed">
                Contact our support team for any booking issues.
              </p>
              <button className="text-xs font-bold text-primary hover:text-primary-dark transition-colors">
                Contact Support
              </button>
            </div>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl h-12 px-4 border border-border-light dark:border-border-dark hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-200 dark:hover:border-red-900/30 text-text-sub-light dark:text-text-sub-dark hover:text-red-600 transition-all group">
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold">Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 glass-effect border-b border-border-light dark:border-border-dark transition-colors shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="text-text-main-light dark:text-text-main-dark lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu />
            </button>
            <h2 className="text-lg font-bold lg:hidden">{getPageTitle()}</h2>

            <div className="hidden lg:flex flex-1 max-w-md ml-0">
              <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub-light/60 dark:text-text-sub-dark group-focus-within:text-primary transition-colors" />
                </div>
                <Input
                  className="w-full h-11 pl-11 pr-4 rounded-xl bg-background-light dark:bg-background-dark border-none focus:ring-2 focus:ring-primary/50 text-sm transition-all placeholder:text-text-sub-light/60"
                  placeholder="Search for spaces, bookings..."
                  type="text"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button className="relative p-2 rounded-full hover:bg-background-light dark:hover:bg-surface-dark transition-colors text-text-sub-light dark:text-text-sub-dark">
              <BellRing />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-surface-light dark:border-surface-dark"></span>
            </button>

            <button className="hidden sm:flex h-10 items-center gap-2 px-5 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-95">
              <Plus className="w-5 h-5" />
              <span>New Booking</span>
            </button>

            <div className="h-8 w-px bg-border-light dark:bg-border-dark hidden sm:block"></div>

            <button className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full hover:bg-background-light dark:hover:bg-surface-dark transition-colors border border-transparent hover:border-border-light dark:hover:border-border-dark">
              <div
                className="h-9 w-9 rounded-full bg-cover bg-center border border-border-light dark:border-border-dark"
                style={{ backgroundImage: `url('${USER_INFO.profileImage}')` }}
              ></div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-xs font-bold">{USER_INFO.shortName}</span>
                <span className="text-[10px] text-text-sub-light dark:text-text-sub-dark">
                  {USER_INFO.plan}
                </span>
              </div>
              <ChevronDown />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
