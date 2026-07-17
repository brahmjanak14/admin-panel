import { index, jsonb, pgTable, text } from 'drizzle-orm/pg-core';
import { randomUUID } from 'crypto';
import { timestamps } from '../../../db/columns';
import { leadStatusEnum, leadTypeEnum } from '../../../db/enums';

export const leads = pgTable(
  'leads',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    type: leadTypeEnum('type').notNull(),
    status: leadStatusEnum('status').notNull().default('new'),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    message: text('message'),
    source: text('source'),
    country: text('country'),
    service: text('service'),
    metadata: jsonb('metadata').$type<Record<string, string>>(),
    ...timestamps,
  },
  (table) => [
    index('leads_type_idx').on(table.type),
    index('leads_status_idx').on(table.status),
    index('leads_email_idx').on(table.email),
    index('leads_created_at_idx').on(table.createdAt),
  ],
);

export type LeadRow = typeof leads.$inferSelect;
export type LeadType = 'contact' | 'consultation' | 'newsletter' | 'career';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';

export interface Lead {
  id: string;
  type: LeadType;
  status: LeadStatus;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source?: string;
  country?: string;
  service?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, string>;
}

export interface CreateLeadInput {
  type: LeadType;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source?: string;
  country?: string;
  service?: string;
  subject?: string;
  preferredDate?: string;
  metadata?: Record<string, string>;
}

export function mapLead(lead: LeadRow): Lead {
  return {
    id: lead.id,
    type: lead.type,
    status: lead.status,
    name: lead.name,
    email: lead.email,
    phone: lead.phone ?? undefined,
    message: lead.message ?? undefined,
    source: lead.source ?? undefined,
    country: lead.country ?? undefined,
    service: lead.service ?? undefined,
    metadata: lead.metadata ?? undefined,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  };
}
