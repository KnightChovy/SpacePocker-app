import { Room } from '@/types/room.type';
import { Search } from 'lucide-react-native';
import { ActivityIndicator, Text, View } from 'react-native';
import RoomCard from './RoomCard';

type Props = {
  loading: boolean;
  hasSearched: boolean;
  rooms: Room[];
  total?: number;
};

export default function SearchResults({
  loading,
  hasSearched,
  rooms,
  total,
}: Props) {
  if (loading) {
    return (
      <View className="items-center py-16">
        <ActivityIndicator size="large" color="#5B4FE9" />
        <Text className="text-gray-400 text-sm mt-3">Searching spaces...</Text>
      </View>
    );
  }

  if (!hasSearched) {
    return (
      <View className="items-center py-16">
        <View className="w-16 h-16 rounded-2xl bg-[#EEF0FF] items-center justify-center mb-4">
          <Search size={28} color="#5B4FE9" strokeWidth={1.8} />
        </View>
        <Text className="text-gray-900 font-bold text-base mb-1">
          Discover spaces
        </Text>
        <Text className="text-gray-400 text-sm text-center">
          Search or filter to find the perfect room.
        </Text>
      </View>
    );
  }

  if (rooms.length === 0) {
    return (
      <View className="items-center py-16">
        <Text className="text-gray-400 text-base">No spaces found.</Text>
        <Text className="text-gray-300 text-sm mt-1">
          Try adjusting your filters.
        </Text>
      </View>
    );
  }

  return (
    <>
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-sm font-semibold text-gray-500">
          {total ?? rooms.length} spaces found
        </Text>
      </View>
      {rooms.map(room => (
        <RoomCard key={room.id} room={room} />
      ))}
    </>
  );
}
