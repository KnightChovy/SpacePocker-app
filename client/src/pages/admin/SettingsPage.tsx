import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import AppHeader from '@/components/layouts/AppHeader';
import settingsData from '@/data/admin-settings.json';
import { useAuthStore } from '@/stores/auth.store';
import { getAvatarUrl } from '@/lib/utils';

const SettingsPage: React.FC = () => {
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
          name: user?.name || 'Admin',
          subtitle: user?.role || 'ADMIN',
          avatarUrl: getAvatarUrl(user?.name, 'Admin'),
          showDropdown: true,
        }}
        iconType="material"
      />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8">
        {/* Admin Profile Section */}
        <div className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-3xl border border-indigo-200 shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex items-center gap-6">
              <div
                className="h-20 w-20 rounded-full bg-cover bg-center border-4 border-white shadow-lg"
                style={{
                  backgroundImage: `url('${getAvatarUrl(user?.name, 'Admin')}')`,
                }}
              ></div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white">
                  {user?.name || 'Administrator'}
                </h3>
                <p className="text-indigo-100 mt-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">
                    mail
                  </span>
                  {user?.email || 'admin@spacepocker.com'}
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
                  {user?.role || 'ADMIN'}
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
                  disabled
                  onChange={e =>
                    handleSettingChange('siteName', e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={settings.siteEmail}
                  disabled
                  onChange={e =>
                    handleSettingChange('siteEmail', e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
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

export default SettingsPage;
