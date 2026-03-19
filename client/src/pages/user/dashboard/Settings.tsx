import React, { useMemo, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layouts/AppHeader';
import { useAuthStore } from '@/stores/auth.store';
import { getAvatarUrl } from '@/lib/utils';
import PersonalInfoSection from '@/components/features/user/settings/PersonalInfoSection';
import AccountSecuritySection from '@/components/features/user/settings/AccountSecuritySection';
import BookingNotificationsBell from '@/components/features/user/dashboard/BookingNotificationsBell';
import { Save, Plus } from 'lucide-react';
import { useGetUserProfile } from '@/hooks/user/profile/use-get-user-profile';
import { useUpdateUserProfile } from '@/hooks/user/profile/use-update-user-profile';
import type { UserRole } from '@/types/auth/auth-type';

const Settings: React.FC = () => {
  const { setSidebarOpen } = useOutletContext<{
    setSidebarOpen: (open: boolean) => void;
  }>();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);
  const profileQuery = useGetUserProfile();
  const updateProfile = useUpdateUserProfile();

  const [draft, setDraft] = useState<{ name?: string; phone?: string }>({});

  const baseProfile = useMemo(
    () => ({
      id: profileQuery.data?.id ?? user?.id ?? '',
      name: profileQuery.data?.name ?? user?.name ?? '',
      email: profileQuery.data?.email ?? user?.email ?? '',
      phone: profileQuery.data?.phoneNumber ?? user?.phone ?? '',
      role: (profileQuery.data?.role ?? user?.role ?? '') as UserRole | '',
    }),
    [
      profileQuery.data?.email,
      profileQuery.data?.id,
      profileQuery.data?.name,
      profileQuery.data?.phoneNumber,
      profileQuery.data?.role,
      user?.email,
      user?.id,
      user?.name,
      user?.phone,
      user?.role,
    ]
  );

  const form = useMemo(
    () => ({
      name: draft.name ?? baseProfile.name,
      email: baseProfile.email,
      phone: draft.phone ?? baseProfile.phone,
      role: baseProfile.role,
    }),
    [
      baseProfile.email,
      baseProfile.name,
      baseProfile.phone,
      baseProfile.role,
      draft.name,
      draft.phone,
    ]
  );

  const hasChanged = useMemo(() => {
    const baselineName = baseProfile.name;
    const baselinePhone = baseProfile.phone;

    return (
      form.name.trim() !== baselineName.trim() ||
      form.phone.trim() !== baselinePhone.trim()
    );
  }, [baseProfile.name, baseProfile.phone, form.name, form.phone]);

  const isSaving = updateProfile.isPending;

  const handleSaveChanges = async () => {
    const nextName = form.name.trim();
    const nextPhone = form.phone.trim();

    if (!nextName) {
      return;
    }

    const updatedProfile = await updateProfile.mutateAsync({
      name: nextName,
      phoneNumber: nextPhone === '' ? null : nextPhone,
    });

    setUser({
      id: updatedProfile.id,
      name: updatedProfile.name,
      email: updatedProfile.email,
      phone: updatedProfile.phoneNumber ?? '',
      role: updatedProfile.role,
    });

    setDraft({});
  };

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
        title="Profile Settings"
        subtitle="Manage your personal information, security preferences and notifications."
        hideTitle={false}
        onMenuClick={() => setSidebarOpen(true)}
        showSearch={false}
        actions={headerActions}
        rightExtra={<BookingNotificationsBell />}
        profile={{
          name: baseProfile.name || 'User',
          subtitle: baseProfile.role || 'USER',
          avatarUrl: getAvatarUrl(baseProfile.name, 'User'),
          showDropdown: true,
        }}
      />
      <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-4 md:p-8 scroll-smooth pb-24 relative">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <PersonalInfoSection
            name={form.name}
            email={form.email}
            phone={form.phone}
            role={form.role}
            onNameChange={value => setDraft(prev => ({ ...prev, name: value }))}
            onPhoneChange={value =>
              setDraft(prev => ({ ...prev, phone: value }))
            }
          />

          <AccountSecuritySection />

          <div className="fixed bottom-6 right-8 z-50">
            <button
              onClick={handleSaveChanges}
              disabled={!hasChanged || isSaving || !form.name.trim()}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-300 font-bold"
            >
              <Save className="h-5 w-5" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
