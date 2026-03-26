import BookingCard from '@/components/booking/BookingCard';
import bookingService from '@/services/booking.service';
import { Booking } from '@/types/booking.type';
import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';
import { CalendarCheck } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyBookingScreen() {
  const isFocused = useIsFocused();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await bookingService.getMyBookings();
      setBookings(res.metadata ?? []);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) fetchBookings();
  }, [isFocused, fetchBookings]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="px-5 pt-2 pb-3 bg-gray-50">
        <View className="flex-row items-center gap-2 mb-1">
          <CalendarCheck size={22} color="#5B4FE9" strokeWidth={2} />
          <Text className="text-xl font-extrabold text-gray-900">
            My Bookings
          </Text>
        </View>
        <Text className="text-xs text-gray-400">
          Manage all your booking requests
        </Text>
      </View>

      {/* List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#5B4FE9" />
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={b => b.id}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 24,
            flexGrow: 1,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchBookings(true)}
              colors={['#5B4FE9']}
              tintColor="#5B4FE9"
            />
          }
          renderItem={({ item }) => (
            <BookingCard
              item={item}
              onPress={() =>
                router.push({
                  pathname: '/(modals)/booking-detail' as any,
                  params: { bookingId: item.id },
                })
              }
            />
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <CalendarCheck size={48} color="#D1D5DB" strokeWidth={1.2} />
              <Text className="text-gray-400 text-sm mt-4 font-medium">
                No bookings found
              </Text>
              <Text className="text-gray-300 text-xs mt-1">
                Pull down to refresh
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
