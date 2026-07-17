import { z } from 'zod';

const leadTypeEnum = z.enum(['contact', 'consultation', 'newsletter', 'career']);
const leadStatusEnum = z.enum(['new', 'contacted', 'qualified', 'converted', 'closed']);

export const leadListQuerySchema = z.object({
  type: leadTypeEnum.optional(),
  status: leadStatusEnum.optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().max(100).optional(),
});

export const leadIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const updateLeadStatusSchema = z.object({
  status: leadStatusEnum,
});

export const createPublicLeadSchema = z
  .object({
    type: leadTypeEnum,
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    message: z.string().optional(),
    source: z.string().optional(),
    country: z.string().optional(),
    service: z.string().optional(),
    /** Contact Us form — maps to Google Sheet "Subject" column */
    subject: z.string().optional(),
    /** Book Consultation form — maps to Google Sheet "Preferred date" column */
    preferredDate: z.string().optional(),
    metadata: z.record(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'contact' || data.type === 'consultation') {
      if (!data.phone?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Phone is required',
          path: ['phone'],
        });
      }
    }
    if (data.type === 'contact' && !data.subject?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Subject is required for contact leads',
        path: ['subject'],
      });
    }
    if (data.type === 'consultation') {
      if (!data.preferredDate?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Preferred date is required for consultation leads',
          path: ['preferredDate'],
        });
      }
      if (!data.country?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Destination (country) is required for consultation leads',
          path: ['country'],
        });
      }
      if (!data.service?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Service is required for consultation leads',
          path: ['service'],
        });
      }
    }
  });

export type LeadListQuery = z.infer<typeof leadListQuerySchema>;
