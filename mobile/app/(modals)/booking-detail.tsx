import BookingDetailCard from '@/components/booking/BookingDetailCard';
import { Booking, BookingStatus } from '@/types/booking.type';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingDetailScreen() {
  const params = useLocalSearchParams<{
    bookingJson?: string;
    bookingId?: string;
    roomName?: string;
    roomCode?: string;
    amount?: string;
    startTime?: string;
    endTime?: string;
  }>();

  const booking = useMemo<Booking | null>(() => {
    // From mybooking list — full object serialized as JSON
    if (params.bookingJson) {
      try {
        return JSON.parse(params.bookingJson) as Booking;
      } catch {
        return null;
      }
    }
    // From booking-success — construct from individual params
    if (params.bookingId) {
      return {
        id: params.bookingId,
        userId: '',
        roomId: '',
        startTime: params.startTime ?? '',
        endTime: params.endTime ?? '',
        purpose: '',
        status: BookingStatus.PENDING,
        room: {
          id: '',
          name: params.roomName ?? '—',
          roomCode: params.roomCode ?? '',
        },
        user: { id: '', name: '', email: '' },
        amenities: [],
        services: [],
        totalCost: Number(params.amount ?? 0),
      };
    }
    return null;
  }, [params]);

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
      {booking ? (
        <BookingDetailCard booking={booking} />
      ) : (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-gray-400 text-sm text-center">
            No booking data found.
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
