import React, { useState } from 'react';
import { MapPin, Map } from 'lucide-react';
import type { Space } from '@/types/types';

interface SearchBarProps {
  searchQuery: string;
  onChange: (query: string) => void;
  onSort: (sortedSpaces: Space[]) => void;
  spaces: Space[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onChange,
  onSort,
  spaces,
}) => {
  const [sortBy, setSortBy] = useState('recommended');

  const handleSortChange = (value: string) => {
    setSortBy(value);

    const sorted = [...spaces].sort((a, b) => {
      switch (value) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'recommended':
        default:
          return b.rating - a.rating;
      }
    });

    onSort(sorted);
  };

  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl border border-slate-200 p-2 shadow-sm">
      <div className="flex-1 flex items-center gap-3 px-4">
        <MapPin className="h-5 w-5 text-primary" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by city, neighborhood, or school..."
          className="w-full py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
        />
      </div>

      <div className="flex items-center gap-3 border-l border-slate-200 pl-4 pr-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="text-sm font-medium text-slate-900 focus:outline-none bg-transparent cursor-pointer"
          >
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        <div className="flex items-center gap-2 ml-2">
          <button className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
            <Map />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
