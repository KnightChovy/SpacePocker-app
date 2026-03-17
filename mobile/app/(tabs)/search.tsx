import RoomCard from '@/components/search/RoomCard';
import roomService from '@/services/room.service';
import {
  DEFAULT_FILTER_STATE,
  GetAllRoomsResponse,
  Room,
  RoomFilterState,
  RoomType,
} from '@/types/room.type';
import { Search, SlidersHorizontal, X } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Constants ────────────────────────────────────────────────────────────────

const ROOM_TYPE_CHIPS: { label: string; value: RoomType }[] = [
  { label: 'Meeting', value: RoomType.MEETING },
  { label: 'Conference', value: RoomType.CONFERENCE },
  { label: 'Studio', value: RoomType.STUDIO },
  { label: 'Office', value: RoomType.OFFICE },
  { label: 'Coworking', value: RoomType.COWORKING },
  { label: 'Event', value: RoomType.EVENT },
];

const CAPACITY_BUCKETS: { label: string; min: number }[] = [
  { label: 'Any', min: 0 },
  { label: '1', min: 1 },
  { label: '2–5', min: 2 },
  { label: '6–10', min: 6 },
  { label: '10+', min: 10 },
];

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function SearchScreen() {
  const [filters, setFilters] = useState<RoomFilterState>(DEFAULT_FILTER_STATE);
  const [searchInput, setSearchInput] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [pagination, setPagination] = useState<
    GetAllRoomsResponse['metadata']['pagination'] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchRooms = useCallback(async (f: RoomFilterState) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await roomService.getAllRooms({
        search: f.search || undefined,
        roomType: f.roomType ?? undefined,
        isAvailable: f.isAvailable ?? undefined,
        minCapacity: f.minCapacity ?? undefined,
        sortBy: f.sortBy,
        sortOrder: f.sortOrder,
        limit: 20,
        offset: 0,
      });
      setRooms(res.metadata.rooms);
      setPagination(res.metadata.pagination);
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const next = { ...filters, search: searchInput };
      setFilters(next);
      fetchRooms(next);
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const applyFilter = (patch: Partial<RoomFilterState>) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    fetchRooms(next);
  };

  const clearSearch = () => {
    setSearchInput('');
    const next = { ...filters, search: '' };
    setFilters(next);
    fetchRooms(next);
  };

  const selectedCapacityMin = filters.minCapacity ?? 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom']}>
      {/* ── Header ── */}
      <View className="px-5 pt-2 pb-3 bg-gray-50">
        <Text className="text-2xl font-extrabold text-gray-900 mb-4">
          Find a Space
        </Text>

        {/* P0: Search bar */}
        <View
          className="flex-row items-center bg-white rounded-2xl px-4 py-3 border border-gray-100"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Search size={18} color="#9CA3AF" strokeWidth={2} />
          <TextInput
            className="flex-1 ml-3 text-gray-800 text-sm"
            placeholder="Search by name or code..."
            placeholderTextColor="#D1D5DB"
            value={searchInput}
            onChangeText={setSearchInput}
            returnKeyType="search"
            style={{ paddingVertical: 0 }}
          />
          {searchInput.length > 0 && (
            <TouchableOpacity onPress={clearSearch} hitSlop={8}>
              <X size={16} color="#9CA3AF" strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* P0: Room Type chips */}
        <View className="mt-1 mb-1">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
          >
            {/* "All" chip */}
            <TouchableOpacity
              onPress={() => applyFilter({ roomType: null })}
              className="px-4 py-2 rounded-full border"
              style={{
                backgroundColor: filters.roomType === null ? '#5B4FE9' : '#fff',
                borderColor: filters.roomType === null ? '#5B4FE9' : '#E5E7EB',
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{
                  color: filters.roomType === null ? '#fff' : '#6B7280',
                }}
              >
                All
              </Text>
            </TouchableOpacity>

            {ROOM_TYPE_CHIPS.map(chip => {
              const active = filters.roomType === chip.value;
              return (
                <TouchableOpacity
                  key={chip.value}
                  onPress={() =>
                    applyFilter({ roomType: active ? null : chip.value })
                  }
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
        </View>

        {/* P0: Available toggle  +  P1: Capacity stepper */}
        <View
          className="mx-5 mt-3 mb-4 bg-white rounded-2xl px-4 py-3.5 border border-gray-100 flex-row items-center justify-between"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          {/* Available toggle */}
          <View className="flex-row items-center gap-2.5">
            <Switch
              value={filters.isAvailable === true}
              onValueChange={val =>
                applyFilter({ isAvailable: val ? true : null })
              }
              trackColor={{ false: '#E5E7EB', true: '#5B4FE9' }}
              thumbColor="#fff"
            />
            <Text className="text-sm font-semibold text-gray-700">
              Available only
            </Text>
          </View>

          {/* Divider */}
          <View className="w-px h-6 bg-gray-100" />

          {/* Capacity stepper chips */}
          <View className="flex-row items-center gap-1.5">
            <SlidersHorizontal size={13} color="#9CA3AF" strokeWidth={2} />
            {CAPACITY_BUCKETS.map(b => {
              const active = selectedCapacityMin === b.min;
              return (
                <TouchableOpacity
                  key={b.min}
                  onPress={() =>
                    applyFilter({ minCapacity: b.min === 0 ? null : b.min })
                  }
                  className="px-2.5 py-1 rounded-lg"
                  style={{ backgroundColor: active ? '#EEF0FF' : '#F9FAFB' }}
                >
                  <Text
                    className="text-[11px] font-semibold"
                    style={{ color: active ? '#5B4FE9' : '#9CA3AF' }}
                  >
                    {b.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Results ── */}
        <View className="px-5">
          {loading ? (
            <View className="items-center py-16">
              <ActivityIndicator size="large" color="#5B4FE9" />
              <Text className="text-gray-400 text-sm mt-3">
                Searching spaces...
              </Text>
            </View>
          ) : !hasSearched ? (
            <View className="items-center py-16">
              <View className="w-16 h-16 rounded-2xl bg-[#EEF0FF] items-center justify-center mb-4">
                <Search size={28} color="#5B4FE9" strokeWidth={1.8} />
              </View>
              <Text className="text-gray-900 font-bold text-base mb-1">
                Discover spaces
              </Text>
              <Text className="text-gray-400 text-sm text-center">
                Search or filter to find the perfect room.
              </Text>
            </View>
          ) : rooms.length === 0 ? (
            <View className="items-center py-16">
              <Text className="text-gray-400 text-base">No spaces found.</Text>
              <Text className="text-gray-300 text-sm mt-1">
                Try adjusting your filters.
              </Text>
            </View>
          ) : (
            <>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-sm font-semibold text-gray-500">
                  {pagination?.total ?? rooms.length} spaces found
                </Text>
              </View>
              {rooms.map(room => (
                <RoomCard key={room.id} room={room} />
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
