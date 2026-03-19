import { useState, useMemo, useEffect } from 'react';
import type { Amenity, FilterState, Space, SpaceType } from '@/types/types';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/features/space/filter/Sidebar';
import SpaceList from '@/components/features/space/spaceList/SpaceList';
import SearchBar from '@/components/features/space/filter/SearchBar';

import { useGetRooms } from '@/hooks/user/rooms/use-get-rooms';
import type { ApiRoom } from '@/types/room-api';

const SpacesPage = () => {
  const SPACE_TYPES: Array<{ label: SpaceType }> = [
    { label: 'Meeting Room' },
    { label: 'Co-working Space' },
    { label: 'Event Space' },
    { label: 'Conference Hall' },
    { label: 'Private Office' },
  ];

  const AMENITIES: Amenity[] = [
    'WiFi',
    'Projector',
    'Whiteboard',
    'Air Conditioning',
    'Coffee Machine',
    'Parking',
    'Kitchen Access',
    'Reception Service',
  ];

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 0],
    spaceTypes: [],
    amenities: [],
    minRating: null,
    searchQuery: '',
  });

  const [didInitPriceRange, setDidInitPriceRange] = useState(false);

  const [displayedSpaces, setDisplayedSpaces] = useState<Space[]>([]);

  const roomsQuery = useGetRooms({
    status: 'AVAILABLE',
    limit: 100,
    offset: 0,
  });

  const spacesData: Space[] = useMemo(() => {
    const rooms: ApiRoom[] = roomsQuery.data?.rooms ?? [];

    return rooms.map(room => {
      const buildingLabel = room.building?.buildingName
        ? ` - ${room.building.buildingName}`
        : '';

      const type =
        room.roomType === 'MEETING'
          ? 'Meeting Room'
          : room.roomType === 'EVENT'
            ? 'Event Space'
            : room.roomType === 'CLASSROOM'
              ? 'Co-working Space'
              : undefined;

      return {
        id: room.id,
        name: room.name,
        title: `${room.name}${buildingLabel}`,
        description: room.description ?? '',
        price: room.pricePerHour,
        rating: 0,
        capacity: room.capacity,
        imageUrl: room.images?.[0] ?? '',
        images: room.images ?? [],
        type,
        amenities: (room.amenities ?? []).map(a => ({
          icon: '',
          label: a.amenity.name,
        })),
        location: room.building?.address ?? room.building?.campus,
      } satisfies Space;
    });
  }, [roomsQuery.data?.rooms]);

  const priceBounds = useMemo(() => {
    const prices = spacesData
      .map(s => s.price)
      .filter(p => typeof p === 'number' && Number.isFinite(p));
    if (prices.length === 0) return { min: 0, max: 0 };
    const min = Math.max(0, Math.floor(Math.min(...prices)));
    const max = Math.max(min + 1, Math.ceil(Math.max(...prices)));
    return { min, max };
  }, [spacesData]);

  useEffect(() => {
    if (didInitPriceRange) return;
    if (spacesData.length === 0) return;

    setFilters(prev => ({
      ...prev,
      priceRange: [priceBounds.min, priceBounds.max],
    }));
    setDidInitPriceRange(true);
  }, [didInitPriceRange, priceBounds.max, priceBounds.min, spacesData.length]);

  const filteredSpaces = useMemo(() => {
    return spacesData.filter(space => {
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
        filters.amenities.every(
          amenity =>
            Array.isArray(space.amenities) &&
            space.amenities.some(a =>
              typeof a === 'string' ? a === amenity : a.label.includes(amenity)
            )
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

  if (roomsQuery.isLoading) {
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

  if (roomsQuery.isError) {
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
              {roomsQuery.error instanceof Error
                ? roomsQuery.error.message
                : 'Something went wrong'}
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
            defaultPriceRange={[priceBounds.min, priceBounds.max]}
            priceBounds={priceBounds}
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
                onChange={query =>
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
