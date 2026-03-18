import { RoomType } from '@/types/room.type';
import { ScrollView, Text, TouchableOpacity } from 'react-native';

const ROOM_TYPE_CHIPS: { label: string; value: RoomType }[] = [
  { label: 'Meeting', value: RoomType.MEETING },
  { label: 'Classroom', value: RoomType.CLASSROOM },
  { label: 'Event', value: RoomType.EVENT },
  { label: 'Other', value: RoomType.OTHER },
];

type Props = {
  selected: RoomType | null;
  onSelect: (type: RoomType | null) => void;
};

export default function RoomTypeChips({ selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
    >
      <TouchableOpacity
        onPress={() => onSelect(null)}
        className="px-4 py-2 rounded-full border"
        style={{
          backgroundColor: selected === null ? '#5B4FE9' : '#fff',
          borderColor: selected === null ? '#5B4FE9' : '#E5E7EB',
        }}
      >
        <Text
          className="text-sm font-semibold"
          style={{ color: selected === null ? '#fff' : '#6B7280' }}
        >
          All
        </Text>
      </TouchableOpacity>

      {ROOM_TYPE_CHIPS.map(chip => {
        const active = selected === chip.value;
        return (
          <TouchableOpacity
            key={chip.value}
            onPress={() => onSelect(active ? null : chip.value)}
            className="px-4 py-2 rounded-full border"
            style={{
              backgroundColor: active ? '#5B4FE9' : '#fff',
              borderColor: active ? '#5B4FE9' : '#E5E7EB',
            }}
          >
            <Text
              className="text-sm font-semibold"
              style={{ color: active ? '#fff' : '#6B7280' }}
            >
              {chip.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
