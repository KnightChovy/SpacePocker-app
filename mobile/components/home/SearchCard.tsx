import { Calendar, MapPin, Search, Users } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function SearchCard() {
  return (
    <View className="mx-4 -mt-8 bg-white rounded-2xl shadow-lg shadow-black/10 p-5 z-10">
      <View className="mb-4">
        <Text className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-2">
          Location
        </Text>
        <View className="flex-row items-center gap-2 border border-gray-100 rounded-xl px-3 py-3 bg-gray-50">
          <MapPin size={16} color="#9CA3AF" strokeWidth={1.8} />
          <Text className="text-gray-400 text-sm">Where are you going?</Text>
        </View>
      </View>

      <View className="flex-row gap-3 mb-5">
        <View className="flex-1">
          <Text className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-2">
            Date
          </Text>
          <View className="flex-row items-center gap-2 border border-gray-100 rounded-xl px-3 py-3 bg-gray-50">
            <Calendar size={15} color="#9CA3AF" strokeWidth={1.8} />
            <Text className="text-gray-500 text-sm">Anytime</Text>
          </View>
        </View>
        <View className="flex-1">
          <Text className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-2">
            Guests
          </Text>
          <View className="flex-row items-center gap-2 border border-gray-100 rounded-xl px-3 py-3 bg-gray-50">
            <Users size={15} color="#9CA3AF" strokeWidth={1.8} />
            <Text className="text-gray-500 text-sm">1–5</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        className="bg-[#5B4FE9] rounded-2xl py-4 flex-row items-center justify-center gap-2"
        activeOpacity={0.85}
      >
        <Search size={18} color="white" strokeWidth={2} />
        <Text className="text-white font-semibold text-base">
          Search Spaces
        </Text>
      </TouchableOpacity>
    </View>
  );
}
