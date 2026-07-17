import type { Lead } from '../../leads/schema/leads.schema';

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  countriesCount: number;
  blogsCount: number;
  leadsByType: { type: string; count: number }[];
  recentLeads: Lead[];
}
