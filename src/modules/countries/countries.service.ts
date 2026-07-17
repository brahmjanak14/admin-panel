import { AppError } from '../../shared/errors/AppError';
import { NotFoundError } from '../../shared/errors/NotFoundError';
import { buildPaginationMeta, hashQuery } from '../../shared/utils/pagination';
import { cacheService } from '../../shared/cache/cacheService';
import { cacheKeys, cachePatterns } from '../../shared/cache/cacheKeys';
import { env } from '../../config/env';
import { countriesRepository } from './countries.repository';
import type { CountryContent } from './countries.types';

async function invalidateCountryCache(slug?: string) {
  await cacheService.invalidatePattern(cachePatterns.countries);
  if (slug) await cacheService.del(cacheKeys.countrySlug(slug));
}

export const countriesService = {
  async list(query: { page?: number; perPage?: number; search?: string }) {
    const cacheKey = cacheKeys.countriesList(hashQuery(query));
    const cached = await cacheService.get<{ data: CountryContent[]; meta: ReturnType<typeof buildPaginationMeta> }>(cacheKey);
    if (cached) return cached;

    const result = await countriesRepository.findMany(query);
    const response = {
      data: result.items,
      meta: buildPaginationMeta(result.total, result.page, result.perPage),
    };
    await cacheService.set(cacheKey, response, env.CACHE_TTL_MEDIUM);
    return response;
  },

  async getBySlug(slug: string): Promise<CountryContent> {
    const cacheKey = cacheKeys.countrySlug(slug);
    const cached = await cacheService.get<CountryContent>(cacheKey);
    if (cached) return cached;

    const country = await countriesRepository.findBySlug(slug);
    if (!country) throw new NotFoundError('Country not found');

    await cacheService.set(cacheKey, country, env.CACHE_TTL_LONG);
    return country;
  },

  async create(input: CountryContent): Promise<CountryContent> {
    if (await countriesRepository.slugExists(input.slug)) {
      throw new AppError('A country with this slug already exists', 409);
    }
    const country = await countriesRepository.create(input);
    await invalidateCountryCache();
    return country;
  },

  async update(oldSlug: string, input: CountryContent): Promise<CountryContent> {
    await this.getBySlug(oldSlug);
    if (oldSlug !== input.slug && (await countriesRepository.slugExists(input.slug))) {
      throw new AppError('A country with this slug already exists', 409);
    }
    const country = await countriesRepository.update(oldSlug, input);
    await invalidateCountryCache(oldSlug);
    if (input.slug !== oldSlug) {
      await cacheService.del(cacheKeys.countrySlug(input.slug));
    }
    return country;
  },

  async delete(slug: string): Promise<void> {
    await this.getBySlug(slug);
    await countriesRepository.delete(slug);
    await invalidateCountryCache(slug);
  },
};
