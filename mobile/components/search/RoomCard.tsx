import { Room, RoomStatus } from '@/types/room.type';
import { router } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function RoomCard({ room }: { room: Room }) {
  const handlePress = () => {
    router.push({
      pathname: '/(modals)/room-detail' as any,
      params: { id: room.id },
    });
  };

  const isAvailable = room.status === RoomStatus.AVAILABLE;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
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
          <Text className="text-gray-400 text-xs">No image</Text>
        </View>
      )}

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
              {room.pricePerHour.toLocaleString('vi-VN')}đ
            </Text>
            <Text className="text-gray-400 text-xs">/giờ</Text>
          </View>
        </View>

        {room.building?.address && (
          <View className="flex-row items-center gap-1 mb-3">
            <MapPin size={12} color="#9CA3AF" strokeWidth={1.8} />
            <Text className="text-gray-400 text-xs" numberOfLines={1}>
              {room.building.address}
            </Text>
          </View>
        )}

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
          {room.amenities?.slice(0, 2).map((ra, i) => (
            <View
              key={ra.amenityId ?? i}
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
