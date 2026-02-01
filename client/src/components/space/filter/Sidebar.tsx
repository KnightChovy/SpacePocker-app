import React from 'react';
import type { FilterState, SpaceType, Amenity } from '@/types/types';
import PriceRangeFilter from './PriceRangeFilter';
import SpaceTypeFilter from './SpaceTypeFilter';
import AmenitiesFilter from './AmenitiesFilter';
import RatingFilter from './RatingFilter';
import { SlidersHorizontal } from 'lucide-react';

interface SidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  spaceTypes: Array<{ label: SpaceType }>;
  amenities: Amenity[];
}

const Sidebar: React.FC<SidebarProps> = ({
  filters,
  onFilterChange,
  spaceTypes,
  amenities,
}) => {
  const clearAll = () => {
    onFilterChange({
      priceRange: [20, 500],
      spaceTypes: [],
      amenities: [],
      minRating: null,
      searchQuery: '',
    });
  };

  return (
    <aside className="w-72 hidden lg:flex flex-col gap-8 shrink-0 h-[calc(100vh-120px)] sticky top-24 overflow-y-auto custom-scrollbar pr-2">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            <SlidersHorizontal />
          </span>{' '}
          Filters
        </h3>
        <button
          onClick={clearAll}
          className="text-xs font-medium text-slate-500 hover:text-primary transition-colors"
        >
          Clear all
        </button>
      </div>

      <PriceRangeFilter
        priceRange={filters.priceRange}
        onChange={(range) => onFilterChange({ ...filters, priceRange: range })}
      />

      <SpaceTypeFilter
        spaceTypes={filters.spaceTypes}
        availableTypes={spaceTypes}
        onChange={(types) => onFilterChange({ ...filters, spaceTypes: types })}
      />

      <AmenitiesFilter
        selectedAmenities={filters.amenities}
        availableAmenities={amenities}
        onChange={(amenities) => onFilterChange({ ...filters, amenities })}
      />

      <RatingFilter
        minRating={filters.minRating}
        onChange={(rating) => onFilterChange({ ...filters, minRating: rating })}
      />

      <div className="mt-auto bg-linear-to-br from-primary/10 to-indigo-100 rounded-xl p-5 border border-primary/10">
        <p className="text-xs font-bold text-primary mb-1">PRO PLAN</p>
        <p className="text-sm font-semibold text-slate-900 mb-2">
          Need a dedicated space?
        </p>
        <p className="text-xs text-slate-600 mb-3">
          Get unlimited access to over 500 premium spaces starting at $199/mo.
        </p>
        <button className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:bg-primary-dark transition-colors">
          View Plans
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
