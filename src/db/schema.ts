/**
 * Aggregated Drizzle schema for the DB client / drizzle-kit.
 * Table definitions live in each module's `schema/` folder.
 */
export * from '../db/enums';
export {
  users,
  refreshTokens,
  usersRelations,
  refreshTokensRelations,
} from '../modules/users/schema/users.schema';
export { leads } from '../modules/leads/schema/leads.schema';
export { countries } from '../modules/countries/schema/countries.schema';
export { services } from '../modules/services/schema/services.schema';
export { blogs } from '../modules/blogs/schema/blogs.schema';
export { universities } from '../modules/universities/schema/universities.schema';
export { events } from '../modules/events/schema/events.schema';
export { testimonials } from '../modules/testimonials/schema/testimonials.schema';
export { faqs } from '../modules/faqs/schema/faqs.schema';
export { careers } from '../modules/careers/schema/careers.schema';
export { media } from '../modules/media/schema/media.schema';
export { settings } from '../modules/settings/schema/settings.schema';
