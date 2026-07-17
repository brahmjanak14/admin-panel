import { Router } from 'express';
import { settingsController } from '../controller/settings.controller';
import { validate } from '../../../shared/middleware/validate';
import { authenticate } from '../../../shared/middleware/authenticate';
import { authorize } from '../../../shared/middleware/authorize';
import { settingsSchema } from '../util/settings.util';

const router = Router();

router.get('/', authenticate, authorize('settings:write'), settingsController.get);
router.patch(
  '/',
  authenticate,
  authorize('settings:write'),
  validate(settingsSchema),
  settingsController.update,
);

export default router;
