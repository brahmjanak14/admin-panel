import { z } from 'zod';

export const testimonialSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  country: z.string().min(1),
  quote: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  avatar: z.string().optional(),
  university: z.string().optional(),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
});

export const idParamSchema = z.object({ id: z.string().uuid() });
