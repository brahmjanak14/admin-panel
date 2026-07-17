import { Router } from 'express';
import { blogsController } from './blogs.controller';
import { validate } from '../../shared/middleware/validate';
import { blogListQuerySchema, blogSchema, blogSlugParamSchema } from './blogs.schema';
import { authenticate } from '../../shared/middleware/authenticate';
import { authorize } from '../../shared/middleware/authorize';

const router = Router();

router.get('/', authenticate, authorize('blogs:read'), validate(blogListQuerySchema, 'query'), blogsController.list);
router.get('/:slug', authenticate, authorize('blogs:read'), validate(blogSlugParamSchema, 'params'), blogsController.getBySlug);
router.post('/', authenticate, authorize('blogs:write'), validate(blogSchema), blogsController.create);
router.patch('/:slug', authenticate, authorize('blogs:write'), validate(blogSlugParamSchema, 'params'), validate(blogSchema), blogsController.update);
router.delete('/:slug', authenticate, authorize('blogs:write'), validate(blogSlugParamSchema, 'params'), blogsController.delete);

export default router;
