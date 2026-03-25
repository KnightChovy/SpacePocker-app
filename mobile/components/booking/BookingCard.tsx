import { Booking, BookingStatus } from '@/types/booking.type';
import { Building2, Calendar, Clock, MapPin } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export const STATUS_META: Record<
  BookingStatus,
  { bg: string; text: string; label: string }
> = {
  PENDING: { bg: '#FEF9C3', text: '#854D0E', label: 'Pending' },
  APPROVED: { bg: '#DCFCE7', text: '#166534', label: 'Approved' },
  CONFIRMED: { bg: '#EEF0FF', text: '#3730A3', label: 'Confirmed' },
  REJECTED: { bg: '#FEE2E2', text: '#991B1B', label: 'Rejected' },
  CANCELLED: { bg: '#F3F4F6', text: '#6B7280', label: 'Cancelled' },
};

function formatDate(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

type Props = { item: Booking; onPress?: () => void };

export default function BookingCard({ item, onPress }: Props) {
  const status = STATUS_META[item.status];

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.75 : 1}
      onPress={onPress}
      className="bg-white rounded-3xl mb-3 overflow-hidden border border-gray-100"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-3 border-b border-gray-50">
        <View className="flex-1 mr-3">
          <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
            {item.room?.name ?? '—'}
          </Text>
          <Text className="text-xs text-[#5B4FE9] font-semibold mt-0.5">
            {item.room?.roomCode ?? ''}
          </Text>
        </View>
        <View
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: status.bg }}
        >
          <Text className="text-xs font-bold" style={{ color: status.text }}>
            {status.label}
          </Text>
        </View>
      </View>

      {/* Body */}
      <View className="px-4 py-3 gap-2">
        {item.room?.building && (
          <View className="flex-row items-center gap-2">
            <Building2 size={13} color="#9CA3AF" strokeWidth={1.8} />
            <Text className="text-xs text-gray-500 flex-1" numberOfLines={1}>
              {item.room.building.buildingName}
              {item.room.building.campus
                ? ` · ${item.room.building.campus}`
                : ''}
            </Text>
          </View>
        )}

        <View className="flex-row items-center gap-2">
          <Calendar size={13} color="#9CA3AF" strokeWidth={1.8} />
          <Text className="text-xs text-gray-500">
            {formatDate(item.startTime)}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <Clock size={13} color="#9CA3AF" strokeWidth={1.8} />
          <Text className="text-xs text-gray-500">
            {formatTime(item.startTime)} – {formatTime(item.endTime)}
          </Text>
        </View>

        {item.purpose ? (
          <View className="flex-row items-start gap-2">
            <MapPin
              size={13}
              color="#9CA3AF"
              strokeWidth={1.8}
              style={{ marginTop: 1 }}
            />
            <Text className="text-xs text-gray-500 flex-1" numberOfLines={2}>
              {item.purpose}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Footer */}
      <View className="px-4 pb-3">
        <Text className="text-[10px] text-gray-300 font-mono">
          #{item.id.slice(0, 16).toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
