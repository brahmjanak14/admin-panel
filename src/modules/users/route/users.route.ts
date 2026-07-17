import { Router } from 'express';
import { usersController } from '../controller/users.controller';
import { validate } from '../../../shared/middleware/validate';
import { authenticate } from '../../../shared/middleware/authenticate';
import { authorize } from '../../../shared/middleware/authorize';
import { createUserSchema, idParamSchema, listQuerySchema, userSchema } from '../util/users.util';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize('users:read'),
  validate(listQuerySchema, 'query'),
  usersController.list,
);

router.get(
  '/:id',
  authenticate,
  authorize('users:read'),
  validate(idParamSchema, 'params'),
  usersController.getById,
);

router.post(
  '/',
  authenticate,
  authorize('users:write'),
  validate(createUserSchema),
  usersController.create,
);

router.patch(
  '/:id',
  authenticate,
  authorize('users:write'),
  validate(idParamSchema, 'params'),
  validate(userSchema.partial()),
  usersController.update,
);

router.delete(
  '/:id',
  authenticate,
  authorize('users:write'),
  validate(idParamSchema, 'params'),
  usersController.delete,
);

export default router;
