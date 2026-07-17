import { Router } from 'express';
import { servicesController } from '../controller/services.controller';
import { validate } from '../../../shared/middleware/validate';
import { serviceListQuerySchema, serviceSchema, serviceSlugParamSchema } from '../util/services.util';
import { authenticate } from '../../../shared/middleware/authenticate';
import { authorize } from '../../../shared/middleware/authorize';

const router = Router();

router.get('/', authenticate, authorize('services:read'), validate(serviceListQuerySchema, 'query'), servicesController.list);
router.get('/:slug', authenticate, authorize('services:read'), validate(serviceSlugParamSchema, 'params'), servicesController.getBySlug);
router.post('/', authenticate, authorize('services:write'), validate(serviceSchema), servicesController.create);
router.patch('/:slug', authenticate, authorize('services:write'), validate(serviceSlugParamSchema, 'params'), validate(serviceSchema), servicesController.update);
router.delete('/:slug', authenticate, authorize('services:write'), validate(serviceSlugParamSchema, 'params'), servicesController.delete);

export default router;
