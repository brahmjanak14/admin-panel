import { Router } from 'express';
import { careersController } from '../controller/careers.controller';
import { validate } from '../../../shared/middleware/validate';
import { authenticate } from '../../../shared/middleware/authenticate';
import { authorize } from '../../../shared/middleware/authorize';
import { careerSchema, listQuerySchema, slugParamSchema } from '../util/careers.util';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize('blogs:read'),
  validate(listQuerySchema, 'query'),
  careersController.list,
);

router.get(
  '/:slug',
  authenticate,
  authorize('blogs:read'),
  validate(slugParamSchema, 'params'),
  careersController.getBySlug,
);

router.post(
  '/',
  authenticate,
  authorize('blogs:write'),
  validate(careerSchema),
  careersController.create,
);

router.patch(
  '/:slug',
  authenticate,
  authorize('blogs:write'),
  validate(slugParamSchema, 'params'),
  validate(careerSchema),
  careersController.update,
);

router.delete(
  '/:slug',
  authenticate,
  authorize('blogs:write'),
  validate(slugParamSchema, 'params'),
  careersController.delete,
);

export default router;
