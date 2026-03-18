import { ArrowRight, Clock, FileText } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

export type TimeValue = {
  date: string; // 'YYYY-MM-DD'
  startTime: string; // ISO string
  endTime: string; // ISO string
  purpose: string;
};

type Props = {
  value: TimeValue;
  onChange: (updates: Partial<TimeValue>) => void;
  onNext: () => void;
};

// ─── Constants ────────────────────────────────────────────────────────────────

// 07:00 – 21:00  →  15 slots
const TIME_SLOTS = Array.from({ length: 15 }, (_, i) => {
  const h = i + 7;
  return `${h.toString().padStart(2, '0')}:00`;
});

const DURATIONS = [1, 2, 3, 4];
const COLS = 5;

const todayStr = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
})();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slotHour(slot: string) {
  return parseInt(slot.split(':')[0], 10);
}

function toISO(dateStr: string, hour: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, hour, 0, 0, 0).toISOString();
}

function formatSlotLabel(slot: string) {
  const h = slotHour(slot);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h;
  return `${display}${ampm}`;
}

function formatSummaryDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TimeSelection({ value, onChange, onNext }: Props) {
  const [selectedDate, setSelectedDate] = useState<string>(value.date || '');

  const [selectedSlot, setSelectedSlot] = useState<string | null>(() => {
    if (!value.startTime) return null;
    const h = new Date(value.startTime).getHours();
    return `${h.toString().padStart(2, '0')}:00`;
  });

  const [selectedDuration, setSelectedDuration] = useState<number | null>(
    () => {
      if (!value.startTime || !value.endTime) return null;
      const diff =
        (new Date(value.endTime).getTime() -
          new Date(value.startTime).getTime()) /
        3600000;
      return DURATIONS.includes(diff) ? diff : null;
    }
  );

  // ── Helpers ──
  const commit = (
    date: string,
    slot: string | null,
    duration: number | null
  ) => {
    if (date && slot && duration) {
      const startH = slotHour(slot);
      onChange({
        date,
        startTime: toISO(date, startH),
        endTime: toISO(date, startH + duration),
      });
    } else {
      onChange({ date, startTime: '', endTime: '' });
    }
  };

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    setSelectedSlot(null);
    setSelectedDuration(null);
    onChange({ date: day.dateString, startTime: '', endTime: '' });
  };

  const handleSlotPress = (slot: string) => {
    setSelectedSlot(slot);
    // Reset duration if new slot makes current duration exceed 21:00
    const newDur =
      selectedDuration && slotHour(slot) + selectedDuration > 22
        ? null
        : selectedDuration;
    if (newDur !== selectedDuration) setSelectedDuration(newDur);
    commit(selectedDate, slot, newDur);
  };

  const handleDurationPress = (dur: number) => {
    const newDur = dur === selectedDuration ? null : dur;
    setSelectedDuration(newDur);
    commit(selectedDate, selectedSlot, newDur);
  };

  // ── Derived ──
  const canProceed = !!selectedDate && !!selectedSlot && !!selectedDuration;

  const summaryText = (() => {
    if (!selectedDate) return 'Select a date to get started';
    if (!selectedSlot)
      return `${formatSummaryDate(selectedDate)} · Pick a start time`;
    if (!selectedDuration)
      return `${formatSummaryDate(selectedDate)} · ${selectedSlot} · Pick duration`;
    const endH = slotHour(selectedSlot) + selectedDuration;
    const endSlot = `${endH.toString().padStart(2, '0')}:00`;
    return `${formatSummaryDate(selectedDate)} · ${selectedSlot} – ${endSlot} · ${selectedDuration} hr${selectedDuration > 1 ? 's' : ''}`;
  })();

  const markedDates = selectedDate
    ? { [selectedDate]: { selected: true, selectedColor: '#5B4FE9' } }
    : {};

  // Split slots into rows of COLS
  const slotRows: string[][] = [];
  for (let i = 0; i < TIME_SLOTS.length; i += COLS) {
    slotRows.push(TIME_SLOTS.slice(i, i + COLS));
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        {/* ── Calendar ── */}
        <Calendar
          minDate={todayStr}
          onDayPress={handleDayPress}
          markedDates={markedDates}
          theme={{
            selectedDayBackgroundColor: '#5B4FE9',
            todayTextColor: '#5B4FE9',
            arrowColor: '#5B4FE9',
            dotColor: '#5B4FE9',
            selectedDotColor: 'white',
            textDayFontWeight: '500',
            textMonthFontWeight: '700',
          }}
        />

        <View className="h-px bg-gray-100 mx-4 mb-5" />

        {/* ── Time slot grid ── */}
        <View className="px-4 mb-5">
          <View className="flex-row items-center mb-3">
            <Clock size={16} color="#5B4FE9" strokeWidth={2} />
            <Text className="text-sm font-bold text-gray-900 ml-2">
              Start Time
            </Text>
          </View>

          {!selectedDate ? (
            <Text className="text-xs text-gray-400 italic">
              Pick a date first
            </Text>
          ) : (
            slotRows.map((row, ri) => (
              <View key={ri} className="flex-row gap-2 mb-2">
                {row.map(slot => {
                  const selected = slot === selectedSlot;
                  return (
                    <TouchableOpacity
                      key={slot}
                      onPress={() => handleSlotPress(slot)}
                      activeOpacity={0.8}
                      className="flex-1 py-2.5 rounded-xl items-center border"
                      style={{
                        backgroundColor: selected ? '#5B4FE9' : 'white',
                        borderColor: selected ? '#5B4FE9' : '#E5E7EB',
                      }}
                    >
                      <Text
                        className="text-xs font-semibold"
                        style={{ color: selected ? 'white' : '#374151' }}
                      >
                        {formatSlotLabel(slot)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))
          )}
        </View>

        {/* ── Duration chips ── */}
        <View className="px-4 mb-5">
          <Text className="text-sm font-bold text-gray-900 mb-3">Duration</Text>
          {!selectedSlot ? (
            <Text className="text-xs text-gray-400 italic">
              Pick a start time first
            </Text>
          ) : (
            <View className="flex-row gap-2">
              {DURATIONS.map(dur => {
                const selected = dur === selectedDuration;
                const invalid = selectedSlot
                  ? slotHour(selectedSlot) + dur > 22
                  : false;
                return (
                  <TouchableOpacity
                    key={dur}
                    onPress={() => !invalid && handleDurationPress(dur)}
                    activeOpacity={0.8}
                    className="flex-1 py-3 rounded-xl items-center border"
                    style={{
                      backgroundColor: selected ? '#5B4FE9' : 'white',
                      borderColor: selected ? '#5B4FE9' : '#E5E7EB',
                      opacity: invalid ? 0.35 : 1,
                    }}
                  >
                    <Text
                      className="text-sm font-bold"
                      style={{ color: selected ? 'white' : '#374151' }}
                    >
                      {dur}hr
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* ── Purpose ── */}
        <View className="px-4 mb-2">
          <View className="flex-row items-center mb-3">
            <FileText size={16} color="#5B4FE9" strokeWidth={2} />
            <Text className="text-sm font-bold text-gray-900 ml-2">
              Purpose{' '}
              <Text className="text-xs text-gray-400 font-normal">
                (optional)
              </Text>
            </Text>
          </View>
          <TextInput
            value={value.purpose}
            onChangeText={text => onChange({ purpose: text })}
            placeholder="e.g. Team meeting, Interview..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
            className="bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-900"
            style={{ textAlignVertical: 'top', minHeight: 80 }}
          />
        </View>
      </ScrollView>

      {/* ── Summary bar + CTA ── */}
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
        <Text
          className="text-xs text-gray-500 font-medium mb-2"
          numberOfLines={1}
        >
          {summaryText}
        </Text>
        <TouchableOpacity
          onPress={onNext}
          disabled={!canProceed}
          activeOpacity={0.85}
          className="rounded-2xl py-4 items-center flex-row justify-center gap-2"
          style={{ backgroundColor: canProceed ? '#5B4FE9' : '#E5E7EB' }}
        >
          <Text
            className="font-bold text-base"
            style={{ color: canProceed ? 'white' : '#9CA3AF' }}
          >
            Continue
          </Text>
          <ArrowRight
            size={18}
            color={canProceed ? 'white' : '#9CA3AF'}
            strokeWidth={2.5}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
