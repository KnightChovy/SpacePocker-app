import roomService from '@/services/room.service';
import { Room, RoomStatus } from '@/types/room.type';
import { router } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

function RoomCard({ room }: { room: Room }) {
  const isAvailable = room.status === RoomStatus.AVAILABLE;

  const handlePress = () => {
    router.push({
      pathname: '/(modals)/room-detail' as any,
      params: { id: room.id },
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.92}
      className="bg-white rounded-2xl overflow-hidden mb-4 border border-gray-100"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {room.images?.[0] ? (
        <Image
          source={{ uri: room.images[0] }}
          className="w-full h-44"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-44 bg-gray-100 items-center justify-center">
          <Text className="text-gray-300 text-xs">No image</Text>
        </View>
      )}

      {/* Status badge */}
      <View
        className="absolute top-3 left-3 px-2.5 py-1 rounded-xl"
        style={{ backgroundColor: isAvailable ? '#D1FAE5' : '#FEE2E2' }}
      >
        <Text
          className="text-xs font-semibold"
          style={{ color: isAvailable ? '#059669' : '#DC2626' }}
        >
          {isAvailable ? 'Available' : 'Occupied'}
        </Text>
      </View>

      <View className="p-4">
        <View className="flex-row items-start justify-between mb-1">
          <Text
            className="text-gray-900 font-bold text-base flex-1 mr-2"
            numberOfLines={1}
          >
            {room.name}
          </Text>
          <View className="flex-row items-baseline gap-0.5">
            <Text className="text-[#5B4FE9] font-extrabold text-lg">
              ${room.pricePerHour}
            </Text>
            <Text className="text-gray-400 text-xs">/hr</Text>
          </View>
        </View>

        {room.building?.address ? (
          <View className="flex-row items-center gap-1 mb-3">
            <MapPin size={12} color="#9CA3AF" strokeWidth={1.8} />
            <Text className="text-gray-400 text-xs" numberOfLines={1}>
              {room.building.address}
            </Text>
          </View>
        ) : null}

        <View className="flex-row flex-wrap gap-2">
          <View className="bg-gray-100 rounded-lg px-2.5 py-1">
            <Text className="text-gray-500 text-[10px] font-semibold tracking-wider">
              {room.roomType}
            </Text>
          </View>
          <View className="bg-gray-100 rounded-lg px-2.5 py-1">
            <Text className="text-gray-500 text-[10px] font-semibold tracking-wider">
              {room.capacity} pax
            </Text>
          </View>
          {room.amenities?.slice(0, 2).map(ra => (
            <View
              key={ra.amenityId}
              className="bg-gray-100 rounded-lg px-2.5 py-1"
            >
              <Text className="text-gray-500 text-[10px] font-semibold tracking-wider">
                {ra.amenity.name}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function CuratedSpaces() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    roomService
      .getAllRooms({ limit: 3, offset: 0 })
      .then(res => setRooms(res.metadata.rooms))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View className="px-5 py-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-xl font-bold text-gray-900">
          Available Spaces
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/search')}
          activeOpacity={0.7}
        >
          <Text className="text-[#5B4FE9] text-sm font-semibold">View All</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="py-10 items-center">
          <ActivityIndicator color="#5B4FE9" />
        </View>
      ) : rooms.length === 0 ? (
        <View className="py-10 items-center">
          <Text className="text-gray-400 text-sm">No spaces available.</Text>
        </View>
      ) : (
        rooms.map(room => <RoomCard key={room.id} room={room} />)
      )}
    </View>
  );
}
