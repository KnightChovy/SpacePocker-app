import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuthStore } from '@/stores/auth.store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { User, LogOut, LayoutDashboard, Bell } from 'lucide-react';
import { useLogout } from '@/hooks/auth/use-logout';
import { getAvatarUrl } from '@/lib/utils';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const { user } = useAuthStore();

  const logoutMutation = useLogout();

  const handleLogout = () => {
    const userId = user?.id;
    if (!userId) return;
    logoutMutation.mutate(userId);
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'MANAGER':
        return '/manager/dashboard';
      case 'USER':
      default:
        return '/user/dashboard';
    }
  };

  const getProfilePath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'ADMIN':
        return '/admin/settings';
      case 'MANAGER':
        return '/manager/profile';
      case 'USER':
      default:
        return '/user/settings';
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'nav-blur border-b py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-between">
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div
            className={`h-8 w-8 rounded-lg flex items-center justify-center shadow-lg transition-colors ${
              scrolled
                ? 'bg-primary shadow-primary/20'
                : 'bg-white/20 backdrop-blur-sm shadow-white/20'
            }`}
          >
            <img src="/logomautrang.png" alt="Logo" className="h-6 w-8" />
          </div>
          <span
            className={`text-xl font-extrabold tracking-tight transition-colors ${
              scrolled ? 'text-secondary' : 'text-white'
            }`}
          >
            SPACEPOCKER
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Find a Space', href: '/spaces' },
            { label: 'List your Space', href: '/user/bookings' },
            { label: 'About Us', href: '/about' },
          ].map(item => (
            <a
              key={item.label}
              href={item.href}
              className={`text-sm font-semibold transition-colors ${
                scrolled
                  ? 'text-slate-600 hover:text-primary'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        {!user ? (
          <div className="flex items-center gap-4">
            <button
              className={`text-sm font-semibold transition-colors cursor-pointer ${
                scrolled
                  ? 'text-slate-600 hover:text-primary'
                  : 'text-white/90 hover:text-white'
              }`}
              onClick={() => navigate('/auth-login')}
            >
              Log In
            </button>
            <Button
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95 shadow-lg cursor-pointer ${
                scrolled
                  ? 'bg-primary text-white shadow-primary/20 hover:bg-indigo-700'
                  : 'bg-white text-primary shadow-white/20 hover:bg-white/90'
              }`}
              onClick={() => navigate('/auth-register')}
            >
              Get Started
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <Bell
              className={`h-5 w-5 transition-colors cursor-pointer ${
                scrolled ? 'text-slate-600' : 'text-white/90'
              }`}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`h-10 w-10 rounded-full flex items-center justify-center overflow-hidden transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 cursor-pointer ${
                    scrolled
                      ? 'focus:ring-primary border-primary/20'
                      : 'focus:ring-white border-white/30'
                  }`}
                >
                  <img
                    src={getAvatarUrl(user?.name)}
                    alt={user?.name || 'User'}
                    className="h-full w-full object-cover"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(getDashboardPath())}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(getProfilePath())}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} variant="destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
