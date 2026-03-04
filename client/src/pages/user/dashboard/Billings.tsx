import { useOutletContext } from 'react-router-dom';
import { USER_INFO } from '@/data/constant';
import AppHeader from '@/components/layouts/AppHeader';
import { Landmark, BellRing, Plus } from 'lucide-react';

const Billings = () => {
  const { setSidebarOpen } = useOutletContext<{
    setSidebarOpen: (open: boolean) => void;
  }>();

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
        profile={{
          name: USER_INFO.shortName,
          subtitle: USER_INFO.plan,
          avatarUrl: USER_INFO.profileImage,
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
