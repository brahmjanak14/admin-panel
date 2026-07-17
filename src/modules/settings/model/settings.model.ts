import { eq } from 'drizzle-orm';
import { db } from '../../../config/database';
import { settings } from '../schema/settings.schema';
import { toJsonValue } from '../../../shared/utils/helpers';

export const settingsModel = {
  async findFirst() {
    const [row] = await db.select().from(settings).limit(1);
    return row ?? null;
  },

  async create(data: Record<string, unknown>) {
    const [row] = await db
      .insert(settings)
      .values({ data: toJsonValue(data) })
      .returning();
    return row;
  },

  async update(id: string, data: Record<string, unknown>) {
    const [row] = await db
      .update(settings)
      .set({ data: toJsonValue(data) })
      .where(eq(settings.id, id))
      .returning();
    return row;
  },
};
