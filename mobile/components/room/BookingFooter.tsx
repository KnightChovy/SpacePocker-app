import { RoomDetail, RoomStatus } from '@/types/room.type';
import { Calendar } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

type Props = {
  room: RoomDetail;
  onBookPress: () => void;
};

export default function BookingFooter({ room, onBookPress }: Props) {
  const isAvailable = room.status === RoomStatus.AVAILABLE;

  return (
    <View
      className="bg-white border-t border-gray-100 px-5 py-4"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 10,
      }}
    >
      <View className="flex-row items-center justify-between">
        <View>
          <View className="flex-row items-baseline gap-1">
            <Text className="text-2xl font-extrabold text-gray-900">
              {room.pricePerHour.toLocaleString('vi-VN')}đ
            </Text>
            <Text className="text-gray-400 text-sm">/giờ</Text>
          </View>
          <Text className="text-xs text-gray-400 mt-0.5">
            +{room.securityDeposit.toLocaleString('vi-VN')}đ đặt cọc
          </Text>
        </View>

        <TouchableOpacity
          onPress={onBookPress}
          disabled={!isAvailable}
          activeOpacity={0.85}
          className="flex-row items-center gap-2 px-7 py-3.5 rounded-2xl"
          style={{
            backgroundColor: isAvailable ? '#5B4FE9' : '#E5E7EB',
            shadowColor: isAvailable ? '#5B4FE9' : 'transparent',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.35,
            shadowRadius: 12,
            elevation: isAvailable ? 6 : 0,
          }}
        >
          <Calendar
            size={18}
            color={isAvailable ? 'white' : '#9CA3AF'}
            strokeWidth={2}
          />
          <Text
            className="font-bold text-base"
            style={{ color: isAvailable ? 'white' : '#9CA3AF' }}
          >
            {isAvailable ? 'Book Now' : 'Unavailable'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
