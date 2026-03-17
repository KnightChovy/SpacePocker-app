import { LinearGradient } from 'expo-linear-gradient';
import { Bell } from 'lucide-react-native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function HeroSection() {
  return (
    <LinearGradient
      colors={['#2D1B69', '#4C35B5', '#6B52D9']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="px-5 pt-6 pb-16"
    >
      <View className="flex-row items-center justify-between mb-8">
        <View className="flex-row items-center gap-2.5">
          <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
            <Image
              source={require('@/assets/images/logomautrang.png')}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </View>
          <Text className="text-white font-bold text-base tracking-widest uppercase">
            SpacePocker
          </Text>
        </View>

        <TouchableOpacity
          className="w-9 h-9 rounded-full bg-white/15 items-center justify-center"
          activeOpacity={0.7}
        >
          <Bell size={18} color="white" strokeWidth={1.8} />
        </TouchableOpacity>
      </View>

      <View className="items-center px-2">
        <Text className="text-white text-4xl font-extrabold text-center leading-tight">
          {'Find the perfect\nspace for your next'}
        </Text>
        <Text className="text-[#A78BFA] text-4xl font-extrabold text-center leading-tight mb-4">
          breakthrough.
        </Text>
        <Text className="text-white/70 text-sm text-center leading-relaxed">
          {
            'Unlock exclusive workspaces,\ncreative studios, and high-end\nmeeting rooms.'
          }
        </Text>
      </View>
    </LinearGradient>
  );
}
