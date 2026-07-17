import { Router } from 'express';
import { eventsController } from '../controller/events.controller';
import { validate } from '../../../shared/middleware/validate';
import { authenticate } from '../../../shared/middleware/authenticate';
import { authorize } from '../../../shared/middleware/authorize';
import { eventSchema, idParamSchema, listQuerySchema } from '../util/events.util';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize('blogs:read'),
  validate(listQuerySchema, 'query'),
  eventsController.list,
);

router.get(
  '/:id',
  authenticate,
  authorize('blogs:read'),
  validate(idParamSchema, 'params'),
  eventsController.getById,
);

router.post(
  '/',
  authenticate,
  authorize('blogs:write'),
  validate(eventSchema),
  eventsController.create,
);

router.patch(
  '/:id',
  authenticate,
  authorize('blogs:write'),
  validate(idParamSchema, 'params'),
  validate(eventSchema),
  eventsController.update,
);

router.delete(
  '/:id',
  authenticate,
  authorize('blogs:write'),
  validate(idParamSchema, 'params'),
  eventsController.delete,
);

export default router;
