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

const testimonialSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  country: z.string(),
  quote: z.string(),
  rating: z.number(),
  avatar: z.string().optional(),
  university: z.string().optional(),
});

const universitySchema = z.object({
  id: z.string(),
  name: z.string(),
  country: z.string(),
  ranking: z.number(),
  logo: z.string().optional(),
  location: z.string(),
  programs: z.array(z.string()),
});

const courseSchema = z.object({
  id: z.string(),
  title: z.string(),
  level: z.string(),
  duration: z.string(),
  field: z.string(),
  countries: z.array(z.string()),
});

const scholarshipSchema = z.object({
  id: z.string(),
  title: z.string(),
  amount: z.string(),
  country: z.string(),
  deadline: z.string(),
  eligibility: z.string(),
});

const labelValueSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const seoSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const countryBodySchema = z.object({
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  overview: z.string(),
  benefits: z.array(featureItemSchema).default([]),
  universities: z.array(universitySchema).default([]),
  popularCourses: z.array(courseSchema).default([]),
  eligibility: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  documents: z.array(z.string()).default([]),
  visaProcess: z.array(processStepSchema).default([]),
  timeline: z.array(processStepSchema).default([]),
  cost: z.array(labelValueSchema).default([]),
  scholarships: z.array(scholarshipSchema).default([]),
  livingExpenses: z.array(labelValueSchema).default([]),
  testimonials: z.array(testimonialSchema).default([]),
  faqs: z.array(faqSchema).default([]),
  seo: seoSchema,
});

export const countrySchema = countryBodySchema.extend({
  slug: z.string().min(1),
  name: z.string().min(1),
  flag: z.string().min(1),
});

export const countrySlugParamSchema = z.object({
  slug: z.string().min(1),
});

export const countryListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
});

export type CountryInput = z.infer<typeof countrySchema>;
