import BookingDetailCard from '@/components/booking/BookingDetailCard';
import bookingService from '@/services/booking.service';
import { Booking } from '@/types/booking.type';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingDetailScreen() {
  const params = useLocalSearchParams<{
    bookingId?: string;
    roomName?: string;
    roomCode?: string;
    amount?: string;
    startTime?: string;
    endTime?: string;
  }>();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!params.bookingId) {
      setLoading(false);
      setError(true);
      return;
    }
    bookingService
      .getBookingById(params.bookingId)
      .then(res => setBooking(res.metadata))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params.bookingId]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center gap-3 px-5 pt-2 pb-3 bg-gray-50">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="w-9 h-9 rounded-full bg-white border border-gray-100 items-center justify-center"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <ArrowLeft size={18} color="#374151" strokeWidth={2} />
        </TouchableOpacity>
        <Text className="text-lg font-extrabold text-gray-900">
          Booking Detail
        </Text>
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#5B4FE9" />
        </View>
      ) : booking ? (
        <BookingDetailCard booking={booking} />
      ) : (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-gray-400 text-sm text-center">
            {error
              ? 'Failed to load booking details.'
              : 'No booking data found.'}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-4 px-6 py-3 rounded-2xl bg-[#5B4FE9]"
          >
            <Text className="text-white font-semibold text-sm">Go Back</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
