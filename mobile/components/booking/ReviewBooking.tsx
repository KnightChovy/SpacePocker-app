import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  FileText,
  Package,
  Sparkles,
  Users,
} from 'lucide-react-native';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { RoomDetail } from '@/types/room.type';

type ServiceEntry = { serviceId: string; quantity: number };

type BookingData = {
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  amenityIds: string[];
  services: ServiceEntry[];
};

type Props = {
  bookingData: BookingData;
  roomDetail: RoomDetail | null;
  onConfirm: () => void;
  onBack: () => void;
  submitting: boolean;
};

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
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

function getDurationHours(start: string, end: string): number {
  if (!start || !end) return 0;
  return (new Date(end).getTime() - new Date(start).getTime()) / 3600000;
}

const cardStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 3,
};

function SectionLabel({ title }: { title: string }) {
  return (
    <Text className="text-xs font-semibold text-[#5B4FE9] uppercase tracking-wider mb-3">
      {title}
    </Text>
  );
}

function DetailRow({
  icon,
  label,
  value,
  last,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View
      className={`flex-row items-start gap-3 py-3 ${last ? '' : 'border-b border-gray-50'}`}
    >
      <View className="w-8 h-8 rounded-xl bg-[#EEF0FF] items-center justify-center mt-0.5">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-xs text-gray-400 font-medium">{label}</Text>
        <Text className="text-sm text-gray-900 font-semibold mt-0.5">
          {value}
        </Text>
      </View>
    </View>
  );
}

function CostRow({
  label,
  value,
  sub,
  bold,
  last,
}: {
  label: string;
  value: string;
  sub?: string;
  bold?: boolean;
  last?: boolean;
}) {
  return (
    <View
      className={`flex-row justify-between items-center py-2.5 ${last ? '' : 'border-b border-gray-50'}`}
    >
      <View className="flex-1 mr-2">
        <Text
          className={`${bold ? 'text-base font-bold text-gray-900' : 'text-sm text-gray-600'}`}
        >
          {label}
        </Text>
        {sub ? (
          <Text className="text-xs text-gray-400 mt-0.5">{sub}</Text>
        ) : null}
      </View>
      <Text
        className={`${bold ? 'text-xl font-extrabold text-[#5B4FE9]' : 'text-sm font-semibold text-gray-900'}`}
      >
        {value}
      </Text>
    </View>
  );
}

