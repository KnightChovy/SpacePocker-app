import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layouts/AppHeader';
import NotificationRow from '@/components/features/user/settings/NotificationRow';
import { useAuthStore } from '@/stores/auth.store';
import { getAvatarUrl } from '@/lib/utils';
import PersonalInfoSection from '@/components/features/user/settings/PersonalInfoSection';
import AccountSecuritySection from '@/components/features/user/settings/AccountSecuritySection';
import { Save, BellRing, Plus } from 'lucide-react';

const Settings: React.FC = () => {
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
        title="Profile Settings"
        subtitle="Manage your personal information, security preferences and notifications."
        hideTitle={false}
        onMenuClick={() => setSidebarOpen(true)}
        showSearch={false}
        actions={headerActions}
        profile={{
          name: user?.name || 'User',
          subtitle: user?.role || 'USER',
          avatarUrl: getAvatarUrl(user?.name, 'User'),
          showDropdown: true,
        }}
      />
      <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-4 md:p-8 scroll-smooth pb-24 relative">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <PersonalInfoSection user={user} />

          <AccountSecuritySection />

          <section className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm">
            <div className="p-6 border-b border-border-light dark:border-border-dark">
              <h2 className="text-lg font-bold">Notifications</h2>
              <p className="text-sm text-text-sub-light dark:text-text-sub-dark mt-1">
                Choose what we can contact you about.
              </p>
            </div>
            <div className="p-6 md:p-8 flex flex-col gap-6">
              <NotificationRow
                title="Booking Reminders"
                desc="Receive notifications for upcoming bookings."
                options={['Email', 'SMS']}
                checked={['Email', 'SMS']}
              />
              <NotificationRow
                title="Promotions and Offers"
                desc="Receive emails about new features and special offers."
                options={['Email']}
              />
              <NotificationRow
                title="Security Alerts"
                desc="Get notified about suspicious logins."
                options={['Always On']}
                disabled
              />
            </div>
          </section>

          <div className="fixed bottom-6 right-8 z-50">
            <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-300 font-bold">
              <Save className="h-5 w-5" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
