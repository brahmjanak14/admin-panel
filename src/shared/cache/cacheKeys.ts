export const cacheKeys = {
  dashboardStats: () => 'dashboard:stats',
  countriesList: (hash: string) => `countries:list:${hash}`,
  countrySlug: (slug: string) => `countries:slug:${slug}`,
  servicesList: (hash: string) => `services:list:${hash}`,
  serviceSlug: (slug: string) => `services:slug:${slug}`,
  blogsList: (hash: string) => `blogs:list:${hash}`,
  blogSlug: (slug: string) => `blogs:slug:${slug}`,
};

export const cachePatterns = {
  countries: 'countries:*',
  services: 'services:*',
  blogs: 'blogs:*',
  dashboard: 'dashboard:*',
};
