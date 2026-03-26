import {
  fail,
  ok,
  type ValidationResult,
} from '@/validations/common/number.validation';

export type AdminAmenityFormInput = {
  name: string;
};

export type AdminAmenityParsed = {
  name: string;
};

export const parseAdminAmenityForm = (
  input: AdminAmenityFormInput
): ValidationResult<AdminAmenityParsed> => {
  const name = input.name.trim();
  if (!name) return fail('Name is required');
  return ok({ name });
};
