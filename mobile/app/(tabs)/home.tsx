import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

export default function Home() {
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Text>home</Text>
      <Pressable
        onPress={handleLogout}
        className="mt-4 px-6 py-3 bg-red-500 rounded-2xl"
      >
        <Text className="text-white font-semibold">Logout</Text>
      </Pressable>
    </View>
  );
}
