import { BookingStatus } from '@/types/booking.type';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

export type StatusTab = { label: string; value: BookingStatus | null };

export const STATUS_TABS: StatusTab[] = [
  { label: 'All', value: null },
  { label: 'Pending', value: BookingStatus.PENDING },
  { label: 'Approved', value: BookingStatus.APPROVED },
  { label: 'Confirmed', value: BookingStatus.CONFIRMED },
  { label: 'Rejected', value: BookingStatus.REJECTED },
  { label: 'Cancelled', value: BookingStatus.CANCELLED },
];

type Props = {
  activeTab: BookingStatus | null;
  onSelect: (value: BookingStatus | null) => void;
};

export default function BookingStatusTabs({ activeTab, onSelect }: Props) {
  return (
    <View style={{ height: 44 }}>
      <FlatList
        horizontal
        data={STATUS_TABS}
        keyExtractor={t => t.label}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 8,
          alignItems: 'center',
        }}
        renderItem={({ item: tab }) => {
          const isActive = activeTab === tab.value;
          return (
            <TouchableOpacity
              onPress={() => onSelect(tab.value)}
              activeOpacity={0.8}
              className="px-4 py-1.5 rounded-full border"
              style={{
                backgroundColor: isActive ? '#5B4FE9' : '#fff',
                borderColor: isActive ? '#5B4FE9' : '#E5E7EB',
              }}
            >
              <Text
                className="text-xs font-semibold"
                style={{ color: isActive ? '#fff' : '#6B7280' }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
