import { and, count, desc, eq, ilike, ne, or } from 'drizzle-orm';
import { db } from '../../../config/database';
import { blogs, mapBlog } from '../schema/blogs.schema';
import { parsePagination } from '../../../shared/utils/pagination';
import type { BlogInput } from '../util/blogs.util';

export type { BlogPost } from '../schema/blogs.schema';

export const blogsModel = {
  async findMany(query: {
    page?: number;
    perPage?: number;
    search?: string;
    status?: 'draft' | 'published';
  }) {
    const { page, perPage, skip, take } = parsePagination(query);
    const conditions = [];
    if (query.status) conditions.push(eq(blogs.status, query.status));
    if (query.search) {
      conditions.push(
        or(ilike(blogs.title, `%${query.search}%`), ilike(blogs.slug, `%${query.search}%`))!,
      );
    }
    const where = conditions.length ? and(...conditions) : undefined;

    const [rows, totalRow] = await Promise.all([
      db.select().from(blogs).where(where).orderBy(desc(blogs.createdAt)).limit(take).offset(skip),
      db.select({ value: count() }).from(blogs).where(where),
    ]);

    return { items: rows.map(mapBlog), total: Number(totalRow[0]?.value ?? 0), page, perPage };
  },

  async findBySlug(slug: string) {
    const [row] = await db.select().from(blogs).where(eq(blogs.slug, slug)).limit(1);
    return row ? mapBlog(row) : null;
  },

  async slugExists(slug: string, excludeId?: string) {
    const conditions = [eq(blogs.slug, slug)];
    if (excludeId) conditions.push(ne(blogs.id, excludeId));
    const [row] = await db
      .select({ id: blogs.id })
      .from(blogs)
      .where(and(...conditions))
      .limit(1);
    return Boolean(row);
  },

  async create(input: BlogInput) {
    const [row] = await db
      .insert(blogs)
      .values({
        slug: input.slug,
        title: input.title,
        excerpt: input.excerpt,
        category: input.category,
        author: input.author,
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
        readTime: input.readTime,
        coverImage: input.coverImage,
        tags: input.tags ?? [],
        body: input.body,
        status: input.status ?? 'draft',
        seo: input.seo,
      })
      .returning();
    return mapBlog(row);
  },

  async update(oldSlug: string, input: BlogInput) {
    const [row] = await db
      .update(blogs)
      .set({
        slug: input.slug,
        title: input.title,
        excerpt: input.excerpt,
        category: input.category,
        author: input.author,
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
        readTime: input.readTime,
        coverImage: input.coverImage,
        tags: input.tags ?? [],
        body: input.body,
        status: input.status ?? 'draft',
        seo: input.seo,
      })
      .where(eq(blogs.slug, oldSlug))
      .returning();
    return mapBlog(row);
  },

  async delete(slug: string) {
    await db.delete(blogs).where(eq(blogs.slug, slug));
  },
};
