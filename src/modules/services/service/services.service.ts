import { AppError } from '../../../shared/errors/AppError';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { buildPaginationMeta, hashQuery } from '../../../shared/utils/pagination';
import { cacheService } from '../../../shared/cache/cacheService';
import { cacheKeys, cachePatterns } from '../../../shared/cache/cacheKeys';
import { env } from '../../../config/env';
import { servicesModel, type ServiceContent } from '../model/services.model';

async function invalidateServiceCache(slug?: string) {
  await cacheService.invalidatePattern(cachePatterns.services);
  if (slug) await cacheService.del(cacheKeys.serviceSlug(slug));
}

export const servicesService = {
  async list(query: { page?: number; perPage?: number; search?: string }) {
    const cacheKey = cacheKeys.servicesList(hashQuery(query));
    const cached = await cacheService.get<{
      data: ServiceContent[];
      meta: ReturnType<typeof buildPaginationMeta>;
    }>(cacheKey);
    if (cached) return cached;

    const result = await servicesModel.findMany(query);
    const response = {
      data: result.items,
      meta: buildPaginationMeta(result.total, result.page, result.perPage),
    };
    await cacheService.set(cacheKey, response, env.CACHE_TTL_MEDIUM);
    return response;
  },

  async getBySlug(slug: string): Promise<ServiceContent> {
    const cacheKey = cacheKeys.serviceSlug(slug);
    const cached = await cacheService.get<ServiceContent>(cacheKey);
    if (cached) return cached;

    const service = await servicesModel.findBySlug(slug);
    if (!service) throw new NotFoundError('Service not found');

    await cacheService.set(cacheKey, service, env.CACHE_TTL_LONG);
    return service;
  },

  async create(input: ServiceContent): Promise<ServiceContent> {
    if (await servicesModel.slugExists(input.slug)) {
      throw new AppError('A service with this slug already exists', 409);
    }
    const service = await servicesModel.create(input);
    await invalidateServiceCache();
    return service;
  },

  async update(oldSlug: string, input: ServiceContent): Promise<ServiceContent> {
    await this.getBySlug(oldSlug);
    if (oldSlug !== input.slug && (await servicesModel.slugExists(input.slug))) {
      throw new AppError('A service with this slug already exists', 409);
    }
    const service = await servicesModel.update(oldSlug, input);
    await invalidateServiceCache(oldSlug);
    return service;
  },

  async delete(slug: string): Promise<void> {
    await this.getBySlug(slug);
    await servicesModel.delete(slug);
    await invalidateServiceCache(slug);
  },
};
