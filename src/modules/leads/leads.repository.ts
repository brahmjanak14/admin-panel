import type { LeadStatus, LeadType, Lead } from './leads.types';
import { prisma } from '../../config/database';
import type { LeadListQuery } from './leads.schema';
import { parsePagination } from '../../shared/utils/pagination';

function mapLead(lead: {
  id: string;
  type: string;
  status: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  source: string | null;
  country: string | null;
  service: string | null;
  metadata: unknown;
  createdAt: Date;
  updatedAt: Date;
}): Lead {
  return {
    id: lead.id,
    type: lead.type as LeadType,
    status: lead.status as LeadStatus,
    name: lead.name,
    email: lead.email,
    phone: lead.phone ?? undefined,
    message: lead.message ?? undefined,
    source: lead.source ?? undefined,
    country: lead.country ?? undefined,
    service: lead.service ?? undefined,
    metadata: (lead.metadata as Record<string, string> | null) ?? undefined,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  };
}

export const leadsRepository = {
  async findMany(query: LeadListQuery) {
    const { page, perPage, skip, take } = parsePagination(query);
    const where: Record<string, unknown> = {};

    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { message: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.lead.count({ where }),
    ]);

    return { items: items.map(mapLead), total, page, perPage };
  },

  async findById(id: string) {
    const lead = await prisma.lead.findUnique({ where: { id } });
    return lead ? mapLead(lead) : null;
  },

  async updateStatus(id: string, status: LeadStatus) {
    const lead = await prisma.lead.update({
      where: { id },
      data: { status },
    });
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
    const lead = await prisma.lead.create({
      data: {
        type: data.type,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        source: data.source,
        country: data.country,
        service: data.service,
        metadata: data.metadata,
      },
    });
    return mapLead(lead);
  },

  async findForExport(query: LeadListQuery) {
    const where: Record<string, unknown> = {};
    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    const items = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return items.map(mapLead);
  },

  async countByStatus(status: LeadStatus) {
    return prisma.lead.count({ where: { status } });
  },

  async countTotal() {
    return prisma.lead.count();
  },

  async countByType() {
    const groups = await prisma.lead.groupBy({
      by: ['type'],
      _count: { type: true },
    });
    return groups.map((g) => ({ type: g.type, count: g._count.type }));
  },

  async findRecent(limit: number) {
    const items = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return items.map(mapLead);
  },
};
