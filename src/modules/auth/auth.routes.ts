import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../shared/middleware/validate';
import { loginSchema, refreshSchema } from './auth.schema';
import { authenticate } from '../../shared/middleware/authenticate';
import { authLoginLimiter, authRefreshLimiter } from '../../shared/middleware/rateLimiter';

const router = Router();

router.post('/login', authLoginLimiter, validate(loginSchema), authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.me);
router.post('/refresh', authRefreshLimiter, validate(refreshSchema), authController.refresh);

export default router;
