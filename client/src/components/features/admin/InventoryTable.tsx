import React from 'react';
import type { Space } from '@/types/admin-types';

interface InventoryTableProps {
  spaces: Space[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  spaces,
  activeTab,
  setActiveTab,
}) => {
  const tabs = ['All Categories', 'Meeting Rooms', 'Classrooms', 'Offices'];

  return (
    <>
      <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-text-secondary hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span>Showing 1-{spaces.length} of 842</span>
          <div className="flex gap-1 ml-2">
            <button className="p-1 hover:bg-gray-100 rounded text-gray-400 transition-colors">
              <span className="material-symbols-outlined text-[20px]">
                chevron_left
              </span>
            </button>
            <button className="p-1 hover:bg-gray-100 rounded text-gray-900 font-medium transition-colors">
              <span className="material-symbols-outlined text-[20px]">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-text-secondary border-b border-gray-100 bg-gray-50/50">
              <th className="py-4 px-6 font-semibold uppercase tracking-wider">
                Building / Room
              </th>
              <th className="py-4 px-6 font-semibold uppercase tracking-wider">
                Host / Manager
              </th>
              <th className="py-4 px-6 font-semibold uppercase tracking-wider">
                Location
              </th>
              <th className="py-4 px-6 font-semibold uppercase tracking-wider">
                Category
              </th>
              <th className="py-4 px-6 font-semibold uppercase tracking-wider">
                Price
              </th>
              <th className="py-4 px-6 font-semibold uppercase tracking-wider">
                Status
              </th>
              <th className="py-4 px-6 font-semibold uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-50">
            {spaces.length > 0 ? (
              spaces.map(space => <SpaceRow key={space.id} space={space} />)
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="py-20 text-center text-text-secondary"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-4xl text-gray-300">
                      search_off
                    </span>
                    <p>No spaces found matching your criteria.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-text-secondary">
          Showing results 1-{spaces.length} of 842
        </span>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 bg-primary text-white rounded-lg text-xs font-medium hover:bg-indigo-600 transition-shadow hover:shadow-lg shadow-indigo-500/20">
            Next
          </button>
        </div>
      </div>
    </>
  );
};

const SpaceRow: React.FC<{ space: Space }> = ({ space }) => {
  const isPending = space.status === 'Pending Review';
  const isRejected = space.status === 'Rejected';

  return (
    <tr
      className={`group hover:bg-gray-50 transition-colors ${isPending ? 'bg-yellow-50/30' : ''}`}
    >
      <td className="py-4 px-6">
        <div className="flex items-center gap-4">
          <div
            className={`size-12 rounded-lg bg-gray-200 bg-cover bg-center shrink-0 shadow-sm ${isRejected ? 'grayscale opacity-70' : ''}`}
            style={{ backgroundImage: `url(${space.image})` }}
          ></div>
          <div>
            <p
              className={`font-semibold text-gray-900 ${isRejected ? 'line-through decoration-gray-300' : ''}`}
            >
              {space.name}
            </p>
            <p className="text-[11px] text-text-secondary">{space.subName}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-2">
          {space.host.avatar ? (
            <div
              className="size-6 rounded-full bg-cover bg-center border border-white shadow-xs"
              style={{ backgroundImage: `url(${space.host.avatar})` }}
            ></div>
          ) : (
            <div
              className={`size-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white ${getHostColor(space.host.initials || 'A')}`}
            >
              {space.host.initials}
            </div>
          )}
          <span className="text-gray-700 font-medium">{space.host.name}</span>
        </div>
      </td>
      <td className="py-4 px-6 text-gray-600 font-medium">{space.location}</td>
      <td className="py-4 px-6">
        <CategoryBadge category={space.category} />
      </td>
      <td className="py-4 px-6 font-bold text-gray-900">
        ${space.price.toFixed(2)}{' '}
        <span className="text-[10px] font-normal text-text-secondary">
          /{space.priceUnit}
        </span>
      </td>
      <td className="py-4 px-6">
        <StatusBadge status={space.status} />
      </td>
      <td className="py-4 px-6 text-right">
        {isPending ? (
          <div className="flex items-center justify-end gap-1">
            <button
              className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
              title="Approve"
            >
              <span className="material-symbols-outlined text-[20px]">
                check
              </span>
            </button>
            <button
              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
              title="Reject"
            >
              <span className="material-symbols-outlined text-[20px]">
                close
              </span>
            </button>
          </div>
        ) : (
          <button className="text-gray-400 hover:text-primary transition-colors p-1 rounded-lg">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        )}
      </td>
    </tr>
  );
};

const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  const colors: Record<string, string> = {
    'Meeting Room': 'bg-purple-100 text-purple-700 border-purple-200',
    Classroom: 'bg-blue-100 text-blue-700 border-blue-200',
    Office: 'bg-orange-100 text-orange-700 border-orange-200',
    Storage: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${colors[category] || colors['Storage']}`}
    >
      {category}
    </span>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    Approved: 'bg-green-100 text-green-700 ring-green-500',
    'Pending Review': 'bg-yellow-100 text-yellow-700 ring-yellow-500',
    Rejected: 'bg-red-100 text-red-700 ring-red-500',
    Archived: 'bg-gray-100 text-gray-600 ring-gray-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${styles[status]}`}
    >
      <span
        className={`size-1.5 rounded-full ${styles[status].split(' ')[2].replace('ring-', 'bg-')} ${status === 'Pending Review' ? 'animate-pulse' : ''}`}
      ></span>
      {status}
    </span>
  );
};

const getHostColor = (initials: string) => {
  const firstChar = initials.charAt(0).toUpperCase();
  if (firstChar < 'G') return 'bg-blue-500';
  if (firstChar < 'M') return 'bg-purple-500';
  if (firstChar < 'T') return 'bg-emerald-500';
  return 'bg-amber-500';
};

export default InventoryTable;
