import { Router } from 'express';
import { universitiesController } from '../controller/universities.controller';
import { validate } from '../../../shared/middleware/validate';
import { authenticate } from '../../../shared/middleware/authenticate';
import { authorize } from '../../../shared/middleware/authorize';
import {
  idParamSchema,
  listQuerySchema,
  universitySchema,
} from '../util/universities.util';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize('countries:read'),
  validate(listQuerySchema, 'query'),
  universitiesController.list,
);

router.get(
  '/:id',
  authenticate,
  authorize('countries:read'),
  validate(idParamSchema, 'params'),
  universitiesController.getById,
);

router.post(
  '/',
  authenticate,
  authorize('countries:write'),
  validate(universitySchema),
  universitiesController.create,
);

router.patch(
  '/:id',
  authenticate,
  authorize('countries:write'),
  validate(idParamSchema, 'params'),
  validate(universitySchema),
  universitiesController.update,
);

router.delete(
  '/:id',
  authenticate,
  authorize('countries:write'),
  validate(idParamSchema, 'params'),
  universitiesController.delete,
);

export default router;
