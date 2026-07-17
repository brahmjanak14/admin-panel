import { z } from 'zod';

const seoSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const blogSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string(),
  category: z.string(),
  author: z.string(),
  publishedAt: z.string().optional(),
  readTime: z.string(),
  coverImage: z.string(),
  tags: z.array(z.string()).default([]),
  body: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
  seo: seoSchema,
});

export const blogSlugParamSchema = z.object({
  slug: z.string().min(1),
});

export const blogListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
});

export type BlogInput = z.infer<typeof blogSchema>;
