import { and, count, desc, eq, ilike, or } from 'drizzle-orm';
import { db } from '../../../config/database';
import {
  leads,
  mapLead,
  type LeadStatus,
  type LeadType,
} from '../schema/leads.schema';
import { parsePagination } from '../../../shared/utils/pagination';
import type { LeadListQuery } from '../util/leads.util';

export type {
  CreateLeadInput,
  Lead,
  LeadStatus,
  LeadType,
} from '../schema/leads.schema';

function buildLeadFilters(query: LeadListQuery) {
  const conditions = [];
  if (query.type) conditions.push(eq(leads.type, query.type));
  if (query.status) conditions.push(eq(leads.status, query.status));
  if (query.search) {
    conditions.push(
      or(
        ilike(leads.name, `%${query.search}%`),
        ilike(leads.email, `%${query.search}%`),
        ilike(leads.message, `%${query.search}%`),
      )!,
    );
  }
  return conditions.length ? and(...conditions) : undefined;
}

export const leadsModel = {
  async findMany(query: LeadListQuery) {
    const { page, perPage, skip, take } = parsePagination(query);
    const where = buildLeadFilters(query);

    const [items, totalRow] = await Promise.all([
      db.select().from(leads).where(where).orderBy(desc(leads.createdAt)).limit(take).offset(skip),
      db.select({ value: count() }).from(leads).where(where),
    ]);

    return { items: items.map(mapLead), total: Number(totalRow[0]?.value ?? 0), page, perPage };
  },

  async findById(id: string) {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
    return lead ? mapLead(lead) : null;
  },

  async updateStatus(id: string, status: LeadStatus) {
    const [lead] = await db.update(leads).set({ status }).where(eq(leads.id, id)).returning();
    return mapLead(lead);
  },

  async create(data: {
    type: LeadType;
    name: string;
    email: string;
    phone?: string;
    message?: string;
    source?: string;
    country?: string;
    service?: string;
    metadata?: Record<string, string>;
  }) {
    const [lead] = await db
      .insert(leads)
      .values({
        type: data.type,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        source: data.source,
        country: data.country,
        service: data.service,
        metadata: data.metadata,
      })
      .returning();
    return mapLead(lead);
  },

  async findForExport(query: LeadListQuery) {
    const where = buildLeadFilters(query);
    const items = await db.select().from(leads).where(where).orderBy(desc(leads.createdAt));
    return items.map(mapLead);
  },

  async countByStatus(status: LeadStatus) {
    const [row] = await db.select({ value: count() }).from(leads).where(eq(leads.status, status));
    return Number(row?.value ?? 0);
  },

  async countTotal() {
    const [row] = await db.select({ value: count() }).from(leads);
    return Number(row?.value ?? 0);
  },

  async countByType() {
    const groups = await db
      .select({ type: leads.type, count: count() })
      .from(leads)
      .groupBy(leads.type);
    return groups.map((g) => ({ type: g.type, count: Number(g.count) }));
  },

  async findRecent(limit: number) {
    const items = await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(limit);
    return items.map(mapLead);
  },
};
