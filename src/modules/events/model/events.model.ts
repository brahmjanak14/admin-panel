import { count, desc, eq, ilike, or } from 'drizzle-orm';
import { db } from '../../../config/database';
import { events, mapEvent, type EventItem } from '../schema/events.schema';
import { parsePagination } from '../../../shared/utils/pagination';
import type { z } from 'zod';
import type { eventSchema } from '../util/events.util';

export type { EventItem, EventType } from '../schema/events.schema';
export type EventInput = z.infer<typeof eventSchema>;

export const eventsModel = {
  async findMany(query: { page?: number; perPage?: number; search?: string }) {
    const { page, perPage, skip, take } = parsePagination(query);
    const where = query.search
      ? or(ilike(events.title, `%${query.search}%`), ilike(events.location, `%${query.search}%`))
      : undefined;

    const [rows, totalRow] = await Promise.all([
      db.select().from(events).where(where).orderBy(desc(events.createdAt)).limit(take).offset(skip),
      db.select({ value: count() }).from(events).where(where),
    ]);

    return { items: rows.map(mapEvent), total: Number(totalRow[0]?.value ?? 0), page, perPage };
  },

  async findById(id: string) {
    const [row] = await db.select().from(events).where(eq(events.id, id)).limit(1);
    return row ? mapEvent(row) : null;
  },

  async create(input: EventInput): Promise<EventItem> {
    const [row] = await db
      .insert(events)
      .values({
        title: input.title,
        date: new Date(input.date),
        location: input.location,
        type: input.type,
        description: input.description,
      })
      .returning();
    return mapEvent(row);
  },

  async update(id: string, input: EventInput) {
    const [row] = await db
      .update(events)
      .set({
        title: input.title,
        date: new Date(input.date),
        location: input.location,
        type: input.type,
        description: input.description,
      })
      .where(eq(events.id, id))
      .returning();
    return row ? mapEvent(row) : null;
  },

  async delete(id: string) {
    const [row] = await db.delete(events).where(eq(events.id, id)).returning();
    return row ? mapEvent(row) : null;
  },
};
