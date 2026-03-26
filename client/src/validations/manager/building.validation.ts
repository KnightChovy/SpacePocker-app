import {
  ok,
  parseOptionalFiniteFloat,
  type ValidationResult,
} from '@/validations/common/number.validation';

export type BuildingCoordinatesInput = {
  latitude: string;
  longitude: string;
};

export type BuildingCoordinatesParsed = {
  latitude?: number;
  longitude?: number;
};

export const parseBuildingCoordinates = (
  input: BuildingCoordinatesInput
): ValidationResult<BuildingCoordinatesParsed> => {
  const latitude = parseOptionalFiniteFloat(input.latitude, {
    field: 'latitude',
  });
  if (!latitude.ok) return latitude;

  const longitude = parseOptionalFiniteFloat(input.longitude, {
    field: 'longitude',
  });
  if (!longitude.ok) return longitude;

  return ok({ latitude: latitude.value, longitude: longitude.value });
};
