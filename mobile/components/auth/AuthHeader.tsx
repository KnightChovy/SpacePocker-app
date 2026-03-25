import React from 'react';
import { Image, Text, View } from 'react-native';
const logoApp = require('@/assets/images/logomautrang.png');
export default function AuthHeader() {
  return (
    <View className="bg-[#5B5BD6] flex-1 items-center justify-center pb-10">
      <Image source={logoApp} className="w-32 h-32 mb-2" resizeMode="contain" />
      <Text
        className="text-white text-2xl tracking-[0.2rem] mb-1 text-center"
        style={{ fontWeight: '400' }}
      >
        SPACEPOCKER
      </Text>
      <Text className="text-white/70 text-sm tracking-wide text-center">
        Classroom &amp; Space SaaS
      </Text>
    </View>
  );
}
