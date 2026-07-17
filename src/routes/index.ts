import { Router } from 'express';
import authRoutes from '../modules/auth/route/auth.route';
import dashboardRoutes from '../modules/dashboard/route/dashboard.route';
import { leadsAdminRoutes, leadsPublicRoutes } from '../modules/leads/route/leads.route';
import countriesRoutes from '../modules/countries/route/countries.route';
import servicesRoutes from '../modules/services/route/services.route';
import blogsRoutes from '../modules/blogs/route/blogs.route';
import universitiesRoutes from '../modules/universities/route/universities.route';
import eventsRoutes from '../modules/events/route/events.route';
import testimonialsRoutes from '../modules/testimonials/route/testimonials.route';
import faqsRoutes from '../modules/faqs/route/faqs.route';
import careersRoutes from '../modules/careers/route/careers.route';
import mediaRoutes from '../modules/media/route/media.route';
import usersRoutes from '../modules/users/route/users.route';
import settingsRoutes from '../modules/settings/route/settings.route';
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
