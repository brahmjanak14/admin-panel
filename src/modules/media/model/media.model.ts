import path from 'path';
import fs from 'fs';
import { count, desc, eq } from 'drizzle-orm';
import { env } from '../../../config/env';
import { db } from '../../../config/database';
import { mapMedia, media, type MediaItem } from '../schema/media.schema';
import { parsePagination } from '../../../shared/utils/pagination';

export type { MediaItem } from '../schema/media.schema';

export const mediaModel = {
  async findMany(query: { page?: number; perPage?: number }) {
    const { page, perPage, skip, take } = parsePagination(query);
    const [items, totalRow] = await Promise.all([
      db.select().from(media).orderBy(desc(media.createdAt)).limit(take).offset(skip),
      db.select({ value: count() }).from(media),
    ]);
    return { items: items.map(mapMedia), total: Number(totalRow[0]?.value ?? 0), page, perPage };
  },

  async findById(id: string) {
    const [item] = await db.select().from(media).where(eq(media.id, id)).limit(1);
    return item ? mapMedia(item) : null;
  },

  async create(data: { url: string; name: string; mimeType: string; size: number }): Promise<MediaItem> {
    const [item] = await db.insert(media).values(data).returning();
    return mapMedia(item);
  },

  async delete(id: string) {
    const [item] = await db.select().from(media).where(eq(media.id, id)).limit(1);
    if (!item) return null;

    const filePath = path.join(env.UPLOAD_DIR, path.basename(item.url));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await db.delete(media).where(eq(media.id, id));
    return mapMedia(item);
  },
};
