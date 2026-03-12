import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import AppHeader from '@/components/layouts/AppHeader';
import StatsSection from '@/components/features/admin/StatsSection';
import InventoryTable from '@/components/features/admin/InventoryTable';
import type { Space, InventoryStats } from '@/types/admin-types';
import spacesData from '@/data/admin-spaces.json';
import { useAuthStore } from '@/stores/auth.store';
import { getAvatarUrl } from '@/lib/utils';

const MOCK_SPACES: Space[] = spacesData.spaces.map(space => ({
  ...space,
  category: space.category as
    | 'Meeting Room'
    | 'Classroom'
    | 'Office'
    | 'Storage',
  status: space.status as 'Approved' | 'Pending Review' | 'Rejected',
  priceUnit: space.priceUnit as 'hr' | 'day',
}));

const SpacesPage: React.FC = () => {
  const { setSidebarOpen } = useOutletContext<{
    setSidebarOpen: (open: boolean) => void;
  }>();
  const user = useAuthStore(state => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Categories');
  const [pendingOnly, setPendingOnly] = useState(false);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);

  const headerActions = [
    {
      id: 'filter',
      icon: (
        <span className="material-symbols-outlined text-[18px]">
          filter_list
        </span>
      ),
      label: pendingOnly ? 'Pending Only' : 'All Spaces',
      variant: (pendingOnly ? 'primary' : 'ghost') as 'primary' | 'ghost',
      onClick: () => setPendingOnly(!pendingOnly),
    },
    {
      id: 'add-space',
      icon: <span className="material-symbols-outlined text-[20px]">add</span>,
      label: 'Add Space',
      variant: 'primary' as const,
    },
  ];

  const stats: InventoryStats = useMemo(() => {
    return {
      total: MOCK_SPACES.length,
      pending: MOCK_SPACES.filter(s => s.status === 'Pending Review').length,
      approved: MOCK_SPACES.filter(s => s.status === 'Approved').length,
      rejected: MOCK_SPACES.filter(s => s.status === 'Rejected').length,
    };
  }, []);

  const filteredSpaces = useMemo(() => {
    return MOCK_SPACES.filter(space => {
      const matchesSearch =
        space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        space.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPending = !pendingOnly || space.status === 'Pending Review';

      return (
        matchesSearch &&
        (activeTab === 'All Categories'
          ? true
          : space.category + 's' === activeTab) &&
        matchesPending
      );
    });
  }, [searchQuery, activeTab, pendingOnly]);

  const handleGenerateInsight = async () => {
    setLoadingInsight(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const insight = `Based on ${filteredSpaces.length} spaces: ${stats.approved} approved (${Math.round((stats.approved / stats.total) * 100)}%), ${stats.pending} pending review, ${stats.rejected} rejected. Most popular category: ${activeTab === 'All Categories' ? 'All' : activeTab}.`;
    setAiInsight(insight);
    setLoadingInsight(false);
  };

  return (
    <>
      <AppHeader
        title="Space Inventory"
        subtitle="Manage and monitor all spaces in your platform."
        onMenuClick={() => setSidebarOpen(true)}
        showSearch={true}
        searchPlaceholder="Search spaces..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        actions={headerActions}
        profile={{
          name: user?.name || 'Admin',
          subtitle: user?.role || 'ADMIN',
          avatarUrl: getAvatarUrl(user?.name, 'Admin'),
          showDropdown: true,
        }}
        iconType="material"
      />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-indigo-600/5 border border-indigo-200 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-indigo-900">
                  AI Inventory Analyst
                </h4>
                <p className="text-xs text-indigo-700/80">
                  {aiInsight ||
                    'Generate professional insights based on your current inventory filters.'}
                </p>
              </div>
            </div>
            <button
              onClick={handleGenerateInsight}
              disabled={loadingInsight}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shrink-0 disabled:opacity-50"
            >
              {loadingInsight ? 'Analyzing...' : 'Generate Insight'}
            </button>
          </div>

          <StatsSection stats={stats} />

          <div className="bg-surface-light rounded-2xl shadow-float border border-gray-100 flex flex-col">
            <InventoryTable
              spaces={filteredSpaces}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>

        <footer className="mt-12 text-center text-xs text-text-secondary pb-4">
          <p>
            © {new Date().getFullYear()} SPACEPOCKER Inc. All rights reserved.{' '}
            <a className="hover:text-primary ml-2" href="#">
              Privacy Policy
            </a>
          </p>
        </footer>
      </main>
    </>
  );
};

export default SpacesPage;
