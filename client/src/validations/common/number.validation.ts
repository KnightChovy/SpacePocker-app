export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; message: string };

export const ok = <T>(value: T): ValidationResult<T> => ({ ok: true, value });

export const fail = (message: string): ValidationResult<never> => ({
  ok: false,
  message,
});

export const parseFiniteInt = (
  raw: string,
  options: { field: string; min?: number } = { field: 'value' }
): ValidationResult<number> => {
  const value = parseInt(raw, 10);
  if (!Number.isFinite(value)) {
    return fail(`Invalid ${options.field}`);
  }
  if (options.min !== undefined && value < options.min) {
    return fail(`Invalid ${options.field}`);
  }
  return ok(value);
};

export const parseFiniteFloat = (
  raw: string,
  options: { field: string; min?: number } = { field: 'value' }
): ValidationResult<number> => {
  const value = parseFloat(raw);
  if (!Number.isFinite(value)) {
    return fail(`Invalid ${options.field}`);
  }
  if (options.min !== undefined && value < options.min) {
    return fail(`Invalid ${options.field}`);
  }
  return ok(value);
};

export const parseOptionalFiniteFloat = (
  raw: string,
  options: { field: string; min?: number } = { field: 'value' }
): ValidationResult<number | undefined> => {
  if (raw.trim() === '') return ok(undefined);
  const parsed = parseFiniteFloat(raw, options);
  if (!parsed.ok) return parsed;
  return ok(parsed.value);
};
