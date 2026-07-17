import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import dashboardRoutes from '../modules/dashboard/dashboard.routes';
import { leadsAdminRoutes, leadsPublicRoutes } from '../modules/leads/leads.routes';
import countriesRoutes from '../modules/countries/countries.routes';
import servicesRoutes from '../modules/services/services.routes';
import blogsRoutes from '../modules/blogs/blogs.routes';
import universitiesRoutes from '../modules/universities/universities.routes';
import eventsRoutes from '../modules/events/events.routes';
import testimonialsRoutes from '../modules/testimonials/testimonials.routes';
import faqsRoutes from '../modules/faqs/faqs.routes';
import careersRoutes from '../modules/careers/careers.routes';
import mediaRoutes from '../modules/media/media.routes';
import usersRoutes from '../modules/users/users.routes';
import settingsRoutes from '../modules/settings/settings.routes';
import { generalLimiter } from '../shared/middleware/rateLimiter';

const router = Router();

router.use('/auth', authRoutes);
router.use('/public/leads', leadsPublicRoutes);
router.use('/admin', generalLimiter);
router.use('/admin/dashboard', dashboardRoutes);
router.use('/admin/leads', leadsAdminRoutes);
router.use('/admin/countries', countriesRoutes);
router.use('/admin/services', servicesRoutes);
router.use('/admin/blogs', blogsRoutes);
router.use('/admin/universities', universitiesRoutes);
router.use('/admin/events', eventsRoutes);
router.use('/admin/testimonials', testimonialsRoutes);
router.use('/admin/faqs', faqsRoutes);
router.use('/admin/careers', careersRoutes);
router.use('/admin/media', mediaRoutes);
router.use('/admin/users', usersRoutes);
router.use('/admin/settings', settingsRoutes);

export default router;
