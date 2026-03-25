import ExtrasSelection from '@/components/booking/ExtrasSelection';
import PaymentWebView from '@/components/booking/PaymentWebView';
import ReviewBooking from '@/components/booking/ReviewBooking';
import StepIndicator from '@/components/booking/StepIndicator';
import TimeSelection from '@/components/booking/TimeSelection';
import bookingService from '@/services/booking.service';
import roomService from '@/services/room.service';
import { RoomDetail } from '@/types/room.type';
import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type BookingForm = {
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  amenityIds: string[];
  services: { serviceId: string; quantity: number }[];
};

const STEP_TITLES = ['Select Time', 'Add Extras', 'Review Booking'];

export default function BookingScreen() {
  const params = useLocalSearchParams<{
    roomId: string;
    roomName: string;
    roomCode: string;
    pricePerHour: string;
    securityDeposit: string;
    capacity: string;
  }>();

  const [currentStep, setCurrentStep] = useState(1);
  const [roomDetail, setRoomDetail] = useState<RoomDetail | null>(null);
  const [loadingRoom, setLoadingRoom] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);
  const [bookingMeta, setBookingMeta] = useState<{
    roomName: string;
    roomCode: string;
    amount: string;
    startTime: string;
    endTime: string;
  } | null>(null);

  const [form, setForm] = useState<BookingForm>({
    roomId: params.roomId ?? '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    amenityIds: [],
    services: [],
  });

  const updateForm = useCallback((updates: Partial<BookingForm>) => {
    setForm(prev => ({ ...prev, ...updates }));
  }, []);

  const fetchRoomDetail = async () => {
    if (roomDetail) return;
    setLoadingRoom(true);
    try {
      const res = await roomService.getRoomById(params.roomId);
      setRoomDetail(res.metadata.room);
    } catch {
      Alert.alert('Error', 'Failed to load room extras.');
    } finally {
      setLoadingRoom(false);
    }
  };

  const goNext = async () => {
    if (currentStep === 1) {
      await fetchRoomDetail();
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const goBack = () => {
    if (currentStep === 1) {
      router.back();
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Listen for deep-link redirects from the payment sandbox
  useEffect(() => {
    const sub = Linking.addEventListener('url', ({ url }) => {
      const parsed = Linking.parse(url);
      const bId =
        (parsed.queryParams?.bookingId as string | undefined) ??
        createdBookingId ??
        '';

      if (url.includes('payment/success')) {
        router.replace({
          pathname: '/(modals)/booking-success' as any,
          params: {
            bookingId: bId,
            roomName: bookingMeta?.roomName ?? '',
            roomCode: bookingMeta?.roomCode ?? '',
            amount: bookingMeta?.amount ?? '0',
            startTime: bookingMeta?.startTime ?? '',
            endTime: bookingMeta?.endTime ?? '',
          },
        });
      } else if (
        url.includes('payment/failed') ||
        url.includes('payment/cancel')
      ) {
        router.replace({
          pathname: '/(modals)/booking-failed' as any,
          params: { bookingId: bId },
        });
      }
    });
    return () => sub.remove();
  }, [createdBookingId]);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const payload = {
        roomId: form.roomId,
        startTime: form.startTime,
        endTime: form.endTime,
        purpose: form.purpose,
        amenityIds: form.amenityIds,
        services: form.services,
        locale: 'vn',
      };
      console.log(
        '[Booking] Submitting payload:',
        JSON.stringify(payload, null, 2)
      );
      const res = await bookingService.createBooking(payload);
      const booking = res.metadata;
      setCreatedBookingId(booking.bookingRequestId);
      setPaymentUrl(booking.paymentUrl);
      setBookingMeta({
        roomName: params.roomName ?? booking.roomName ?? '',
        roomCode: params.roomCode ?? '',
        amount: String(booking.amount ?? 0),
        startTime: form.startTime,
        endTime: form.endTime,
      });
    } catch (err: any) {
      const serverMsg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to create booking. Please try again.';
      console.error('[Booking] Error:', err?.response?.data ?? err);
      Alert.alert('Booking Error', serverMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (paymentUrl) {
    return (
      <PaymentWebView
        paymentUrl={paymentUrl}
        onSuccess={bookingId =>
          router.replace({
            pathname: '/(modals)/booking-success' as any,
            params: {
              bookingId: bookingId || createdBookingId || '',
              roomName: bookingMeta?.roomName ?? '',
              roomCode: bookingMeta?.roomCode ?? '',
              amount: bookingMeta?.amount ?? '0',
              startTime: bookingMeta?.startTime ?? '',
              endTime: bookingMeta?.endTime ?? '',
            },
          })
        }
        onFailed={() =>
          router.replace({
            pathname: '/(modals)/booking-failed' as any,
            params: { bookingId: createdBookingId ?? '' },
          })
        }
        onCancel={() => setPaymentUrl(null)}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center px-4 pt-2 pb-3 border-b border-gray-100">
        <TouchableOpacity
          onPress={goBack}
          className="w-9 h-9 items-center justify-center rounded-full bg-gray-100"
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color="#374151" strokeWidth={2} />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-base font-bold text-gray-900">
          {STEP_TITLES[currentStep - 1]}
        </Text>
        <View className="w-9" />
      </View>

      {/* Step indicator */}
      <StepIndicator currentStep={currentStep} totalSteps={3} />

      {/* Room badge */}
      <View className="mx-4 mb-2 px-3 py-2 bg-[#EEF0FF] rounded-xl flex-row items-center">
        <Text
          className="text-xs font-semibold text-[#5B4FE9] flex-1"
          numberOfLines={1}
        >
          {params.roomName}
        </Text>
        <Text className="text-xs text-[#5B4FE9] opacity-60 ml-2">
          {params.roomCode}
        </Text>
      </View>

      {currentStep === 1 ? (
        <TimeSelection
          value={{
            date: form.date,
            startTime: form.startTime,
            endTime: form.endTime,
            purpose: form.purpose,
          }}
          onChange={updateForm}
          onNext={goNext}
        />
      ) : currentStep === 2 ? (
        loadingRoom ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#5B4FE9" />
            <Text className="text-gray-400 text-sm mt-3">
              Loading extras...
            </Text>
          </View>
        ) : (
          <ExtrasSelection
            amenities={roomDetail?.amenities ?? []}
            serviceCategories={roomDetail?.serviceCategories ?? []}
            value={{ amenityIds: form.amenityIds, services: form.services }}
            onChange={updateForm}
            onNext={goNext}
            onSkip={goNext}
          />
        )
      ) : (
        <ReviewBooking
          bookingData={form}
          roomDetail={roomDetail}
          onConfirm={handleConfirm}
          onBack={goBack}
          submitting={submitting}
        />
      )}
    </SafeAreaView>
  );
}
