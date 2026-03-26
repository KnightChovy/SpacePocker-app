import {
  ok,
  parseFiniteFloat,
  parseFiniteInt,
  parseOptionalFiniteFloat,
  type ValidationResult,
} from '@/validations/common/number.validation';

export type RoomNumbersInput = {
  capacity: string;
  area: string;
  pricePerHour: string;
  securityDeposit: string;
};

export type RoomNumbersParsed = {
  capacity: number;
  area?: number;
  pricePerHour: number;
  securityDeposit?: number;
};

export const parseRoomNumbers = (
  input: RoomNumbersInput
): ValidationResult<RoomNumbersParsed> => {
  const capacity = parseFiniteInt(input.capacity, {
    field: 'capacity',
    min: 1,
  });
  if (!capacity.ok) return capacity;

  const pricePerHour = parseFiniteFloat(input.pricePerHour, {
    field: 'price per hour',
    min: 0,
  });
  if (!pricePerHour.ok) return pricePerHour;

  const securityDeposit = parseOptionalFiniteFloat(input.securityDeposit, {
    field: 'security deposit',
    min: 0,
  });
  if (!securityDeposit.ok) return securityDeposit;

  const area = parseOptionalFiniteFloat(input.area, { field: 'area', min: 0 });
  if (!area.ok) return area;

  return ok({
    capacity: capacity.value,
    pricePerHour: pricePerHour.value,
    securityDeposit: securityDeposit.value,
    area: area.value,
  });
};

export const roomNumbersErrorMessage = (
  result: ValidationResult<RoomNumbersParsed>
): string | null => {
  if (result.ok) return null;
  return result.message;
};
