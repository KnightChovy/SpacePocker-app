import React from 'react';
import NotificationRow from '@/components/userDashboard/settings/NotificationRow';
import PersonalInfoSection from '@/components/userDashboard/settings/PersonalInfoSection';
import AccountSecuritySection from '@/components/userDashboard/settings/AccountSecuritySection';
import { Save } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="p-4 md:p-8 scroll-smooth pb-24 relative">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">
            Profile Settings
          </h1>
          <p className="text-text-sub-light dark:text-text-sub-dark text-base">
            Manage your personal information, security preferences and
            notifications.
          </p>
        </div>

        <PersonalInfoSection />

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
      </div>

      <div className="fixed bottom-6 right-8 z-50">
        <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-300 font-bold">
          <Save className="h-5 w-5" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
