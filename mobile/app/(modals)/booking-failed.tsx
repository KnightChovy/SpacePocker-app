import bookingService from '@/services/booking.service';
import { router, useLocalSearchParams } from 'expo-router';
import { Home, RefreshCw, XCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingFailedScreen() {
  const { bookingId, reason } = useLocalSearchParams<{
    bookingId?: string;
    reason?: string;
  }>();
  const [cancelling, setCancelling] = useState(false);

  const handleCancelBooking = async () => {
    if (!bookingId) {
      router.replace('/(tabs)/home');
      return;
    }

    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, cancel',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            try {
              await bookingService.cancelBooking(bookingId);
            } catch {
              // Best-effort — navigate regardless
            } finally {
              setCancelling(false);
              router.replace('/(tabs)/home');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center px-6">
        {/* Failed icon */}
        <View className="w-24 h-24 rounded-full bg-red-50 items-center justify-center mb-6">
          <XCircle size={52} color="#EF4444" strokeWidth={1.5} />
        </View>

        <Text className="text-2xl font-extrabold text-gray-900 text-center mb-2">
          Payment Failed
        </Text>

        <Text className="text-sm text-gray-400 text-center leading-5 mb-8 px-4">
          {reason
            ? reason
            : 'Your payment could not be processed. Please try again or contact support if the issue persists.'}
        </Text>

        {/* Error detail card */}
        <View className="w-full bg-red-50 border border-red-100 rounded-2xl p-4 mb-2">
          <Text className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">
            What happened?
          </Text>
          <Text className="text-sm text-red-700 leading-5">
            The payment gateway was unable to authorise your transaction. Your
            booking remains pending and no charge has been made.
          </Text>
          {bookingId ? (
            <Text className="text-xs text-red-400 mt-2 font-medium">
              Booking ref: #{bookingId.slice(0, 8).toUpperCase()}
            </Text>
          ) : null}
        </View>
      </View>

      {/* CTA Buttons */}
      <View className="px-6 pb-4 gap-3">
        <TouchableOpacity
          onPress={() => router.back()}
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
          <RefreshCw size={18} color="white" strokeWidth={2.5} />
          <Text className="text-white font-bold text-base">Try Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCancelBooking}
          disabled={cancelling}
          activeOpacity={0.7}
          className="flex-row items-center justify-center gap-2 rounded-2xl py-4 border border-gray-200"
        >
          {cancelling ? (
            <ActivityIndicator size="small" color="#374151" />
          ) : (
            <>
              <Home size={18} color="#374151" strokeWidth={2} />
              <Text className="text-gray-700 font-semibold text-base">
                Cancel Booking
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
