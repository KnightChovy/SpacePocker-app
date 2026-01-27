import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { FilterState, Space } from '@/types/types';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/space/filter/Sidebar';
import SpaceList from '@/components/space/spaceList/SpaceList';
import SearchBar from '@/components/space/filter/SearchBar';

// TODO: XÓA IMPORT NÀY KHI ĐÃ CÓ API - Đây là dữ liệu tĩnh tạm thời
import { SPACES, SPACE_TYPES, AMENITIES } from '@/data/constant';

import { spaceService } from '@/services/spaceService';

const SpacesPage = () => {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [20, 500],
    spaceTypes: [],
    amenities: [],
    minRating: null,
    searchQuery: '',
  });

  const [displayedSpaces, setDisplayedSpaces] = useState<Space[]>([]);

  // ============================================================
  // TODO: FETCH DATA TỪ API - Uncomment phần này khi backend sẵn sàng
  // ============================================================
  const {
    data: spaces,
    isLoading,
    isError,
    error,
  } = useQuery<Space[]>({
    queryKey: ['spaces'],
    queryFn: spaceService.getAllSpaces,
    staleTime: 10 * 60 * 1000,
  });

  // ============================================================
  // TODO: XÓA DÒNG NÀY KHI ĐÃ CÓ API - Đây là fallback dữ liệu tĩnh
  // ============================================================
  const spacesData = spaces && spaces.length > 0 ? spaces : SPACES;

  const filteredSpaces = useMemo(() => {
    return spacesData.filter((space) => {
      const matchesPrice =
        space.price >= filters.priceRange[0] &&
        space.price <= filters.priceRange[1];

      const matchesRating =
        filters.minRating === null || space.rating >= filters.minRating;

      const matchesSpaceType =
        filters.spaceTypes.length === 0 ||
        (space.type && filters.spaceTypes.includes(space.type));

      const matchesAmenities =
        filters.amenities.length === 0 ||
        filters.amenities.every((amenity) =>
          space.amenities?.includes(amenity),
        );

      const matchesSearch =
        !filters.searchQuery ||
        space.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        space.description
          ?.toLowerCase()
          .includes(filters.searchQuery.toLowerCase()) ||
        space.location
          ?.toLowerCase()
          .includes(filters.searchQuery.toLowerCase());

      return (
        matchesPrice &&
        matchesRating &&
        matchesSpaceType &&
        matchesAmenities &&
        matchesSearch
      );
    });
  }, [filters, spacesData]);

  useEffect(() => {
    setDisplayedSpaces(filteredSpaces);
  }, [filteredSpaces]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-20 bg-slate-900">
          <Navbar />
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-slate-600">Loading spaces...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-20 bg-slate-900">
          <Navbar />
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-600 font-semibold mb-2">
              Failed to load Spaces
            </p>
            <p className="text-slate-500 text-sm">
              {error instanceof Error ? error.message : 'Something went wrong'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-20 bg-slate-900">
        <Navbar />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        <div className="flex gap-8">
          <Sidebar
            filters={filters}
            onFilterChange={setFilters}
            spaceTypes={SPACE_TYPES}
            amenities={AMENITIES}
          />

          <main className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-slate-900">
                Available Spaces
              </h1>
              <p className="text-slate-600 mt-2">
                Browse {displayedSpaces.length} classrooms, studios, and meeting
              </p>
            </div>

            <div className="mb-6">
              <SearchBar
                searchQuery={filters.searchQuery}
                onChange={(query) =>
                  setFilters({ ...filters, searchQuery: query })
                }
                onSort={setDisplayedSpaces}
                spaces={filteredSpaces}
              />
            </div>

            <SpaceList spaces={displayedSpaces} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default SpacesPage;
