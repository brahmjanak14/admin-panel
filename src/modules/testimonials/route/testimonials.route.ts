import { Router } from 'express';
import { testimonialsController } from '../controller/testimonials.controller';
import { validate } from '../../../shared/middleware/validate';
import { authenticate } from '../../../shared/middleware/authenticate';
import { authorize } from '../../../shared/middleware/authorize';
import {
  idParamSchema,
  listQuerySchema,
  testimonialSchema,
} from '../util/testimonials.util';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize('blogs:read'),
  validate(listQuerySchema, 'query'),
  testimonialsController.list,
);

router.get(
  '/:id',
  authenticate,
  authorize('blogs:read'),
  validate(idParamSchema, 'params'),
  testimonialsController.getById,
);

router.post(
  '/',
  authenticate,
  authorize('blogs:write'),
  validate(testimonialSchema),
  testimonialsController.create,
);

router.patch(
  '/:id',
  authenticate,
  authorize('blogs:write'),
  validate(idParamSchema, 'params'),
  validate(testimonialSchema),
  testimonialsController.update,
);

router.delete(
  '/:id',
  authenticate,
  authorize('blogs:write'),
  validate(idParamSchema, 'params'),
  testimonialsController.delete,
);

export default router;
