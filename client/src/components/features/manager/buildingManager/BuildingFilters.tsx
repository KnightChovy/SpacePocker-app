import { Plus, Search, ChevronDown, GraduationCap } from 'lucide-react';
import type { BuildingQueryParams } from '@/types/types';

const CAMPUS_OPTIONS = [
  'Main Campus',
  'North Campus',
  'South Campus',
  'East Campus',
  'West Campus',
];

interface BuildingFiltersProps {
  searchQuery: string;
  selectedCampus: string;
  sortBy: BuildingQueryParams['sortBy'];
  sortOrder: 'asc' | 'desc';
  onSearchChange: (value: string) => void;
  onCampusChange: (value: string) => void;
  onSortChange: (
    sortBy: BuildingQueryParams['sortBy'],
    sortOrder: 'asc' | 'desc'
  ) => void;
  onAddClick: () => void;
}

const BuildingFilters = ({
  searchQuery,
  selectedCampus,
  sortBy,
  sortOrder,
  onSearchChange,
  onCampusChange,
  onSortChange,
  onAddClick,
}: BuildingFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {/* Search Input */}
      <div className="relative flex-1 min-w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search buildings..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      {/* Campus Filter */}
      <div className="relative">
        <select
          value={selectedCampus}
          onChange={e => onCampusChange(e.target.value)}
          className="appearance-none pl-10 pr-8 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
        >
          <option value="all">All Campuses</option>
          {CAMPUS_OPTIONS.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
      </div>

      {/* Sort Select */}
      <div className="relative">
        <select
          value={`${sortBy}:${sortOrder}`}
          onChange={e => {
            const [by, order] = e.target.value.split(':') as [
              BuildingQueryParams['sortBy'],
              'asc' | 'desc',
            ];
            onSortChange(by, order);
          }}
          className="appearance-none pl-4 pr-8 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
        >
          <option value="buildingName:asc">Name A → Z</option>
          <option value="buildingName:desc">Name Z → A</option>
          <option value="campus:asc">Campus A → Z</option>
          <option value="createdAt:desc">Newest First</option>
          <option value="createdAt:asc">Oldest First</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
      </div>

      {/* Add Building Button */}
      <button
        onClick={onAddClick}
        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 shadow-sm shadow-primary/20 transition-all active:scale-95 ml-auto"
      >
        <Plus className="size-4" />
        Add Building
      </button>
    </div>
  );
};

export default BuildingFilters;
