import { Router } from 'express';
import { faqsController } from '../controller/faqs.controller';
import { validate } from '../../../shared/middleware/validate';
import { authenticate } from '../../../shared/middleware/authenticate';
import { authorize } from '../../../shared/middleware/authorize';
import { faqSchema, idParamSchema, listQuerySchema } from '../util/faqs.util';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize('blogs:read'),
  validate(listQuerySchema, 'query'),
  faqsController.list,
);

router.get(
  '/:id',
  authenticate,
  authorize('blogs:read'),
  validate(idParamSchema, 'params'),
  faqsController.getById,
);

router.post('/', authenticate, authorize('blogs:write'), validate(faqSchema), faqsController.create);

router.patch(
  '/:id',
  authenticate,
  authorize('blogs:write'),
  validate(idParamSchema, 'params'),
  validate(faqSchema),
  faqsController.update,
);

router.delete(
  '/:id',
  authenticate,
  authorize('blogs:write'),
  validate(idParamSchema, 'params'),
  faqsController.delete,
);

export default router;
