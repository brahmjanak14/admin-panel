import { z } from 'zod';

const featureItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
});

const processStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  duration: z.string().optional(),
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const seoSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const serviceBodySchema = z.object({
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  overview: z.string(),
  whoIsItFor: z.array(z.string()).default([]),
  benefits: z.array(featureItemSchema).default([]),
  process: z.array(processStepSchema).default([]),
  documents: z.array(z.string()).default([]),
  timeline: z.string(),
  faqs: z.array(faqSchema).default([]),
  seo: seoSchema,
});

export const serviceSchema = serviceBodySchema.extend({
  slug: z.string().min(1),
  name: z.string().min(1),
});

export const serviceSlugParamSchema = z.object({
  slug: z.string().min(1),
});

export const serviceListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
