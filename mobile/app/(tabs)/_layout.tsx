import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/store/authStore';
import { Tabs, useRouter } from 'expo-router';
import { CalendarCheck, History, Home } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

const ACTIVE_COLOR = '#4F6DF5';
const FAB_SIZE = 56;
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 70;

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
        paddingTop: 8,
        minWidth: 80,
        gap: 5,
      }}
    >
      <Icon color={color} size={22} strokeWidth={focused ? 2.4 : 1.8} />
      <Text
        numberOfLines={1}
        style={{
          fontSize: 11,
          fontWeight: focused ? '700' : '400',
          color,
          letterSpacing: 0.2,
        }}
      >
        {label}
      </Text>
      {/* Active dot indicator */}
      <View
        style={{
          width: focused ? 20 : 0,
          height: 3,
          borderRadius: 2,
          backgroundColor: ACTIVE_COLOR,
          marginTop: -2,
        }}
      />
    </View>
  );
}

function BookingFABButton({ onPress, accessibilityState }: any) {
  const focused = accessibilityState?.selected;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 0,
        top: -(FAB_SIZE / 2 + 6),
      }}
    >
      {/* Outer glow ring */}
      <View
        style={{
          width: FAB_SIZE + 10,
          height: FAB_SIZE + 10,
          borderRadius: (FAB_SIZE + 10) / 2,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: ACTIVE_COLOR,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: focused ? 0.45 : 0.3,
          shadowRadius: 18,
          elevation: 18,
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
          }}
        >
          <CalendarCheck size={26} color="white" strokeWidth={2} />
        </View>
      </View>
      <Text
        style={{
          fontSize: 10,
          fontWeight: '600',
          color: focused ? ACTIVE_COLOR : '#8E8E93',
          marginTop: 4,
          letterSpacing: 0.3,
        }}
      >
        Booking
      </Text>
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
  const inactiveColor = isDark ? '#636366' : '#AEAEB2';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: tabBarBg,
          borderTopWidth: 0,
          height: TAB_BAR_HEIGHT,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 0,
          overflow: 'visible',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDark ? 0.25 : 0.06,
          shadowRadius: 16,
          elevation: 24,
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
