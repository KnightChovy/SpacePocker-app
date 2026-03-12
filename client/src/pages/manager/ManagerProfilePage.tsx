import React from 'react';
import { useOutletContext } from 'react-router-dom';
import AppHeader from '@/components/layouts/AppHeader';
import { useAuthStore } from '@/stores/auth.store';
import { getAvatarUrl } from '@/lib/utils';
import { Save, Pencil, Mail, Phone, Shield } from 'lucide-react';

const ManagerProfilePage: React.FC = () => {
  const { setSidebarOpen } = useOutletContext<{
    setSidebarOpen: (open: boolean) => void;
  }>();
  const user = useAuthStore(state => state.user);

  const headerActions = [
    {
      id: 'save',
      icon: <Save className="h-5 w-5" />,
      label: 'Save Changes',
      variant: 'primary' as const,
    },
  ];

  return (
    <>
      <AppHeader
        title="Profile"
        subtitle="Manage your personal information and account settings."
        onMenuClick={() => setSidebarOpen(true)}
        actions={headerActions}
        profile={{
          name: user?.name || 'Manager',
          subtitle: user?.role || 'MANAGER',
          avatarUrl: getAvatarUrl(user?.name, 'Manager'),
          showDropdown: true,
        }}
      />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8">
        {/* Manager Profile Header */}
        <div className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-3xl border border-indigo-200 shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <div
                  className="h-24 w-24 rounded-full bg-cover bg-center border-4 border-white shadow-lg"
                  style={{
                    backgroundImage: `url('${getAvatarUrl(user?.name, 'Manager')}')`,
                  }}
                ></div>
                <button className="absolute bottom-0 right-0 bg-white hover:bg-gray-50 text-indigo-600 p-2 rounded-full border-2 border-white transition-colors shadow-md">
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-white">
                  {user?.name || 'Manager'}
                </h3>
                <p className="text-indigo-100 mt-2 flex items-center justify-center md:justify-start gap-2">
                  <Mail className="h-4 w-4" />
                  {user?.email || 'manager@spacepocker.com'}
                </p>
                <p className="text-indigo-100 mt-1 flex items-center justify-center md:justify-start gap-2">
                  <Phone className="h-4 w-4" />
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

        {/* Personal Information */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-100">
                <span className="material-symbols-outlined text-indigo-600 text-xl">
                  person
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Personal Information
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Update your personal details and contact information
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={user?.name || ''}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue={user?.email || ''}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  defaultValue={user?.phone || ''}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={user?.role || 'MANAGER'}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100">
                <Shield className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Account Security
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Manage your password and security settings
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-800">
                <strong>Security Tip:</strong> Use a strong password with at
                least 8 characters, including uppercase, lowercase, numbers, and
                special characters.
              </p>
            </div>
          </div>
        </div>

        {/* Preferences */}
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
                  Notification Preferences
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Choose how you want to be notified
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-semibold text-gray-900">
                  Email Notifications
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Receive booking updates via email
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-semibold text-gray-900">SMS Notifications</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Get text messages for urgent updates
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-14 h-7 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-semibold text-gray-900">Weekly Reports</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Receive weekly performance summaries
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </main>
    </>
  );
};

export default ManagerProfilePage;
