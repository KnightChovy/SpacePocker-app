import BookingFooter from '@/components/room/BookingFooter';
import ImageCarousel from '@/components/room/ImageCarousel';
import ManagerCard from '@/components/room/ManagerCard';
import RoomFeatures from '@/components/room/RoomFeatures';
import RoomInfoHeader from '@/components/room/RoomInfoHeader';
import RoomStats from '@/components/room/RoomStats';
import roomService from '@/services/room.service';
import { RoomDetail } from '@/types/room.type';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Share2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RoomDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [room, setRoom] = useState<RoomDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    roomService
      .getRoomById(id)
      .then(res => setRoom(res.metadata.room))
      .catch(() => setError('Failed to load room details.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#5B4FE9" />
        <Text className="text-gray-400 text-sm mt-3">Loading room...</Text>
      </SafeAreaView>
    );
  }

  if (error || !room) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-8">
        <Text className="text-gray-900 font-bold text-lg mb-2">Oops!</Text>
        <Text className="text-gray-400 text-sm text-center mb-6">
          {error ?? 'Room not found.'}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-[#5B4FE9] px-6 py-3 rounded-2xl"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Floating header over carousel */}
      <View
        className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between px-4 pt-12 pb-3"
        style={{ pointerEvents: 'box-none' }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-black/30 items-center justify-center"
          activeOpacity={0.8}
          style={{ pointerEvents: 'auto' }}
        >
          <ChevronLeft size={22} color="white" strokeWidth={2} />
        </TouchableOpacity>

        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-black/30 items-center justify-center"
          activeOpacity={0.8}
          style={{ pointerEvents: 'auto' }}
        >
          <Share2 size={18} color="white" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Image Carousel — full bleed */}
        <ImageCarousel images={room.images} height={300} />

        {/* White card content */}
        <View className="bg-white rounded-t-3xl -mt-6 pb-4">
          {/* Name, code, building, availability */}
          <RoomInfoHeader room={room} />

          {/* Divider */}
          <View className="h-px bg-gray-100 mx-5 mb-5" />

          {/* Stats: capacity, area, price, deposit */}
          <RoomStats room={room} />

          {/* Description */}
          {room.description && (
            <View className="px-5 mb-5">
              <Text className="text-base font-bold text-gray-900 mb-2">
                About this space
              </Text>
              <Text className="text-sm text-gray-500 leading-relaxed">
                {room.description}
              </Text>
            </View>
          )}

          {/* Amenities + Service Categories */}
          <RoomFeatures room={room} />

          {/* Manager info */}
          <ManagerCard manager={room.manager} />

          {/* Bottom padding for footer */}
          <View className="h-2" />
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} className="bg-white">
        <BookingFooter
          room={room}
          onBookPress={() =>
            router.push({
              pathname: '/(modals)/booking' as any,
              params: { roomId: room.id },
            })
          }
        />
      </SafeAreaView>
    </View>
  );
}
