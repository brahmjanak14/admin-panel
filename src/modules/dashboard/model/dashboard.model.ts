import { count } from 'drizzle-orm';
import { db } from '../../../config/database';
import { blogs } from '../../blogs/schema/blogs.schema';
import { countries } from '../../countries/schema/countries.schema';

export type { DashboardStats } from '../schema/dashboard.schema';

export const dashboardModel = {
  async countCountries() {
    const [row] = await db.select({ value: count() }).from(countries);
    return Number(row?.value ?? 0);
  },

  async countBlogs() {
    const [row] = await db.select({ value: count() }).from(blogs);
    return Number(row?.value ?? 0);
  },
};
