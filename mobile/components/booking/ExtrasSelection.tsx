import {
  ArrowRight,
  Car,
  Check,
  Coffee,
  Minus,
  Monitor,
  Package,
  Plus,
  SkipForward,
  Sparkles,
  Speaker,
  Utensils,
  Wifi,
  Wind,
} from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { RoomAmenity, RoomServiceCategory } from '@/types/room.type';

export type ExtrasValue = {
  amenityIds: string[];
  services: { serviceId: string; quantity: number }[];
};

type Props = {
  amenities: RoomAmenity[];
  serviceCategories: RoomServiceCategory[];
  value: ExtrasValue;
  onChange: (updates: Partial<ExtrasValue>) => void;
  onNext: () => void;
  onSkip: () => void;
};

// ─── Icon mapper ──────────────────────────────────────────────────────────────

function getAmenityIcon(name: string) {
  const l = name.toLowerCase();
  if (l.includes('wifi') || l.includes('internet')) return Wifi;
  if (l.includes('projector') || l.includes('screen') || l.includes('monitor'))
    return Monitor;
  if (l.includes('coffee') || l.includes('tea')) return Coffee;
  if (l.includes('air') || l.includes('ac') || l.includes('condition'))
    return Wind;
  if (l.includes('parking')) return Car;
  if (l.includes('speaker') || l.includes('audio') || l.includes('sound'))
    return Speaker;
  if (l.includes('food') || l.includes('catering') || l.includes('meal'))
    return Utensils;
  return Package;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ExtrasSelection({
  amenities,
  serviceCategories,
  value,
  onChange,
  onNext,
  onSkip,
}: Props) {
  // ── Amenity helpers ──
  const toggleAmenity = (id: string) => {
    const next = value.amenityIds.includes(id)
      ? value.amenityIds.filter(a => a !== id)
      : [...value.amenityIds, id];
    onChange({ amenityIds: next });
  };

  // ── Service helpers ──
  const MAX_QTY = 10;

  const getQty = (serviceId: string) =>
    value.services.find(s => s.serviceId === serviceId)?.quantity ?? 0;

  const setQty = (serviceId: string, qty: number) => {
    if (qty <= 0) {
      onChange({
        services: value.services.filter(s => s.serviceId !== serviceId),
      });
    } else {
      const exists = value.services.find(s => s.serviceId === serviceId);
      onChange({
        services: exists
          ? value.services.map(s =>
              s.serviceId === serviceId ? { ...s, quantity: qty } : s
            )
          : [...value.services, { serviceId, quantity: qty }],
      });
    }
  };

  // ── Running total ──
  const runningTotal = value.services.reduce((sum, entry) => {
    for (const rsc of serviceCategories) {
      const svc = rsc.category.services?.find(s => s.id === entry.serviceId);
      if (svc) return sum + svc.price * entry.quantity;
    }
    return sum;
  }, 0);

  const hasServices = serviceCategories.some(
    c => (c.category.services?.length ?? 0) > 0
  );

  const hasAnything = amenities.length > 0 || hasServices;

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
      >
        {!hasAnything && (
          <View className="items-center py-16">
            <Package size={40} color="#D1D5DB" strokeWidth={1.5} />
            <Text className="text-gray-400 text-sm mt-3 text-center">
              No extras available for this room
            </Text>
          </View>
        )}

        {/* ── Amenities ── */}
        {amenities.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center mb-1">
              <Sparkles size={16} color="#5B4FE9" strokeWidth={2} />
              <Text className="text-sm font-bold text-gray-900 ml-2">
                Included Amenities
              </Text>
            </View>
            <Text className="text-xs text-gray-400 mb-4">
              Tap to select amenities you&apos;ll use
            </Text>
            <View className="gap-2">
              {amenities.map(({ amenity }) => {
                const selected = value.amenityIds.includes(amenity.id);
                const Icon = getAmenityIcon(amenity.name);
                return (
                  <TouchableOpacity
                    key={amenity.id}
                    onPress={() => toggleAmenity(amenity.id)}
                    activeOpacity={0.8}
                    className="flex-row items-center gap-3 px-4 py-3.5 rounded-2xl border"
                    style={{
                      backgroundColor: selected ? '#EEF0FF' : '#F9FAFB',
                      borderColor: selected ? '#5B4FE9' : '#E5E7EB',
                    }}
                  >
                    {/* Icon box */}
                    <View
                      className="w-9 h-9 rounded-xl items-center justify-center"
                      style={{
                        backgroundColor: selected ? '#5B4FE9' : '#E5E7EB',
                      }}
                    >
                      <Icon
                        size={16}
                        color={selected ? 'white' : '#6B7280'}
                        strokeWidth={1.8}
                      />
                    </View>

                    <Text
                      className="flex-1 text-sm font-semibold"
                      style={{ color: selected ? '#5B4FE9' : '#374151' }}
                    >
                      {amenity.name}
                    </Text>

                    {/* Checkbox */}
                    <View
                      className="w-5 h-5 rounded-md items-center justify-center border"
                      style={{
                        backgroundColor: selected ? '#5B4FE9' : 'white',
                        borderColor: selected ? '#5B4FE9' : '#D1D5DB',
                      }}
                    >
                      {selected && (
                        <Check size={11} color="white" strokeWidth={3} />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ── Services ── */}
        {hasServices && (
          <View className="mb-4">
            <View className="flex-row items-center mb-1">
              <Package size={16} color="#5B4FE9" strokeWidth={2} />
              <Text className="text-sm font-bold text-gray-900 ml-2">
                Additional Services
              </Text>
            </View>
            <Text className="text-xs text-gray-400 mb-4">
              Add services billed per booking
            </Text>
            <View className="gap-3">
              {serviceCategories.map(({ category }) =>
                (category.services ?? []).map(svc => {
                  const qty = getQty(svc.id);
                  return (
                    <View
                      key={svc.id}
                      className="flex-row items-center rounded-2xl px-4 py-3.5 border"
                      style={{
                        backgroundColor: qty > 0 ? '#F8F7FF' : '#F9FAFB',
                        borderColor: qty > 0 ? '#5B4FE9' : '#E5E7EB',
                      }}
                    >
                      {/* Info */}
                      <View className="flex-1 mr-3">
                        <Text className="text-sm font-semibold text-gray-900">
                          {svc.name}
                        </Text>
                        <Text className="text-xs text-[#5B4FE9] font-medium mt-0.5">
                          {svc.price.toLocaleString('vi-VN')}đ
                        </Text>
                        {svc.description ? (
                          <Text
                            className="text-xs text-gray-400 mt-0.5"
                            numberOfLines={1}
                          >
                            {svc.description}
                          </Text>
                        ) : null}
                      </View>

                      {/* Stepper */}
                      <View className="flex-row items-center gap-3">
                        <TouchableOpacity
                          onPress={() => setQty(svc.id, qty - 1)}
                          disabled={qty === 0}
                          className="w-8 h-8 rounded-full items-center justify-center"
                          style={{
                            backgroundColor: qty > 0 ? '#5B4FE9' : '#E5E7EB',
                          }}
                        >
                          <Minus
                            size={13}
                            color={qty > 0 ? 'white' : '#9CA3AF'}
                            strokeWidth={2.5}
                          />
                        </TouchableOpacity>

                        <Text className="text-sm font-bold text-gray-900 w-5 text-center">
                          {qty}
                        </Text>

                        <TouchableOpacity
                          onPress={() => setQty(svc.id, qty + 1)}
                          disabled={qty >= MAX_QTY}
                          className="w-8 h-8 rounded-full items-center justify-center"
                          style={{
                            backgroundColor:
                              qty >= MAX_QTY ? '#E5E7EB' : '#5B4FE9',
                          }}
                        >
                          <Plus
                            size={13}
                            color={qty >= MAX_QTY ? '#9CA3AF' : 'white'}
                            strokeWidth={2.5}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* ── Bottom bar ── */}
      <View
        className="border-t border-gray-100 px-4 pt-3 pb-4 bg-white"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        {/* Running total */}
        {runningTotal > 0 && (
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm text-gray-500 font-medium">Extras</Text>
            <Text className="text-sm font-bold text-[#5B4FE9]">
              +{runningTotal.toLocaleString('vi-VN')}đ
            </Text>
          </View>
        )}

        <View className="flex-row gap-3">
          {/* Skip */}
          <TouchableOpacity
            onPress={onSkip}
            activeOpacity={0.7}
            className="flex-1 rounded-2xl py-4 items-center border border-gray-200 flex-row justify-center gap-2"
          >
            <SkipForward size={16} color="#6B7280" strokeWidth={2} />
            <Text className="text-sm font-semibold text-gray-500">Skip</Text>
          </TouchableOpacity>

          {/* Next */}
          <TouchableOpacity
            onPress={onNext}
            activeOpacity={0.85}
            className="flex-[2] rounded-2xl py-4 items-center flex-row justify-center gap-2"
            style={{ backgroundColor: '#5B4FE9' }}
          >
            <Text className="text-base font-bold text-white">
              Review Booking
            </Text>
            <ArrowRight size={18} color="white" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
