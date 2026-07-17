import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { buildPaginationMeta } from '../../../shared/utils/pagination';
import { toCsv } from '../../../shared/utils/csvExport';
import { cacheService } from '../../../shared/cache/cacheService';
import { cacheKeys, cachePatterns } from '../../../shared/cache/cacheKeys';
import { notifyLeadCreated } from '../../../shared/integrations';
import { leadsModel, type CreateLeadInput, type Lead, type LeadStatus } from '../model/leads.model';
import type { LeadListQuery } from '../util/leads.util';

async function invalidateDashboardCache() {
  await cacheService.del(cacheKeys.dashboardStats());
}

function buildLeadMetadata(input: CreateLeadInput): Record<string, string> | undefined {
  const metadata: Record<string, string> = { ...(input.metadata ?? {}) };
  if (input.subject?.trim()) metadata.subject = input.subject.trim();
  if (input.preferredDate?.trim()) metadata.preferredDate = input.preferredDate.trim();
  return Object.keys(metadata).length > 0 ? metadata : undefined;
}

export const leadsService = {
  async list(query: LeadListQuery) {
    const result = await leadsModel.findMany(query);
    return {
      data: result.items,
      meta: buildPaginationMeta(result.total, result.page, result.perPage),
    };
  },

  async getById(id: string): Promise<Lead> {
    const lead = await leadsModel.findById(id);
    if (!lead) throw new NotFoundError('Lead not found');
    return lead;
  },

  async updateStatus(id: string, status: LeadStatus): Promise<Lead> {
    await this.getById(id);
    const updated = await leadsModel.updateStatus(id, status);
    await invalidateDashboardCache();
    return updated;
  },

  async createPublic(input: CreateLeadInput): Promise<Lead> {
    const { subject: _subject, preferredDate: _preferredDate, ...rest } = input;
    const lead = await leadsModel.create({
      ...rest,
      metadata: buildLeadMetadata(input),
    });
    await invalidateDashboardCache();
    await notifyLeadCreated(lead);
    return lead;
  },

  async exportCsv(query: LeadListQuery): Promise<string> {
    const leads = await leadsModel.findForExport(query);
    return toCsv(
      leads.map((l) => ({ ...l, metadata: l.metadata ? JSON.stringify(l.metadata) : undefined })),
      [
        { key: 'id', header: 'ID' },
        { key: 'type', header: 'Type' },
        { key: 'status', header: 'Status' },
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        { key: 'phone', header: 'Phone' },
        { key: 'country', header: 'Country' },
        { key: 'service', header: 'Service' },
        { key: 'source', header: 'Source' },
        { key: 'createdAt', header: 'Created At' },
      ],
    );
  },
};

export async function invalidateLeadCaches() {
  await cacheService.invalidatePattern(cachePatterns.dashboard);
}
