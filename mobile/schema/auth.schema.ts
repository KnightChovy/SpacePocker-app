import { z } from 'zod';
const loginSchema = z.object({
  email: z.string('Email is required').email('Invalid email address'),
  password: z.string('Password is required').min(6, 'Minimum 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
