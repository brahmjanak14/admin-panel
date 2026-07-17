import { z } from 'zod';

export const universitySchema = z.object({
  name: z.string().min(1),
  country: z.string().min(1),
  ranking: z.number().int(),
  logo: z.string().optional(),
  location: z.string().min(1),
  programs: z.array(z.string()).default([]),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
});

export const idParamSchema = z.object({ id: z.string().uuid() });