export default function ReviewBooking({
  bookingData,
  roomDetail,
  onConfirm,
  onBack,
  submitting,
}: Props) {
  const duration = getDurationHours(bookingData.startTime, bookingData.endTime);
  const pricePerHour = roomDetail?.pricePerHour ?? 0;
  const securityDeposit = roomDetail?.securityDeposit ?? 0;
  const roomCost = duration * pricePerHour;
  const totalCost = roomCost + securityDeposit;

  const selectedAmenities =
    roomDetail?.amenities.filter(({ amenity }) =>
      bookingData.amenityIds.includes(amenity.id)
    ) ?? [];

  const selectedServices = bookingData.services
    .map(s => {
      const cat = roomDetail?.serviceCategories.find(
        c => c.category.id === s.serviceId
      );
      return cat ? { name: cat.category.name, quantity: s.quantity } : null;
    })
    .filter((v): v is { name: string; quantity: number } => v !== null);

  const coverImage = roomDetail?.images?.[0];

  return (
    <View className="flex-1 bg-[#F7F8FF]">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 24 }}
      >
        {/* ── Room Summary ── */}
        <View
          className="bg-white rounded-3xl overflow-hidden border border-gray-100"
          style={cardStyle}
        >
          {coverImage ? (
            <Image
              source={{ uri: coverImage }}
              className="w-full h-36"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-36 bg-[#EEF0FF] items-center justify-center">
              <Building2 size={40} color="#5B4FE9" strokeWidth={1.5} />
            </View>
          )}
          <View className="p-4">
            <Text
              className="text-lg font-extrabold text-gray-900"
              numberOfLines={1}
            >
              {roomDetail?.name ?? '—'}
            </Text>
            <View className="flex-row items-center gap-3 mt-1.5 flex-wrap">
              <View className="flex-row items-center gap-1">
                <Text className="text-xs text-[#5B4FE9] font-semibold bg-[#EEF0FF] px-2 py-0.5 rounded-full">
                  {roomDetail?.roomCode ?? '—'}
                </Text>
              </View>
              {(roomDetail?.capacity ?? 0) > 0 && (
                <View className="flex-row items-center gap-1">
                  <Users size={12} color="#9CA3AF" strokeWidth={2} />
                  <Text className="text-xs text-gray-400">
                    Up to {roomDetail?.capacity} people
                  </Text>
                </View>
              )}
              {roomDetail?.building?.buildingName ? (
                <View className="flex-row items-center gap-1">
                  <Building2 size={12} color="#9CA3AF" strokeWidth={2} />
                  <Text className="text-xs text-gray-400">
                    {roomDetail.building.buildingName}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {/* ── Booking Details ── */}
        <View
          className="bg-white rounded-3xl px-4 pt-4 pb-1 border border-gray-100"
          style={cardStyle}
        >
          <SectionLabel title="Booking Details" />
          <DetailRow
            icon={<Calendar size={14} color="#5B4FE9" strokeWidth={2} />}
            label="Date"
            value={formatDate(bookingData.date)}
          />
          <DetailRow
            icon={<Clock size={14} color="#5B4FE9" strokeWidth={2} />}
            label="Time"
            value={`${formatTime(bookingData.startTime)} – ${formatTime(bookingData.endTime)}`}
          />
          <DetailRow
            icon={<Clock size={14} color="#5B4FE9" strokeWidth={2} />}
            label="Duration"
            value={
              duration > 0
                ? `${duration} hour${duration !== 1 ? 's' : ''}`
                : '—'
            }
            last={!bookingData.purpose}
          />
          {bookingData.purpose ? (
            <DetailRow
              icon={<FileText size={14} color="#5B4FE9" strokeWidth={2} />}
              label="Purpose"
              value={bookingData.purpose}
              last
            />
          ) : null}
        </View>

        {/* ── Selected Amenities ── */}
        {selectedAmenities.length > 0 && (
          <View
            className="bg-white rounded-3xl px-4 pt-4 pb-3 border border-gray-100"
            style={cardStyle}
          >
            <SectionLabel title="Amenities" />
            <View className="flex-row flex-wrap gap-2">
              {selectedAmenities.map(({ amenity }) => (
                <View
                  key={amenity.id}
                  className="flex-row items-center gap-1.5 bg-[#EEF0FF] px-3 py-1.5 rounded-full"
                >
                  <Sparkles size={11} color="#5B4FE9" strokeWidth={2} />
                  <Text className="text-xs font-semibold text-[#5B4FE9]">
                    {amenity.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Selected Services ── */}
        {selectedServices.length > 0 && (
          <View
            className="bg-white rounded-3xl px-4 pt-4 pb-3 border border-gray-100"
            style={cardStyle}
          >
            <SectionLabel title="Services" />
            <View className="gap-2">
              {selectedServices.map((s, i) => (
                <View
                  key={i}
                  className="flex-row items-center justify-between py-2 border-b border-gray-50"
                >
                  <View className="flex-row items-center gap-2">
                    <Package size={14} color="#6B7280" strokeWidth={2} />
                    <Text className="text-sm text-gray-700 font-medium">
                      {s.name}
                    </Text>
                  </View>
                  <Text className="text-sm font-semibold text-gray-900">
                    ×{s.quantity}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Cost Breakdown ── */}
        <View
          className="bg-white rounded-3xl px-4 pt-4 pb-2 border border-gray-100"
          style={cardStyle}
        >
          <SectionLabel title="Cost Breakdown" />
          <CostRow
            label="Thuê phòng"
            sub={`${pricePerHour.toLocaleString('vi-VN')}đ/giờ × ${duration}h`}
            value={`${roomCost.toLocaleString('vi-VN')}đ`}
          />
          <CostRow
            label="Tiền đặt cọc"
            sub="Hoàn trả sau khi trả phòng"
            value={`${securityDeposit.toLocaleString('vi-VN')}đ`}
          />
          <View className="border-t border-gray-200 mt-1 pt-1">
            <CostRow
              label="Tổng cộng"
              value={`${totalCost.toLocaleString('vi-VN')}đ`}
              bold
              last
            />
          </View>
        </View>

        {/* ── Amber Notice ── */}
        <View className="flex-row items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <AlertCircle size={16} color="#D97706" strokeWidth={2} />
          <Text className="flex-1 text-xs text-amber-700 leading-4">
            <Text className="font-bold">Sandbox mode:</Text> No real payment is
            processed. Use test card{' '}
            <Text className="font-semibold">4242 4242 4242 4242</Text> with any
            future expiry and CVC.
          </Text>
        </View>
      </ScrollView>

      {/* ── Bottom Bar ── */}
      <View
        className="px-4 py-3 bg-white border-t border-gray-100 flex-row gap-3"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <TouchableOpacity
          onPress={onBack}
          disabled={submitting}
          activeOpacity={0.7}
          className="h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white"
        >
          <ArrowLeft size={20} color="#374151" strokeWidth={2} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onConfirm}
          disabled={submitting}
          activeOpacity={0.85}
          className="flex-1 h-14 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: '#5B4FE9',
            shadowColor: '#5B4FE9',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.35,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-bold text-base">
              Confirm &amp; Pay
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
