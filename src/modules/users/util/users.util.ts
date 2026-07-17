import { z } from 'zod';

export const roleEnum = z.enum(['super_admin', 'admin', 'editor', 'viewer']);

export const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6).optional(),
  role: roleEnum,
  avatar: z.string().optional(),
});

export const createUserSchema = userSchema.extend({ password: z.string().min(6) });

export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
});

export const idParamSchema = z.object({ id: z.string().uuid() });
