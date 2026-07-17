import { Router } from 'express';
import { countriesController } from '../controller/countries.controller';
import { validate } from '../../../shared/middleware/validate';
import { countryListQuerySchema, countrySchema, countrySlugParamSchema } from '../util/countries.util';
import { authenticate } from '../../../shared/middleware/authenticate';
import { authorize } from '../../../shared/middleware/authorize';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize('countries:read'),
  validate(countryListQuerySchema, 'query'),
  countriesController.list,
);
router.get(
  '/:slug',
  authenticate,
  authorize('countries:read'),
  validate(countrySlugParamSchema, 'params'),
  countriesController.getBySlug,
);
router.post(
  '/',
  authenticate,
  authorize('countries:write'),
  validate(countrySchema),
  countriesController.create,
);
router.patch(
  '/:slug',
  authenticate,
  authorize('countries:write'),
  validate(countrySlugParamSchema, 'params'),
  validate(countrySchema),
  countriesController.update,
);
router.delete(
  '/:slug',
  authenticate,
  authorize('countries:write'),
  validate(countrySlugParamSchema, 'params'),
  countriesController.delete,
);

export default router;
