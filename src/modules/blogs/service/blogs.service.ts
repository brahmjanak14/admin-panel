import { AppError } from '../../../shared/errors/AppError';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { buildPaginationMeta, hashQuery } from '../../../shared/utils/pagination';
import { cacheService } from '../../../shared/cache/cacheService';
import { cacheKeys, cachePatterns } from '../../../shared/cache/cacheKeys';
import { env } from '../../../config/env';
import { blogsModel, type BlogPost } from '../model/blogs.model';
import type { BlogInput } from '../util/blogs.util';

async function invalidateBlogCache(slug?: string) {
  await cacheService.invalidatePattern(cachePatterns.blogs);
  if (slug) await cacheService.del(cacheKeys.blogSlug(slug));
}

export const blogsService = {
  async list(query: {
    page?: number;
    perPage?: number;
    search?: string;
    status?: 'draft' | 'published';
  }) {
    const cacheKey = cacheKeys.blogsList(hashQuery(query));
    const cached = await cacheService.get<{
      data: BlogPost[];
      meta: ReturnType<typeof buildPaginationMeta>;
    }>(cacheKey);
    if (cached) return cached;

    const result = await blogsModel.findMany(query);
    const response = {
      data: result.items,
      meta: buildPaginationMeta(result.total, result.page, result.perPage),
    };
    await cacheService.set(cacheKey, response, env.CACHE_TTL_MEDIUM);
    return response;
  },

  async getBySlug(slug: string): Promise<BlogPost> {
    const cacheKey = cacheKeys.blogSlug(slug);
    const cached = await cacheService.get<BlogPost>(cacheKey);
    if (cached) return cached;

    const blog = await blogsModel.findBySlug(slug);
    if (!blog) throw new NotFoundError('Blog not found');

    await cacheService.set(cacheKey, blog, env.CACHE_TTL_LONG);
    return blog;
  },

  async create(input: BlogInput): Promise<BlogPost> {
    if (await blogsModel.slugExists(input.slug)) {
      throw new AppError('A blog with this slug already exists', 409);
    }
    const blog = await blogsModel.create(input);
    await invalidateBlogCache();
    return blog;
  },

  async update(oldSlug: string, input: BlogInput): Promise<BlogPost> {
    const existing = await this.getBySlug(oldSlug);
    if (oldSlug !== input.slug && (await blogsModel.slugExists(input.slug, existing.id))) {
      throw new AppError('A blog with this slug already exists', 409);
    }
    const blog = await blogsModel.update(oldSlug, input);
    await invalidateBlogCache(oldSlug);
    return blog;
  },

  async delete(slug: string): Promise<void> {
    await this.getBySlug(slug);
    await blogsModel.delete(slug);
    await invalidateBlogCache(slug);
  },
};
