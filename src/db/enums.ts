import { pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('Role', ['super_admin', 'admin', 'editor', 'viewer']);
export const leadTypeEnum = pgEnum('LeadType', ['contact', 'consultation', 'newsletter', 'career']);
export const leadStatusEnum = pgEnum('LeadStatus', [
  'new',
  'contacted',
  'qualified',
  'converted',
  'closed',
]);
export const blogStatusEnum = pgEnum('BlogStatus', ['draft', 'published']);
export const eventTypeEnum = pgEnum('EventType', ['webinar', 'fair', 'workshop']);
export const careerTypeEnum = pgEnum('CareerType', ['full-time', 'part-time', 'contract']);
