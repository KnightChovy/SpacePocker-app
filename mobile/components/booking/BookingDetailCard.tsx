import { STATUS_META } from '@/components/booking/BookingCard';
import { Booking } from '@/types/booking.type';
import {
  Banknote,
  Building2,
  Calendar,
  Clock,
  FileText,
  Hash,
  Mail,
  Tag,
  User,
} from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

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

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-start gap-3 py-3 border-b border-gray-50">
      <View className="mt-0.5">{icon}</View>
      <View className="flex-1">
        <Text className="text-[11px] text-gray-400 font-medium mb-0.5">
          {label}
        </Text>
        <Text className="text-sm font-semibold text-gray-800">{value}</Text>
      </View>
    </View>
  );
}

type Props = { booking: Booking };

export default function BookingDetailCard({ booking }: Props) {
  const status = STATUS_META[booking.status];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {/* Status banner */}
      <View
        className="mx-5 mt-4 mb-5 rounded-2xl px-5 py-4 flex-row items-center justify-between"
        style={{ backgroundColor: status.bg }}
      >
        <View>
          <Text
            className="text-[11px] font-medium"
            style={{ color: status.text, opacity: 0.7 }}
          >
            Status
          </Text>
          <Text
            className="text-lg font-extrabold"
            style={{ color: status.text }}
          >
            {status.label}
          </Text>
        </View>
        <View
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: status.text + '18' }}
        >
          <Tag size={22} color={status.text} strokeWidth={2} />
        </View>
      </View>

      {/* Main card */}
      <View
        className="mx-5 bg-white rounded-3xl px-5 pt-2 pb-4 border border-gray-100"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {/* Room */}
        <View className="py-3 border-b border-gray-50">
          <Text className="text-[11px] text-gray-400 font-medium mb-0.5">
            Room
          </Text>
          <Text className="text-base font-bold text-gray-900">
            {booking.room?.name ?? '—'}
          </Text>
          {booking.room?.roomCode ? (
            <Text className="text-xs text-[#5B4FE9] font-semibold mt-0.5">
              {booking.room.roomCode}
            </Text>
          ) : null}
        </View>

        {/* Building */}
        {booking.room?.building ? (
          <Row
            icon={<Building2 size={15} color="#9CA3AF" strokeWidth={1.8} />}
            label="Building"
            value={`${booking.room.building.buildingName}${booking.room.building.campus ? ` · ${booking.room.building.campus}` : ''}`}
          />
        ) : null}

        {/* Date */}
        <Row
          icon={<Calendar size={15} color="#9CA3AF" strokeWidth={1.8} />}
          label="Date"
          value={formatDate(booking.startTime)}
        />

        {/* Time */}
        <Row
          icon={<Clock size={15} color="#9CA3AF" strokeWidth={1.8} />}
          label="Time"
          value={`${formatTime(booking.startTime)} – ${formatTime(booking.endTime)}`}
        />

        {/* Purpose */}
        {booking.purpose ? (
          <Row
            icon={<FileText size={15} color="#9CA3AF" strokeWidth={1.8} />}
            label="Purpose"
            value={booking.purpose}
          />
        ) : null}

        {/* Booked by */}
        {booking.user ? (
          <>
            <Row
              icon={<User size={15} color="#9CA3AF" strokeWidth={1.8} />}
              label="Booked by"
              value={booking.user.name ?? '—'}
            />
            <Row
              icon={<Mail size={15} color="#9CA3AF" strokeWidth={1.8} />}
              label="Email"
              value={booking.user.email ?? '—'}
            />
          </>
        ) : null}

        {/* Total cost */}
        {booking.totalCost != null ? (
          <Row
            icon={<Banknote size={15} color="#9CA3AF" strokeWidth={1.8} />}
            label="Total Cost"
            value={
              booking.totalCost > 0
                ? booking.totalCost.toLocaleString('vi-VN') + 'đ'
                : 'Free'
            }
          />
        ) : null}

        {/* Booking ID */}
        <View className="py-3">
          <View className="flex-row items-center gap-2">
            <Hash size={13} color="#D1D5DB" strokeWidth={1.8} />
            <Text className="text-[10px] text-gray-300 font-mono">
              {booking.id}
            </Text>
          </View>
        </View>
      </View>

      {/* Amenities */}
      {booking.amenities && booking.amenities.length > 0 ? (
        <View className="mx-5 mt-4">
          <Text className="text-sm font-bold text-gray-700 mb-2 px-1">
            Amenities
          </Text>
          <View className="bg-white rounded-2xl px-4 py-2 border border-gray-100">
            {booking.amenities.map((a, i) => (
              <View
                key={a.id}
                className={`py-2.5 flex-row items-center gap-2${i < booking.amenities.length - 1 ? ' border-b border-gray-50' : ''}`}
              >
                <View className="w-1.5 h-1.5 rounded-full bg-[#5B4FE9]" />
                <Text className="text-sm text-gray-700">{a.name}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* Services */}
      {booking.services && booking.services.length > 0 ? (
        <View className="mx-5 mt-4">
          <Text className="text-sm font-bold text-gray-700 mb-2 px-1">
            Services
          </Text>
          <View className="bg-white rounded-2xl px-4 py-2 border border-gray-100">
            {booking.services.map((s, i) => (
              <View
                key={s.serviceId}
                className={`py-2.5 flex-row items-center justify-between${i < booking.services.length - 1 ? ' border-b border-gray-50' : ''}`}
              >
                <View className="flex-row items-center gap-2 flex-1">
                  <View className="w-1.5 h-1.5 rounded-full bg-[#5B4FE9]" />
                  <Text
                    className="text-sm text-gray-700 flex-1"
                    numberOfLines={1}
                  >
                    {s.name}
                  </Text>
                </View>
                <Text className="text-xs text-gray-400 ml-2">
                  ×{s.quantity}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}
