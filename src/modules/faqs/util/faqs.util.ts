import { z } from 'zod';

export const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
});

export const idParamSchema = z.object({ id: z.string().uuid() });
