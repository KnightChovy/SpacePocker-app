import { useState } from 'react';
import { Search } from 'lucide-react';
import FilterButton from '@/components/features/user/bookings/FilterButton';
import PaginationButton from '@/components/features/user/bookings/PaginationButton';
import BookingList from '@/components/features/user/bookings/BookingList';

const Bookings = () => {
  const [activeTab, setActiveTab] = useState<'Active' | 'Past' | 'Cancelled'>(
    'Past'
  );

  return (
    <div className="p-4 md:p-8 scroll-smooth">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight">My Bookings</h1>
          <p className="text-text-sub-light dark:text-text-sub-dark text-base">
            View and manage your current and past space reservations.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="border-b border-border-light dark:border-border-dark">
            <nav className="flex gap-8">
              {(['Active', 'Past', 'Cancelled'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? 'border-primary text-primary font-bold'
                      : 'border-transparent text-text-sub-light hover:text-text-main-light dark:hover:text-text-main-dark'
                  }`}
                >
                  {tab}{' '}
                  {tab === 'Active' && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                      1
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="relative w-full md:w-96 group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub-light/60 dark:text-text-sub-dark group-focus-within:text-primary transition-colors" />
              </div>
              <input
                className="pl-10 pr-4 py-2.5 w-full rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary/50 focus:border-transparent text-sm transition-all shadow-sm placeholder:text-text-sub-light/60"
                placeholder="Search by building, ID or name..."
                type="text"
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <FilterButton icon="calendar" label="Date Range" />
              <FilterButton icon="domain" label="All Buildings" />
            </div>
          </div>
        </div>

        <BookingList />

        <div className="flex items-center justify-center gap-2 py-4">
          <PaginationButton icon="left" disabled />
          <PaginationButton label="1" active />
          <PaginationButton label="2" />
          <PaginationButton label="3" />
          <PaginationButton icon="right" />
        </div>
      </div>
    </div>
  );
};

export default Bookings;
