import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a consistent avatar URL for a user
 * @param name - User's full name
 * @param fallback - Fallback text if name is not provided
 * @returns Avatar URL from UI Avatars API
 */
export function getAvatarUrl(
  name?: string | null,
  fallback: string = 'User'
): string {
  const displayName = name || fallback;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff&bold=true`;
}

const vndCurrencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

export function formatVND(value: number | string): string {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return vndCurrencyFormatter.format(0);
  return vndCurrencyFormatter.format(amount);
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  const message = (error as { response?: { data?: { message?: string } } })
    ?.response?.data?.message;

  if (typeof message === 'string' && message.trim()) {
    return message;
  }

  return fallback;
}
