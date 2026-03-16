import { useOutletContext, useNavigate } from 'react-router-dom';
import { USER_STATS, SPACESUSER } from '@/data/constant';
import { Calendar, BellRing, Plus } from 'lucide-react';
import AppHeader from '@/components/layouts/AppHeader';
import StatCard from '@/components/features/user/dashboard/StatCard';
import QuickActionButton from '@/components/features/user/dashboard/QuickActionButton';
import BookingList from '@/components/features/user/dashboard/BookingList';
import { useAuthStore } from '@/stores/auth.store';
import { getAvatarUrl } from '@/lib/utils';

const Dashboard = () => {
  const { setSidebarOpen } = useOutletContext<{
    setSidebarOpen: (open: boolean) => void;
  }>();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  const headerActions = [
    {
      id: 'notifications',
      icon: <BellRing />,
      badge: true,
      variant: 'ghost' as const,
    },
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
        title="Dashboard"
        hideTitle={false}
        onMenuClick={() => setSidebarOpen(true)}
        showSearch={true}
        searchPlaceholder="Search for spaces, bookings..."
        actions={headerActions}
        profile={{
          name: user?.name || 'User',
          subtitle: user?.role || 'USER',
          avatarUrl: getAvatarUrl(user?.name, 'User'),
          showDropdown: true,
        }}
      />
      <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-4 md:p-8 scroll-smooth">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text-main-light dark:text-text-main-dark mb-2">
                Welcome back, {user?.name?.split(' ')[0] || 'User'}{' '}
                <span className="inline-block animate-bounce">👋</span>
              </h1>
              <p className="text-text-sub-light dark:text-text-sub-dark text-base">
                Here's what's happening with your space rentals today.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-text-sub-light bg-surface-light dark:bg-surface-dark px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark shadow-sm">
              <span className=" text-primary text-[18px]">
                <Calendar />
              </span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <StatCard
              icon="event"
              title="Total Bookings"
              value={USER_STATS.totalBookings.toString()}
              trend="+12%"
              colorClass="blue"
            />
            <StatCard
              icon="timer"
              title="Hours Spent"
              value={USER_STATS.hoursSpent.toString()}
              colorClass="purple"
            />
            <StatCard
              icon="payments"
              title="Credits Available"
              value={`$${USER_STATS.credits.toFixed(2)}`}
              topUp
              colorClass="amber"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <BookingList />

            <div className="flex flex-col gap-6">
              <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 border border-primary/10 dark:border-primary/20">
                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <QuickActionButton
                    icon="location"
                    label="Book Again"
                    color="text-primary"
                  />
                  <QuickActionButton
                    icon="receipt"
                    label="Invoices"
                    color="text-purple-500"
                  />
                  <QuickActionButton
                    icon="star"
                    label="Saved"
                    color="text-amber-500"
                  />
                  <QuickActionButton
                    icon="map"
                    label="Browse Map"
                    color="text-teal-500"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Recommended for You</h3>
                <div className="flex flex-col gap-3">
                  {[SPACESUSER[3], SPACESUSER[4]].map((space, i) => (
                    <div
                      key={i}
                      className="group flex gap-3 p-3 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-primary/30 transition-all cursor-pointer"
                    >
                      <div
                        className="w-20 h-20 rounded-lg bg-cover bg-center shrink-0"
                        style={{ backgroundImage: `url('${space.image}')` }}
                      ></div>
                      <div className="flex flex-col justify-between py-1">
                        <div>
                          <h4 className="text-sm font-bold group-hover:text-primary transition-colors">
                            {space.name}
                          </h4>
                          <p className="text-xs text-text-sub-light dark:text-text-sub-dark">
                            {space.capacity} • Wifi • Projector
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold">
                            ${space.pricePerHour}
                          </span>
                          <span className="text-[10px] text-text-sub-light dark:text-text-sub-dark">
                            / hour
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
