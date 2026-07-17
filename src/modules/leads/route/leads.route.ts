import { Router } from 'express';
import { leadsController } from '../controller/leads.controller';
import { validate } from '../../../shared/middleware/validate';
import {
  leadIdParamSchema,
  leadListQuerySchema,
  updateLeadStatusSchema,
  createPublicLeadSchema,
} from '../util/leads.util';
import { authenticate } from '../../../shared/middleware/authenticate';
import { authorize } from '../../../shared/middleware/authorize';
import { publicLeadsLimiter } from '../../../shared/middleware/rateLimiter';

const adminRouter = Router();

adminRouter.get(
  '/',
  authenticate,
  authorize('leads:read'),
  validate(leadListQuerySchema, 'query'),
  leadsController.list,
);
adminRouter.get(
  '/export',
  authenticate,
  authorize('leads:read'),
  validate(leadListQuerySchema, 'query'),
  leadsController.exportCsv,
);
adminRouter.get(
  '/:id',
  authenticate,
  authorize('leads:read'),
  validate(leadIdParamSchema, 'params'),
  leadsController.getById,
);
adminRouter.patch(
  '/:id/status',
  authenticate,
  authorize('leads:write'),
  validate(leadIdParamSchema, 'params'),
  validate(updateLeadStatusSchema),
  leadsController.updateStatus,
);

const publicRouter = Router();
publicRouter.post(
  '/',
  publicLeadsLimiter,
  validate(createPublicLeadSchema),
  leadsController.createPublic,
);

export { adminRouter as leadsAdminRoutes, publicRouter as leadsPublicRoutes };
