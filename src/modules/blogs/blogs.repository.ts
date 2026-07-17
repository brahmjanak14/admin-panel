import { prisma } from '../../config/database';
import type { BlogPost } from './blogs.types';
import { parsePagination } from '../../shared/utils/pagination';
import type { BlogInput } from './blogs.schema';

function toBlog(row: {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: Date | null;
  readTime: string;
  coverImage: string;
  tags: string[];
  body: string | null;
  status: string;
  seo: unknown;
}): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    author: row.author,
    publishedAt: row.publishedAt?.toISOString().split('T')[0] ?? '',
    readTime: row.readTime,
    coverImage: row.coverImage,
    tags: row.tags,
    body: row.body ?? undefined,
    status: row.status as BlogPost['status'],
    seo: row.seo as BlogPost['seo'],
  };
}

export const blogsRepository = {
  async findMany(query: {
    page?: number;
    perPage?: number;
    search?: string;
    status?: 'draft' | 'published';
  }) {
    const { page, perPage, skip, take } = parsePagination(query);
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { slug: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [rows, total] = await Promise.all([
      prisma.blog.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.blog.count({ where }),
    ]);

    return { items: rows.map(toBlog), total, page, perPage };
  },

  async findBySlug(slug: string) {
    const row = await prisma.blog.findUnique({ where: { slug } });
    return row ? toBlog(row) : null;
  },

  async slugExists(slug: string, excludeId?: string) {
    const row = await prisma.blog.findUnique({ where: { slug } });
    if (!row) return false;
    if (excludeId && row.id === excludeId) return false;
    return true;
  },

  async create(input: BlogInput) {
    const row = await prisma.blog.create({
      data: {
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
      },
    });
    return toBlog(row);
  },

  async update(oldSlug: string, input: BlogInput) {
    const row = await prisma.blog.update({
      where: { slug: oldSlug },
      data: {
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
      },
    });
    return toBlog(row);
  },

  async delete(slug: string) {
    await prisma.blog.delete({ where: { slug } });
  },
};
