import { Room } from '@/types/room.type';
import { MapPin, Star } from 'lucide-react-native';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function RoomCard({ room }: { room: Room }) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
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

      {/* Availability badge */}
      <View
        className="absolute top-3 left-3 px-2.5 py-1 rounded-xl"
        style={{ backgroundColor: room.isAvailable ? '#D1FAE5' : '#FEE2E2' }}
      >
        <Text
          className="text-xs font-semibold"
          style={{ color: room.isAvailable ? '#059669' : '#DC2626' }}
        >
          {room.isAvailable ? 'Available' : 'Occupied'}
        </Text>
      </View>

      {room.rating != null && (
        <View className="absolute top-3 right-3 bg-white/95 rounded-xl px-2.5 py-1.5 flex-row items-center gap-1">
          <Star size={12} color="#F59E0B" fill="#F59E0B" />
          <Text className="text-xs font-bold text-gray-800">
            {room.rating.toFixed(1)}
          </Text>
        </View>
      )}

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

        {room.address && (
          <View className="flex-row items-center gap-1 mb-3">
            <MapPin size={12} color="#9CA3AF" strokeWidth={1.8} />
            <Text className="text-gray-400 text-xs" numberOfLines={1}>
              {room.address}
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
          {room.amenities?.slice(0, 2).map((a, i) => (
            <View
              key={a.id != null ? String(a.id) : i}
              className="bg-gray-100 rounded-lg px-2.5 py-1"
            >
              <Text className="text-gray-500 text-[10px] font-semibold tracking-wider">
                {a.name}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}
