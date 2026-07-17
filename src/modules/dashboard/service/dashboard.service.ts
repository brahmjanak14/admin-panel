import { env } from '../../../config/env';
import { cacheService } from '../../../shared/cache/cacheService';
import { cacheKeys } from '../../../shared/cache/cacheKeys';
import { dashboardModel, type DashboardStats } from '../model/dashboard.model';
import { leadsModel } from '../../leads/model/leads.model';

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const cached = await cacheService.get<DashboardStats>(cacheKeys.dashboardStats());
    if (cached) return cached;

    const [totalLeads, newLeads, countriesCount, blogsCount, leadsByType, recentLeads] =
      await Promise.all([
        leadsModel.countTotal(),
        leadsModel.countByStatus('new'),
        dashboardModel.countCountries(),
        dashboardModel.countBlogs(),
        leadsModel.countByType(),
        leadsModel.findRecent(5),
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
