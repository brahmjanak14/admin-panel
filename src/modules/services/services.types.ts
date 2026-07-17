import type { ServiceContent } from '../countries/countries.types';

export type { ServiceContent };

export type ServiceContentBody = Omit<ServiceContent, 'slug' | 'name'>;
