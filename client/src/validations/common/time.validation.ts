export const toMinutes = (time: string): number | null => {
  const trimmed = time.trim();
  if (trimmed === '24:00') return 24 * 60;
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(trimmed);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours * 60 + minutes;
};

export const VIETNAM_OPERATING_HOURS = {
  open: '07:00',
  close: '24:00',
} as const;

export const validateEndAfterStart = (
  startTime: string,
  endTime: string
): string | null => {
  const startMinutes = toMinutes(startTime);
  const endMinutes = toMinutes(endTime);
  if (startMinutes == null || endMinutes == null) {
    return 'Invalid time format.';
  }
  if (endMinutes <= startMinutes) {
    return 'End time must be after start time.';
  }
  return null;
};

export const validateTimeRangeWithinBounds = (
  startTime: string,
  endTime: string,
  bounds: { open: string; close: string }
): string | null => {
  const startMinutes = toMinutes(startTime);
  const endMinutes = toMinutes(endTime);
  const openMinutes = toMinutes(bounds.open);
  const closeMinutes = toMinutes(bounds.close);

  if (
    startMinutes == null ||
    endMinutes == null ||
    openMinutes == null ||
    closeMinutes == null
  ) {
    return 'Invalid time format.';
  }

  if (startMinutes < openMinutes || startMinutes >= closeMinutes) {
    return `Start time must be within ${bounds.open}–${bounds.close}.`;
  }

  if (endMinutes <= openMinutes || endMinutes > closeMinutes) {
    return `End time must be within ${bounds.open}–${bounds.close}.`;
  }

  return null;
};

const parseUtcDay = (date: string): number | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const utc = Date.UTC(year, monthIndex, day);
  return Number.isFinite(utc) ? utc : null;
};

export const validateVietnamOperatingHoursForTimes = (
  startTime: string,
  endTime: string
): string | null => {
  return validateTimeRangeWithinBounds(
    startTime,
    endTime,
    VIETNAM_OPERATING_HOURS
  );
};

export const validateVietnamOperatingHoursForDateTimes = (
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string
): string | null => {
  const startDayUtc = parseUtcDay(startDate);
  const endDayUtc = parseUtcDay(endDate);
  if (startDayUtc == null || endDayUtc == null) {
    return 'Invalid date.';
  }

  const startMinutes = toMinutes(startTime);
  const endMinutes = toMinutes(endTime);
  const openMinutes = toMinutes(VIETNAM_OPERATING_HOURS.open);
  const closeMinutes = toMinutes(VIETNAM_OPERATING_HOURS.close);

  if (
    startMinutes == null ||
    endMinutes == null ||
    openMinutes == null ||
    closeMinutes == null
  ) {
    return 'Invalid time format.';
  }

  const dayDiff = (endDayUtc - startDayUtc) / (24 * 60 * 60 * 1000);
  if (!Number.isInteger(dayDiff) || dayDiff < 0 || dayDiff > 1) {
    return `Bookings must be within ${VIETNAM_OPERATING_HOURS.open}–${VIETNAM_OPERATING_HOURS.close}.`;
  }

  if (startMinutes < openMinutes || startMinutes >= closeMinutes) {
    return `Start time must be within ${VIETNAM_OPERATING_HOURS.open}–${VIETNAM_OPERATING_HOURS.close}.`;
  }

  const effectiveEndMinutes = dayDiff === 1 ? 24 * 60 : endMinutes;

  if (dayDiff === 1 && endMinutes !== 0) {
    return `End time must be within ${VIETNAM_OPERATING_HOURS.open}–${VIETNAM_OPERATING_HOURS.close}.`;
  }

  if (
    effectiveEndMinutes <= openMinutes ||
    effectiveEndMinutes > closeMinutes
  ) {
    return `End time must be within ${VIETNAM_OPERATING_HOURS.open}–${VIETNAM_OPERATING_HOURS.close}.`;
  }

  if (effectiveEndMinutes <= startMinutes) {
    return 'End time must be after start time.';
  }

  return null;
};
