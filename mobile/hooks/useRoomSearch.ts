import roomService from '@/services/room.service';
import {
  DEFAULT_FILTER_STATE,
  GetAllRoomsResponse,
  Room,
  RoomFilterState,
} from '@/types/room.type';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounce } from './useDebounce';

export function useRoomSearch() {
  const [filters, setFilters] = useState<RoomFilterState>(DEFAULT_FILTER_STATE);
  const [searchInput, setSearchInput] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [pagination, setPagination] = useState<
    GetAllRoomsResponse['metadata']['pagination'] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 500);
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const fetchRooms = useCallback(async (f: RoomFilterState) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await roomService.getAllRooms({
        search: f.search || undefined,
        roomType: f.roomType ?? undefined,
        status: f.status ?? undefined,
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

  useEffect(() => {
    fetchRooms(filtersRef.current);
  }, [fetchRooms]);

  const prevDebouncedSearch = useRef<string | null>(null);
  useEffect(() => {
    if (prevDebouncedSearch.current === null) {
      prevDebouncedSearch.current = debouncedSearch;
      return;
    }
    if (prevDebouncedSearch.current === debouncedSearch) return;
    prevDebouncedSearch.current = debouncedSearch;
    const next = { ...filtersRef.current, search: debouncedSearch };
    setFilters(next);
    fetchRooms(next);
  }, [debouncedSearch, fetchRooms]);

  const applyFilter = useCallback(
    (patch: Partial<RoomFilterState>) => {
      const next = { ...filtersRef.current, ...patch };
      setFilters(next);
      fetchRooms(next);
    },
    [fetchRooms]
  );

  const clearSearch = useCallback(() => {
    setSearchInput('');
  }, []);

  return {
    filters,
    searchInput,
    setSearchInput,
    rooms,
    pagination,
    loading,
    hasSearched,
    applyFilter,
    clearSearch,
  };
}
