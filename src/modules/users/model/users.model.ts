import { count, desc, eq, ilike, or } from 'drizzle-orm';
import { db } from '../../../config/database';
import type { Role } from '../../auth/schema/auth.schema';
import { mapAdminUser, users, type AdminUser } from '../schema/users.schema';
import { parsePagination } from '../../../shared/utils/pagination';

export type { AdminUser } from '../schema/users.schema';

export const usersModel = {
  async findMany(query: { page?: number; perPage?: number; search?: string }) {
    const { page, perPage, skip, take } = parsePagination(query);
    const where = query.search
      ? or(ilike(users.name, `%${query.search}%`), ilike(users.email, `%${query.search}%`))
      : undefined;

    const [rows, totalRow] = await Promise.all([
      db.select().from(users).where(where).orderBy(desc(users.createdAt)).limit(take).offset(skip),
      db.select({ value: count() }).from(users).where(where),
    ]);

    return { items: rows.map(mapAdminUser), total: Number(totalRow[0]?.value ?? 0), page, perPage };
  },

  async findById(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user ? mapAdminUser(user) : null;
  },

  async findByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user ?? null;
  },

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: string;
    avatar?: string;
  }): Promise<AdminUser> {
    const [user] = await db
      .insert(users)
      .values({
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role as Role,
        avatar: data.avatar,
      })
      .returning();
    return mapAdminUser(user);
  },

  async update(id: string, data: Record<string, unknown>): Promise<AdminUser> {
    const [user] = await db
      .update(users)
      .set(data as Partial<typeof users.$inferInsert>)
      .where(eq(users.id, id))
      .returning();
    return mapAdminUser(user);
  },

  async delete(id: string) {
    await db.delete(users).where(eq(users.id, id));
  },
};
