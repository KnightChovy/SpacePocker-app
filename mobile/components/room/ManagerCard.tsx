import { RoomDetail } from '@/types/room.type';
import { MessageCircle, User } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

type Props = { manager: RoomDetail['manager'] };

export default function ManagerCard({ manager }: Props) {
  return (
    <View className="mx-5 mb-5">
      <Text className="text-base font-bold text-gray-900 mb-3">Managed by</Text>
      <View
        className="bg-white rounded-2xl p-4 flex-row items-center border border-gray-100"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View className="w-12 h-12 rounded-2xl bg-[#EEF0FF] items-center justify-center mr-3">
          <User size={22} color="#5B4FE9" strokeWidth={1.8} />
        </View>

        <View className="flex-1">
          <Text className="text-sm font-bold text-gray-900">
            {manager.name}
          </Text>
          <Text className="text-xs text-gray-400 mt-0.5">{manager.email}</Text>
        </View>

        <TouchableOpacity
          className="w-10 h-10 rounded-xl bg-[#EEF0FF] items-center justify-center"
          activeOpacity={0.7}
        >
          <MessageCircle size={18} color="#5B4FE9" strokeWidth={1.8} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
