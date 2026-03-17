import { useOutletContext, useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layouts/AppHeader';
import BookingNotificationsBell from '@/components/features/user/dashboard/BookingNotificationsBell';
import { Landmark, Plus } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { getAvatarUrl } from '@/lib/utils';

const Billings = () => {
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
        title="Billing & Invoices"
        subtitle="This section is currently under construction."
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
      <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-8 flex flex-col items-center justify-center text-center">
        <Landmark className="w-16 h-16 text-text-sub-light mb-4" />
        <h1 className="text-2xl font-bold mb-2">Billing & Invoices</h1>
        <p className="text-text-sub-light">
          This section is currently under construction.
        </p>
      </div>
    </>
  );
};

export default Billings;
