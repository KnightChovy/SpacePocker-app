import { Text, TouchableOpacity, View } from 'react-native';

const CAPACITY_OPTIONS: { label: string; value: number | null }[] = [
  { label: 'Any', value: null },
  { label: '2+', value: 2 },
  { label: '5+', value: 5 },
  { label: '10+', value: 10 },
  { label: '20+', value: 20 },
  { label: '50+', value: 50 },
];

type Props = {
  minCapacity: number | null;
  onCapacityChange: (val: number | null) => void;
};

export default function FilterBar({ minCapacity, onCapacityChange }: Props) {
  return (
    <View className="mx-5 mt-3 mb-4">
      <View className="flex-row items-center justify-between mb-2.5 px-1">
        <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Min. Capacity
        </Text>
        {minCapacity !== null && (
          <TouchableOpacity onPress={() => onCapacityChange(null)}>
            <Text className="text-xs font-semibold text-[#5B4FE9]">Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-row gap-2">
        {CAPACITY_OPTIONS.map(opt => {
          const active = minCapacity === opt.value;
          return (
            <TouchableOpacity
              key={String(opt.value)}
              onPress={() => onCapacityChange(opt.value)}
              activeOpacity={0.75}
              className="flex-1 items-center justify-center py-3 rounded-2xl border"
              style={{
                backgroundColor: active ? '#5B4FE9' : '#fff',
                borderColor: active ? '#5B4FE9' : '#E5E7EB',
                shadowColor: active ? '#5B4FE9' : '#000',
                shadowOffset: { width: 0, height: active ? 3 : 1 },
                shadowOpacity: active ? 0.25 : 0.05,
                shadowRadius: active ? 6 : 3,
                elevation: active ? 4 : 1,
              }}
            >
              <Text
                className="text-sm font-bold"
                style={{ color: active ? '#fff' : '#6B7280' }}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
