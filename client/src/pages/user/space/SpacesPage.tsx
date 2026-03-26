import { useState, useMemo, useEffect } from 'react';
import type {
  Amenity,
  FilterState,
  Space,
  SpaceType,
} from '@/types/user/types';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/features/space/filter/Sidebar';
import SpaceList from '@/components/features/space/spaceList/SpaceList';
import SearchBar from '@/components/features/space/filter/SearchBar';

import { useGetRooms } from '@/hooks/user/rooms/use-get-rooms';
import { useSearchAvailableRooms } from '@/hooks/user/rooms/use-search-available-rooms';
import type { ApiRoom } from '@/types/user/room-api';

const pad2 = (value: number) => value.toString().padStart(2, '0');
const toDateString = (date: Date) => {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
};

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
  const [availableDate, setAvailableDate] = useState('');
  const [availableStartHour, setAvailableStartHour] = useState('09:00');
  const [availableEndHour, setAvailableEndHour] = useState('11:00');
  const [now, setNow] = useState<Date>(() => new Date());

  const [displayedSpaces, setDisplayedSpaces] = useState<Space[]>([]);

  const mapSpaceTypeToApiRoomType = (type: SpaceType) => {
    if (type === 'Meeting Room') return 'MEETING' as const;
    if (type === 'Event Space') return 'EVENT' as const;
    if (type === 'Co-working Space') return 'CLASSROOM' as const;
    return undefined;
  };

  const timeSlots = useMemo(() => {
    return Array.from({ length: 17 }, (_, index) => {
      const hour = index + 7;
      return `${hour.toString().padStart(2, '0')}:00`;
    });
  }, []);

  const todayDate = useMemo(() => toDateString(now), [now]);
  const isTodaySelected = availableDate === todayDate;

  const availableStartOptions = useMemo(() => {
    if (!isTodaySelected || !availableDate) return timeSlots;

    return timeSlots.filter(slot => {
      const slotDateTime = new Date(`${availableDate}T${slot}:00`);
      return slotDateTime.getTime() >= now.getTime();
    });
  }, [availableDate, isTodaySelected, now, timeSlots]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (availableDate && availableDate < todayDate) {
      setAvailableDate(todayDate);
    }
  }, [availableDate, todayDate]);

  useEffect(() => {
    if (availableStartOptions.length === 0) return;
    if (!availableStartOptions.includes(availableStartHour)) {
      setAvailableStartHour(availableStartOptions[0]);
    }
  }, [availableStartHour, availableStartOptions]);

  const availableEndOptions = useMemo(() => {
    return timeSlots.filter(slot => slot > availableStartHour);
  }, [availableStartHour, timeSlots]);

  useEffect(() => {
    if (availableEndOptions.length === 0) return;
    if (!availableEndOptions.includes(availableEndHour)) {
      setAvailableEndHour(availableEndOptions[0]);
    }
  }, [availableEndHour, availableEndOptions]);

  const buildIsoFromDateAndHour = (date: string, hour: string) => {
    if (!date || !hour) return '';
    const candidate = new Date(`${date}T${hour}:00`);
    if (Number.isNaN(candidate.getTime())) return '';
    return candidate.toISOString();
  };

  const availableStartTime = buildIsoFromDateAndHour(
    availableDate,
    availableStartHour
  );
  const availableEndTime = buildIsoFromDateAndHour(
    availableDate,
    availableEndHour
  );

  const shouldSearchByTime = Boolean(availableStartTime && availableEndTime);
  const hasValidTimeRange =
    !shouldSearchByTime ||
    new Date(availableStartTime).getTime() <
      new Date(availableEndTime).getTime();

  const selectedRoomType = filters.spaceTypes[0]
    ? mapSpaceTypeToApiRoomType(filters.spaceTypes[0])
    : undefined;

  const availableRoomsParams =
    shouldSearchByTime && hasValidTimeRange
      ? {
          startTime: new Date(availableStartTime).toISOString(),
          endTime: new Date(availableEndTime).toISOString(),
          search: filters.searchQuery.trim() || undefined,
          roomType: selectedRoomType,
          minPrice: didInitPriceRange ? filters.priceRange[0] : undefined,
          maxPrice: didInitPriceRange ? filters.priceRange[1] : undefined,
          limit: 100,
          offset: 0,
        }
      : undefined;

  const roomsQuery = useGetRooms(
    {
      status: 'AVAILABLE',
      limit: 100,
      offset: 0,
    },
    {
      enabled: !shouldSearchByTime || !hasValidTimeRange,
    }
  );

  const availableRoomsQuery = useSearchAvailableRooms(availableRoomsParams, {
    enabled: shouldSearchByTime && hasValidTimeRange,
  });

  const activeQuery =
    shouldSearchByTime && hasValidTimeRange ? availableRoomsQuery : roomsQuery;

  const spacesData: Space[] = useMemo(() => {
    const rooms: ApiRoom[] =
      shouldSearchByTime && hasValidTimeRange
        ? (availableRoomsQuery.data?.rooms ?? [])
        : (roomsQuery.data?.rooms ?? []);

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
  }, [
    availableRoomsQuery.data?.rooms,
    hasValidTimeRange,
    roomsQuery.data?.rooms,
    shouldSearchByTime,
  ]);

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

  if (activeQuery.isLoading) {
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

  if (activeQuery.isError) {
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
                ? activeQuery.error.message
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
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="date"
                  value={availableDate}
                  onChange={event => setAvailableDate(event.target.value)}
                  min={todayDate}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={availableStartHour}
                    onChange={event =>
                      setAvailableStartHour(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    disabled={availableStartOptions.length === 0}
                  >
                    {availableStartOptions.map(slot => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>

                  <select
                    value={availableEndHour}
                    onChange={event => setAvailableEndHour(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    disabled={availableEndOptions.length === 0}
                  >
                    {availableEndOptions.map(slot => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {!hasValidTimeRange ? (
                <p className="text-sm text-amber-600 mb-3">
                  End time must be later than start time.
                </p>
              ) : null}

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
