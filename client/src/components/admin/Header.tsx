import React, { type Dispatch, type SetStateAction } from 'react';

interface HeaderProps {
  searchQuery?: string;
  setSearchQuery?: Dispatch<SetStateAction<string>>;
  pendingOnly?: boolean;
  setPendingOnly?: Dispatch<SetStateAction<boolean>>;
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({
  searchQuery = '',
  setSearchQuery,
  pendingOnly = false,
  setPendingOnly,
  title = 'Analytics Overview',
  subtitle = 'Real-time insights for SPACEPOCKER performance.',
}) => {
  return (
    <header className="sticky top-0 z-20 bg-[#f8f9fc]/80 backdrop-blur-md px-6 py-5 flex items-center justify-between border-b border-gray-100/50">
      <div className="flex items-center gap-4 lg:gap-0">
        <button className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5 hidden sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden md:flex items-center w-72 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 focus-within:ring-4 focus-within:ring-indigo-100 transition-all shadow-sm">
          <span className="material-symbols-outlined text-gray-400 mr-2 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder={
              setSearchQuery ? 'Search spaces...' : 'Search analytics...'
            }
            value={searchQuery}
            onChange={e => setSearchQuery?.(e.target.value)}
            className="w-full bg-transparent border-none text-sm focus:ring-0 placeholder:text-gray-400 text-gray-700"
          />
          <span className="text-[10px] font-bold text-gray-400 border border-gray-200 rounded-md px-1.5 py-0.5 ml-2">
            ⌘K
          </span>
        </div>

        {setPendingOnly && (
          <button
            onClick={() => setPendingOnly(!pendingOnly)}
            className={`flex items-center gap-2 border rounded-2xl px-4 py-2.5 text-sm font-semibold transition-colors shadow-sm ${
              pendingOnly
                ? 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {pendingOnly ? 'filter_list_off' : 'filter_list'}
            </span>
            <span className="hidden sm:inline">
              {pendingOnly ? 'Show All' : 'Pending Only'}
            </span>
          </button>
        )}

        <button className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
          <span className="material-symbols-outlined text-[18px] text-gray-500">
            calendar_today
          </span>
          <span className="hidden sm:inline">Last 30 Days</span>
          <span className="material-symbols-outlined text-[18px] text-gray-400">
            expand_more
          </span>
        </button>

        <button className="flex items-center gap-2 bg-indigo-600 text-white rounded-2xl px-5 py-2.5 text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all active:scale-95">
          <span className="material-symbols-outlined text-[20px]">
            ios_share
          </span>
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
