import {
  fail,
  ok,
  type ValidationResult,
} from '@/validations/common/number.validation';

export type AdminServiceFormInput = {
  name: string;
  description: string;
  price: string;
  categoryId: string;
};

export type AdminServiceParsed = {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
};

export const parseAdminServiceForm = (
  input: AdminServiceFormInput
): ValidationResult<AdminServiceParsed> => {
  const name = input.name.trim();
  const categoryId = input.categoryId.trim();
  const description = input.description.trim();
  const rawPrice = input.price.trim();

  if (!name) return fail('Name is required');
  if (!categoryId) return fail('Category is required');
  if (!rawPrice) return fail('Price is required');

  const price = Number(rawPrice);
  if (!Number.isFinite(price) || price < 0) return fail('Invalid price');

  return ok({
    name,
    categoryId,
    description: description || undefined,
    price,
  });
};
