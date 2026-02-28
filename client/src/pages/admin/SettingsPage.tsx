import React, { useState } from 'react';
import Sidebar from '@/components/features/admin/Sidebar';
import Header from '@/components/features/admin/Header';
import settingsData from '@/data/admin-settings.json';

const SettingsPage: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('settings');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [settings, setSettings] = useState(settingsData.defaultSettings);

  const handleSettingChange = (
    key: string,
    value: string | boolean | number
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex h-screen bg-[#f8f9fc] overflow-hidden">
      <Sidebar
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title="System Settings"
          subtitle="Manage application configuration and preferences."
        />
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8">
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
                    Admin Email
                  </label>
                  <input
                    type="email"
                    value={settings.siteEmail}
                    onChange={e =>
                      handleSettingChange('siteEmail', e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
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
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
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
                    Platform Controls
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Manage user access and features
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-semibold text-gray-900">
                    Maintenance Mode
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Temporarily disable site access for maintenance
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={e =>
                      handleSettingChange('maintenanceMode', e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

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
                      handleSettingChange(
                        'enableNotifications',
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    Auto-Approve Spaces
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Automatically approve new space listings
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
              <span className="material-symbols-outlined text-[18px]">
                save
              </span>
              Save Settings
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
