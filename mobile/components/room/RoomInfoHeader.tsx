import { RoomDetail } from '@/types/room.type';
import { Building2, Hash } from 'lucide-react-native';
import { Text, View } from 'react-native';

type Props = { room: RoomDetail };

const ROOM_TYPE_COLOR: Record<string, { bg: string; text: string }> = {
  MEETING: { bg: '#EEF0FF', text: '#5B4FE9' },
  CONFERENCE: { bg: '#FEF3C7', text: '#D97706' },
  STUDIO: { bg: '#FCE7F3', text: '#DB2777' },
  OFFICE: { bg: '#D1FAE5', text: '#059669' },
  COWORKING: { bg: '#DBEAFE', text: '#2563EB' },
  EVENT: { bg: '#FEE2E2', text: '#DC2626' },
};

export default function RoomInfoHeader({ room }: Props) {
  const typeColor = ROOM_TYPE_COLOR[room.roomType] ?? {
    bg: '#F3F4F6',
    text: '#6B7280',
  };

  return (
    <View className="px-5 pt-5 pb-4">
      <View className="flex-row items-center justify-between mb-3">
        <View
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: typeColor.bg }}
        >
          <Text
            className="text-xs font-bold tracking-wider uppercase"
            style={{ color: typeColor.text }}
          >
            {room.roomType}
          </Text>
        </View>

        <View
          className="flex-row items-center gap-1.5 px-3 py-1 rounded-full"
          style={{
            backgroundColor: room.isAvailable ? '#D1FAE5' : '#FEE2E2',
          }}
        >
          <View
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: room.isAvailable ? '#059669' : '#DC2626',
            }}
          />
          <Text
            className="text-xs font-semibold"
            style={{ color: room.isAvailable ? '#059669' : '#DC2626' }}
          >
            {room.isAvailable ? 'Available Now' : 'Occupied'}
          </Text>
        </View>
      </View>

      <Text className="text-2xl font-extrabold text-gray-900 mb-1">
        {room.name}
      </Text>

      <View className="flex-row items-center gap-3 mt-1">
        <View className="flex-row items-center gap-1">
          <Hash size={12} color="#9CA3AF" strokeWidth={2} />
          <Text className="text-xs text-gray-400 font-medium">
            {room.roomCode}
          </Text>
        </View>
        <View className="w-1 h-1 rounded-full bg-gray-300" />
        <View className="flex-row items-center gap-1">
          <Building2 size={12} color="#9CA3AF" strokeWidth={1.8} />
          <Text className="text-xs text-gray-400 font-medium">
            {room.building.buildingName} · {room.building.campus}
          </Text>
        </View>
      </View>
    </View>
  );
}
