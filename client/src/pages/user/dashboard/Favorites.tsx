import { useOutletContext, useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layouts/AppHeader';
import BookingList from '@/components/features/user/favorites/BookingList';
import BookingNotificationsBell from '@/components/features/user/dashboard/BookingNotificationsBell';
import { ArrowLeftRight, Shuffle, Plus } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { getAvatarUrl } from '@/lib/utils';

const Favorites = () => {
  const { setSidebarOpen } = useOutletContext<{
    setSidebarOpen: (open: boolean) => void;
  }>();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  const headerActions = [
    {
      id: 'new-booking',
      icon: <Plus className="w-5 h-5" />,
      label: 'New Booking',
      variant: 'primary' as const,
      hideOnMobile: true,
      onClick: () => navigate('/spaces'),
    },
  ];

  return (
    <>
      <AppHeader
        title="Favorites Collection"
        subtitle="You have saved 6 spaces. Select to compare."
        hideTitle={false}
        onMenuClick={() => setSidebarOpen(true)}
        showSearch={false}
        actions={headerActions}
        rightExtra={<BookingNotificationsBell />}
        profile={{
          name: user?.name || 'User',
          subtitle: user?.role || 'USER',
          avatarUrl: getAvatarUrl(user?.name, 'User'),
          showDropdown: true,
        }}
      />
      <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-4 md:p-8 scroll-smooth">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-end items-start md:items-end gap-6 animate-fade-in-up border-b border-border-light dark:border-border-dark pb-6">
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-sub-light dark:text-text-sub-dark hover:bg-background-light dark:hover:bg-background-dark hover:text-primary transition-all">
                <Shuffle className="h-5 w-5" />
                <span className="text-sm font-bold hidden sm:inline">
                  Filter
                </span>
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary/60 transition-all active:scale-95 group">
                <ArrowLeftRight className="h-5 w-5 transition-transform" />
                <span className="text-sm font-bold">
                  Compare Selected (0/3)
                </span>
              </button>
            </div>
          </div>

          <BookingList />
        </div>
      </div>
    </>
  );
};

export default Favorites;
