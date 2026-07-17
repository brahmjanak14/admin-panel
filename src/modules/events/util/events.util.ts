import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(1),
  date: z.string(),
  location: z.string().min(1),
  type: z.enum(['webinar', 'fair', 'workshop']),
  description: z.string(),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
});

export const idParamSchema = z.object({ id: z.string().uuid() });
