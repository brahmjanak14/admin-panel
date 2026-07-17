import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { authenticate } from '../../shared/middleware/authenticate';

const router = Router();

router.get('/', authenticate, dashboardController.getStats);

export default router;
