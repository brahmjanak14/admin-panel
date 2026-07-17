import { Router } from 'express';
import { dashboardController } from '../controller/dashboard.controller';
import { authenticate } from '../../../shared/middleware/authenticate';

const router = Router();

router.get('/', authenticate, dashboardController.getStats);

export default router;
