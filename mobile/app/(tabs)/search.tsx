import FilterBar from '@/components/search/FilterBar';
import RoomTypeChips from '@/components/search/RoomTypeChips';
import SearchBar from '@/components/search/SearchBar';
import SearchResults from '@/components/search/SearchResults';
import { useRoomSearch } from '@/hooks/useRoomSearch';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen() {
  const {
    filters,
    searchInput,
    setSearchInput,
    rooms,
    pagination,
    loading,
    hasSearched,
    applyFilter,
    clearSearch,
  } = useRoomSearch();

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom']}>
      <View className="px-5 pt-2 pb-3 bg-gray-50">
        <Text className="text-2xl font-extrabold text-gray-900 mb-4">
          Find a Space
        </Text>
        <SearchBar
          value={searchInput}
          onChangeText={setSearchInput}
          onClear={clearSearch}
        />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="mt-1 mb-1">
          <RoomTypeChips
            selected={filters.roomType}
            onSelect={type => applyFilter({ roomType: type })}
          />
        </View>

        <FilterBar
          minCapacity={filters.minCapacity}
          onCapacityChange={val => applyFilter({ minCapacity: val })}
        />

        <View className="px-5">
          <SearchResults
            loading={loading}
            hasSearched={hasSearched}
            rooms={rooms}
            total={pagination?.total}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
