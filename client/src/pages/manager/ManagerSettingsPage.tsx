import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import AppHeader from '@/components/layouts/AppHeader';
import settingsData from '@/data/admin-settings.json';
import { useAuthStore } from '@/stores/auth.store';
import { getAvatarUrl } from '@/lib/utils';

const ManagerSettingsPage: React.FC = () => {
  const { setSidebarOpen } = useOutletContext<{
    setSidebarOpen: (open: boolean) => void;
  }>();
  const user = useAuthStore(state => state.user);

  const [settings, setSettings] = useState({
    ...settingsData.defaultSettings,
    siteEmail: user?.email || settingsData.defaultSettings.siteEmail,
  });

  const headerActions = [
    {
      id: 'save',
      icon: <span className="material-symbols-outlined text-[20px]">save</span>,
      label: 'Save Changes',
      variant: 'primary' as const,
    },
  ];

  const handleSettingChange = (
    key: string,
    value: string | boolean | number
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <AppHeader
        title="System Settings"
        subtitle="Manage application configuration and preferences."
        onMenuClick={() => setSidebarOpen(true)}
        actions={headerActions}
        profile={{
          name: user?.name || 'Manager',
          subtitle: user?.role || 'MANAGER',
          avatarUrl: getAvatarUrl(user?.name, 'Manager'),
          showDropdown: true,
        }}
        iconType="material"
      />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8">
        {/* Manager Profile Section */}
        <div className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-3xl border border-indigo-200 shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex items-center gap-6">
              <div
                className="h-20 w-20 rounded-full bg-cover bg-center border-4 border-white shadow-lg"
                style={{
                  backgroundImage: `url('${getAvatarUrl(user?.name, 'Manager')}')`,
                }}
              ></div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white">
                  {user?.name || 'Manager'}
                </h3>
                <p className="text-indigo-100 mt-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">
                    mail
                  </span>
                  {user?.email || 'manager@spacepocker.com'}
                </p>
                <p className="text-indigo-100 mt-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">
                    phone
                  </span>
                  {user?.phone || 'Not provided'}
                </p>
              </div>
              <div className="px-5 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <span className="text-sm font-bold text-white uppercase tracking-wider">
                  {user?.role || 'MANAGER'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-100">
                <span className="material-symbols-outlined text-indigo-600 text-xl">
                  settings
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  General Settings
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Basic application configuration
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={e =>
                    handleSettingChange('siteName', e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Manager Email
                </label>
                <input
                  type="email"
                  value={user?.email || settings.siteEmail}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={settings.currency}
                  onChange={e =>
                    handleSettingChange('currency', e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                >
                  <option value="VND">VND - Vietnamese Dong</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={e =>
                    handleSettingChange('timezone', e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                >
                  <option value="UTC-5">UTC-5 (EST)</option>
                  <option value="UTC+0">UTC+0 (GMT)</option>
                  <option value="UTC+7">UTC+7 (ICT)</option>
                  <option value="UTC+8">UTC+8 (SGT)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-100">
                <span className="material-symbols-outlined text-purple-600 text-xl">
                  tune
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Space Management Controls
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Manage space-related settings
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-semibold text-gray-900">
                  Allow New Registrations
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Enable new users to sign up
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowNewRegistrations}
                  onChange={e =>
                    handleSettingChange(
                      'allowNewRegistrations',
                      e.target.checked
                    )
                  }
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-semibold text-gray-900">
                  Require Email Verification
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Users must verify email before accessing features
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.requireEmailVerification}
                  onChange={e =>
                    handleSettingChange(
                      'requireEmailVerification',
                      e.target.checked
                    )
                  }
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-semibold text-gray-900">
                  Enable Notifications
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Send email notifications for important events
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableNotifications}
                  onChange={e =>
                    handleSettingChange('enableNotifications', e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-semibold text-gray-900">
                  Auto-Approve Bookings
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Automatically approve booking requests
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoApproveSpaces}
                  onChange={e =>
                    handleSettingChange('autoApproveSpaces', e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100">
                <span className="material-symbols-outlined text-emerald-600 text-xl">
                  account_balance
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Financial Settings
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Configure payment and commission rates
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Platform Commission Rate (%)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={settings.commissionRate}
                  onChange={e =>
                    handleSettingChange(
                      'commissionRate',
                      parseInt(e.target.value)
                    )
                  }
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex items-center justify-center w-16 h-12 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <span className="text-lg font-bold text-indigo-600">
                    {settings.commissionRate}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Current rate: Platform earns {settings.commissionRate}%
                commission on each booking
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Reset Changes
          </button>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">save</span>
            Save Settings
          </button>
        </div>
      </main>
    </>
  );
};

export default ManagerSettingsPage;
