import { DEFAULT_PAGE, DEFAULT_PER_PAGE, MAX_PER_PAGE } from '../../config/constants';

export interface PaginationParams {
  page: number;
  perPage: number;
  skip: number;
  take: number;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export function parsePagination(query: {
  page?: string | number;
  perPage?: string | number;
}): PaginationParams {
  const page = Math.max(1, Number(query.page) || DEFAULT_PAGE);
  const perPage = Math.min(
    MAX_PER_PAGE,
    Math.max(1, Number(query.perPage) || DEFAULT_PER_PAGE),
  );
  return {
    page,
    perPage,
    skip: (page - 1) * perPage,
    take: perPage,
  };
}

export function buildPaginationMeta(
  total: number,
  page: number,
  perPage: number,
): PaginationMeta {
  return {
    page,
    perPage,
    total,
    totalPages: Math.ceil(total / perPage) || 0,
  };
}

export function paginateArray<T>(
  items: T[],
  page: number,
  perPage: number,
): PaginatedResult<T> {
  const total = items.length;
  const data = items.slice((page - 1) * perPage, page * perPage);
  return {
    data,
    meta: buildPaginationMeta(total, page, perPage),
  };
}

export function hashQuery(params: Record<string, unknown>): string {
  const crypto = require('crypto') as typeof import('crypto');
  const sorted = JSON.stringify(
    Object.keys(params)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        if (params[key] !== undefined && params[key] !== '') {
          acc[key] = params[key];
        }
        return acc;
      }, {}),
  );
  return crypto.createHash('md5').update(sorted).digest('hex');
}
