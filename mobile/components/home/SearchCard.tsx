import { router } from 'expo-router';
import { Search } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

export default function SearchCard() {
  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => router.push('/(tabs)/search')}
      className="mx-4 -mt-8 z-10"
    >
      <View
        className="bg-white rounded-2xl p-4 flex-row items-center gap-3"
        style={{
          shadowColor: '#5B4FE9',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.18,
          shadowRadius: 20,
          elevation: 12,
        }}
      >
        <View className="w-11 h-11 rounded-xl bg-[#EEF0FF] items-center justify-center">
          <Search size={20} color="#5B4FE9" strokeWidth={2.2} />
        </View>
        <View className="flex-1">
          <Text className="text-gray-900 font-bold text-sm">
            Search for a space
          </Text>
          <Text className="text-gray-400 text-xs mt-0.5">
            Meeting rooms, classrooms, events...
          </Text>
        </View>
        <View className="w-8 h-8 rounded-xl bg-[#5B4FE9] items-center justify-center">
          <Search size={15} color="white" strokeWidth={2.5} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
