import { Router } from 'express';
import { mediaController } from '../controller/media.controller';
import { authenticate } from '../../../shared/middleware/authenticate';
import { authorize } from '../../../shared/middleware/authorize';
import { mediaUploadLimiter } from '../../../shared/middleware/rateLimiter';
import { validate } from '../../../shared/middleware/validate';
import { idParamSchema, listQuerySchema, upload } from '../util/media.util';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize('blogs:read'),
  validate(listQuerySchema, 'query'),
  mediaController.list,
);

router.post(
  '/upload',
  authenticate,
  authorize('blogs:write'),
  mediaUploadLimiter,
  upload.single('file'),
  mediaController.upload,
);

router.delete(
  '/:id',
  authenticate,
  authorize('blogs:write'),
  validate(idParamSchema, 'params'),
  mediaController.delete,
);

export default router;
