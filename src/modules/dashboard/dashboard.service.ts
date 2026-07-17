import { prisma } from '../../config/database';
import { env } from '../../config/env';
import { cacheService } from '../../shared/cache/cacheService';
import { cacheKeys } from '../../shared/cache/cacheKeys';
import { leadsRepository } from '../leads/leads.repository';

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  countriesCount: number;
  blogsCount: number;
  leadsByType: { type: string; count: number }[];
  recentLeads: Awaited<ReturnType<typeof leadsRepository.findRecent>>;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const cached = await cacheService.get<DashboardStats>(cacheKeys.dashboardStats());
    if (cached) return cached;

    const [totalLeads, newLeads, countriesCount, blogsCount, leadsByType, recentLeads] =
      await Promise.all([
        leadsRepository.countTotal(),
        leadsRepository.countByStatus('new'),
        prisma.country.count(),
        prisma.blog.count(),
        leadsRepository.countByType(),
        leadsRepository.findRecent(5),
      ]);

    const stats: DashboardStats = {
      totalLeads,
      newLeads,
      countriesCount,
      blogsCount,
      leadsByType,
      recentLeads,
    };

    await cacheService.set(cacheKeys.dashboardStats(), stats, env.CACHE_TTL_SHORT);
    return stats;
  },
};
