import {
  parseFiniteFloat,
  type ValidationResult,
} from '@/validations/common/number.validation';
import {
  validateEndAfterStart,
  validateVietnamOperatingHoursForTimes,
} from '@/validations/common/time.validation';

export const validateBookingTimeRange = (
  startTime: string,
  endTime: string
): string | null => {
  const rangeError = validateEndAfterStart(startTime, endTime);
  if (rangeError) return rangeError;
  return validateVietnamOperatingHoursForTimes(startTime, endTime);
};

export const parseBookingAmount = (raw: string): ValidationResult<number> => {
  return parseFiniteFloat(raw, { field: 'amount', min: 0 });
};
