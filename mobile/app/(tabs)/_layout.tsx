import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/store/authStore';
import { Tabs, useRouter } from 'expo-router';
import { CalendarCheck, History, Home } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

const ACTIVE_COLOR = '#4F6DF5';
const FAB_SIZE = 60;

type TabIconProps = {
  icon: React.ElementType;
  color: string;
  focused: boolean;
  label: string;
};

function TabIcon({ icon: Icon, color, focused, label }: TabIconProps) {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        paddingTop: 6,
        minWidth: 64,
      }}
    >
      <View
        style={{
          width: 44,
          height: 26,
          borderRadius: 13,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: focused ? `${ACTIVE_COLOR}18` : 'transparent',
        }}
      >
        <Icon color={color} size={20} strokeWidth={focused ? 2.3 : 1.7} />
      </View>
      <Text
        numberOfLines={1}
        style={{
          fontSize: 11,
          fontWeight: focused ? '700' : '500',
          color,
          letterSpacing: 0.1,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function BookingFABButton({ onPress, accessibilityState }: any) {
  const focused = accessibilityState?.selected;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        top: -(FAB_SIZE / 2 + 2),
      }}
    >
      {/* White ring creating the "lifted" effect */}
      <View
        style={{
          width: FAB_SIZE + 8,
          height: FAB_SIZE + 8,
          borderRadius: (FAB_SIZE + 8) / 2,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#4F6DF5',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.35,
          shadowRadius: 16,
          elevation: 16,
        }}
      >
        <View
          style={{
            width: FAB_SIZE,
            height: FAB_SIZE,
            borderRadius: FAB_SIZE / 2,
            backgroundColor: focused ? '#3D5CE0' : ACTIVE_COLOR,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <CalendarCheck size={24} color="white" strokeWidth={2.2} />
          <Text
            style={{
              fontSize: 9,
              color: 'white',
              fontWeight: '700',
              letterSpacing: 0.4,
            }}
          >
            Booking
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
  }, [isLoggedIn, router]);

  const tabBarBg = isDark ? '#1C1C1E' : '#FFFFFF';
  const inactiveColor = isDark ? '#636366' : '#8E8E93';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: tabBarBg,
          borderTopWidth: Platform.OS === 'ios' ? 0 : 1,
          borderTopColor: isDark ? '#2C2C2E' : '#EBEBF0',
          height: Platform.OS === 'ios' ? 84 : 68,
          paddingBottom: Platform.OS === 'ios' ? 24 : 4,
          paddingTop: 0,
          overflow: 'visible',
          // iOS shadow
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 12,
          // Android shadow
          elevation: 20,
        },
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: inactiveColor,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={Home} color={color} focused={focused} label="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarButton: props => <BookingFABButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="mybooking"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={History}
              color={color}
              focused={focused}
              label="History"
            />
          ),
        }}
      />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
