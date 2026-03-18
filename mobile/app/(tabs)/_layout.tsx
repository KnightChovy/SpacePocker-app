import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/store/authStore';
import { Tabs, useRouter } from 'expo-router';
import { CalendarCheck, Home, Search, User } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { View } from 'react-native';
type TabIconProps = {
  icon: React.ElementType;
  color: string;
  size: number;
  focused: boolean;
};
function TabIcon({ icon: Icon, color, size, focused }: TabIconProps) {
  return (
    <View
      className="items-center justify-center rounded-xl px-3 py-1"
      style={
        focused ? { backgroundColor: 'rgba(79, 109, 245, 0.1)' } : undefined
      }
    >
      <Icon color={color} size={size} strokeWidth={focused ? 2.2 : 1.8} />
    </View>
  );
}

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isLoggedIn = useAuthStore(s => s.isLoggedIn);
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/(auth)/login');
    }
  }, [isLoggedIn]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: isDark ? '#2A2A2A' : '#F0F0F0',
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: '#4F6DF5',
        tabBarInactiveTintColor: isDark ? '#555555' : '#AAAAAA',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon icon={Home} color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              icon={Search}
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="mybooking"
        options={{
          title: 'My Booking',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              icon={CalendarCheck}
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon icon={User} color={color} size={size} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
