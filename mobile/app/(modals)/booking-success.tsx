import bookingService from '@/services/booking.service';
import { Booking } from '@/types/booking.type';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Home,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function formatDate(iso: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(iso: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function shortId(id: string): string {
  return id ? `#${id.slice(0, 8).toUpperCase()}` : '—';
}

export default function BookingSuccessScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }
    bookingService
      .getBookingById(bookingId)
      .then(res => setBooking(res.metadata))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [bookingId]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center px-6">
        {/* Success icon */}
        <View className="w-24 h-24 rounded-full bg-green-50 items-center justify-center mb-6">
          <CheckCircle2 size={52} color="#22C55E" strokeWidth={1.5} />
        </View>

        <Text className="text-2xl font-extrabold text-gray-900 text-center mb-1">
          Booking Confirmed!
        </Text>
        <Text className="text-sm text-gray-400 text-center mb-8">
          Your booking request has been submitted successfully.
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#5B4FE9" />
        ) : booking ? (
          <View
            className="w-full bg-white border border-gray-100 rounded-3xl p-5 gap-4"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.07,
              shadowRadius: 10,
              elevation: 4,
            }}
          >
            {/* Booking ID */}
            <View className="items-center pb-4 border-b border-gray-100">
              <Text className="text-xs text-gray-400 font-medium mb-0.5">
                Booking ID
              </Text>
              <Text className="text-base font-bold text-[#5B4FE9] tracking-wider">
                {shortId(booking.id)}
              </Text>
            </View>

            {/* Room name */}
            <View className="pb-3 border-b border-gray-100">
              <Text className="text-xs text-gray-400 font-medium mb-0.5">
                Room
              </Text>
              <Text
                className="text-sm font-bold text-gray-900"
                numberOfLines={1}
              >
                {booking.room?.name ?? '—'}
              </Text>
              <Text className="text-xs text-[#5B4FE9] font-semibold mt-0.5">
                {booking.room?.roomCode ?? ''}
              </Text>
            </View>

            {/* Date & Time */}
            <View className="flex-row gap-3 pb-3 border-b border-gray-100">
              <View className="flex-1">
                <View className="flex-row items-center gap-1 mb-0.5">
                  <Calendar size={12} color="#9CA3AF" strokeWidth={2} />
                  <Text className="text-xs text-gray-400 font-medium">
                    Date
                  </Text>
                </View>
                <Text className="text-sm font-semibold text-gray-900">
                  {formatDate(booking.startTime)}
                </Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-1 mb-0.5">
                  <Clock size={12} color="#9CA3AF" strokeWidth={2} />
                  <Text className="text-xs text-gray-400 font-medium">
                    Time
                  </Text>
                </View>
                <Text className="text-sm font-semibold text-gray-900">
                  {formatTime(booking.startTime)} –{' '}
                  {formatTime(booking.endTime)}
                </Text>
              </View>
            </View>

            {/* Total cost */}
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-500 font-medium">
                Total Cost
              </Text>
              <Text className="text-lg font-extrabold text-[#5B4FE9]">
                ${booking.totalCost?.toFixed(2) ?? '0.00'}
              </Text>
            </View>
          </View>
        ) : (
          <View className="bg-gray-50 rounded-2xl px-6 py-4">
            <Text className="text-sm text-gray-400 text-center">
              Booking ID: {shortId(bookingId ?? '')}
            </Text>
          </View>
        )}
      </View>

      {/* CTA Buttons */}
      <View className="px-6 pb-4 gap-3">
        <TouchableOpacity
          onPress={() =>
            router.replace({
              pathname: '/(modals)/room-detail' as any,
              params: { bookingId },
            })
          }
          activeOpacity={0.85}
          className="flex-row items-center justify-center gap-2 rounded-2xl py-4"
          style={{
            backgroundColor: '#5B4FE9',
            shadowColor: '#5B4FE9',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <Text className="text-white font-bold text-base">
            View Booking Detail
          </Text>
          <ArrowRight size={18} color="white" strokeWidth={2.5} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace('/(tabs)/home')}
          activeOpacity={0.7}
          className="flex-row items-center justify-center gap-2 rounded-2xl py-4 border border-gray-200"
        >
          <Home size={18} color="#374151" strokeWidth={2} />
          <Text className="text-gray-700 font-semibold text-base">
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
