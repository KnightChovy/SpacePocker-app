import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import buildingService from '@/services/buildingService';
import type {
  BuildingQueryParams,
  CreateBuildingPayload,
  UpdateBuildingPayload,
} from '@/types/types';

export const BUILDING_KEYS = {
  all: ['buildings'] as const,
  lists: () => [...BUILDING_KEYS.all, 'list'] as const,
  list: (params?: BuildingQueryParams) =>
    [...BUILDING_KEYS.lists(), params] as const,
  details: () => [...BUILDING_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...BUILDING_KEYS.details(), id] as const,
};

export const useGetBuildings = (params?: BuildingQueryParams) => {
  return useQuery({
    queryKey: BUILDING_KEYS.list(params),
    queryFn: () => buildingService.getAllBuildings(params),
  });
};

export const useGetBuildingById = (id: string) => {
  return useQuery({
    queryKey: BUILDING_KEYS.detail(id),
    queryFn: () => buildingService.getBuildingById(id),
    enabled: !!id,
  });
};

export const useCreateBuilding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateBuildingPayload) =>
      buildingService.createBuilding(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUILDING_KEYS.lists() });
    },
  });
};

export const useUpdateBuilding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateBuildingPayload }) =>
      buildingService.updateBuilding(id, body),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: BUILDING_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: BUILDING_KEYS.lists() });
    },
  });
};

export const useDeleteBuilding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => buildingService.deleteBuilding(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: BUILDING_KEYS.lists() });
      queryClient.removeQueries({ queryKey: BUILDING_KEYS.detail(id) });
    },
  });
};
