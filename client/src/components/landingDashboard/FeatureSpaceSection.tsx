import { useMemo } from 'react';
import SpaceCard from './SpaceCard';
import { ChevronDown, Shuffle } from 'lucide-react';
import { Button } from '../ui/button';
import { useGetRooms } from '@/hooks/user/rooms/use-get-rooms';
import type { ApiRoom } from '@/types/room-api';
import type { Space } from '@/types/types';

interface FeatureSpaceSectionProps {
  searchQuery?: string;
  sectionId?: string;
}

const FeatureSpaceSection = ({
  searchQuery = '',
  sectionId,
}: FeatureSpaceSectionProps) => {
  const roomsQuery = useGetRooms({
    status: 'AVAILABLE',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    limit: 8,
    offset: 0,
  });

  const spaces = useMemo<Space[]>(() => {
    const rooms: ApiRoom[] = roomsQuery.data?.rooms ?? [];

    return rooms.map(room => ({
      id: room.id,
      name: room.name,
      description: room.description ?? 'Great space for your next booking.',
      price: room.pricePerHour,
      rating: 0,
      capacity: room.capacity,
      imageUrl: room.images?.[0] ?? '',
      images: room.images ?? [],
      location: room.building?.address ?? room.building?.campus,
    }));
  }, [roomsQuery.data?.rooms]);

  const filteredSpaces = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return spaces;

    return spaces.filter(space => {
      return (
        space.name.toLowerCase().includes(normalizedQuery) ||
        space.description.toLowerCase().includes(normalizedQuery) ||
        space.location?.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [searchQuery, spaces]);

  return (
    <section id={sectionId} className="py-12 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl font-extrabold text-secondary tracking-tight">
              Popular near you
            </h2>
            <p className="text-slate-500 mt-2 leading-relaxed">
              Discover the most booked spaces this week. From boutique studios
              to high-tech conference rooms.
            </p>
          </div>
          <div className="flex gap-3">
            <Button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
              <Shuffle className="h-4 w-4" />
              Filters
            </Button>
            <Button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
              Sort by
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {roomsQuery.isLoading ? (
          <div className="py-16 text-center text-slate-500">
            Loading spaces...
          </div>
        ) : roomsQuery.isError ? (
          <div className="py-16 text-center text-red-600">
            Failed to load spaces. Please try again.
          </div>
        ) : filteredSpaces.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            No spaces found for your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSpaces.map(space => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center sm:hidden">
          <Button className="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white py-3 text-sm font-bold text-[#0e0d1b] shadow-sm">
            View all spaces
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeatureSpaceSection;
