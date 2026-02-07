import React, { useState, useMemo } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import StatsSection from '../../components/admin/StatsSection';
import InventoryTable from '../../components/admin/InventoryTable';
import type { Space, InventoryStats } from '../../types/admin-types';

const MOCK_SPACES: Space[] = [
  {
    id: '1',
    name: 'Tech Innovation Hub',
    subName: 'Room 304 - Capacity: 25',
    image: 'https://picsum.photos/id/1/200/200',
    host: {
      name: 'Sarah Wilson',
      avatar: 'https://picsum.photos/id/64/40/40',
    },
    location: 'San Francisco, CA',
    category: 'Meeting Room',
    price: 75.0,
    priceUnit: 'hr',
    status: 'Approved',
  },
  {
    id: '2',
    name: 'Downtown Lecture Hall',
    subName: 'Main Hall - Capacity: 150',
    image: 'https://picsum.photos/id/2/200/200',
    host: {
      name: 'James Rodriguez',
      avatar: '',
      initials: 'JR',
    },
    location: 'Austin, TX',
    category: 'Classroom',
    price: 200.0,
    priceUnit: 'hr',
    status: 'Pending Review',
  },
  {
    id: '3',
    name: 'Quiet Zone Pods',
    subName: 'Pod A, B, C',
    image: 'https://picsum.photos/id/3/200/200',
    host: {
      name: 'Elena Li',
      avatar: '',
      initials: 'EL',
    },
    location: 'Seattle, WA',
    category: 'Office',
    price: 45.0,
    priceUnit: 'day',
    status: 'Approved',
  },
  {
    id: '4',
    name: 'Basement Storage',
    subName: 'Unit 4B',
    image: 'https://picsum.photos/id/4/200/200',
    host: {
      name: 'Mike K.',
      avatar: '',
      initials: 'MK',
    },
    location: 'Chicago, IL',
    category: 'Storage',
    price: 15.0,
    priceUnit: 'hr',
    status: 'Rejected',
  },
  {
    id: '5',
    name: 'Executive Suite 500',
    subName: 'Top Floor - Capacity: 10',
    image: 'https://picsum.photos/id/5/200/200',
    host: {
      name: 'Admin Demo',
      avatar: '',
      initials: 'AD',
    },
    location: 'New York, NY',
    category: 'Office',
    price: 120.0,
    priceUnit: 'hr',
    status: 'Pending Review',
  },
  {
    id: '6',
    name: 'Loft Studio',
    subName: 'Studio A - Capacity: 40',
    image: 'https://picsum.photos/id/6/200/200',
    host: {
      name: 'Elena Li',
      avatar: '',
      initials: 'EL',
    },
    location: 'Los Angeles, CA',
    category: 'Classroom',
    price: 150.0,
    priceUnit: 'hr',
    status: 'Approved',
  },
  {
    id: '7',
    name: 'Global Workspace',
    subName: 'Hot Desk Area',
    image: 'https://picsum.photos/id/7/200/200',
    host: {
      name: 'Mike K.',
      avatar: '',
      initials: 'MK',
    },
    location: 'London, UK',
    category: 'Office',
    price: 35.0,
    priceUnit: 'day',
    status: 'Approved',
  },
];

const SpacesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Categories');
  const [pendingOnly, setPendingOnly] = useState(false);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [activeItem, setActiveItem] = useState('spaces'); // Set active item for sidebar
  const [isOpen, setIsOpen] = useState(false); // Sidebar open state for mobile

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
    <div className="flex h-screen w-full overflow-hidden bg-background-light">
      <Sidebar
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          pendingOnly={pendingOnly}
          setPendingOnly={setPendingOnly}
          title="Spaces Inventory"
          subtitle="Manage and monitor all spaces in your platform."
        />

        <main className="flex-1 overflow-y-auto pt-22 pb-8 px-6 md:px-8">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            <div className="bg-indigo-600/5 border border-indigo-200 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">
                    auto_awesome
                  </span>
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
      </div>
    </div>
  );
};

export default SpacesPage;
