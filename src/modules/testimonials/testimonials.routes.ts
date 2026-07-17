import { createCrudModule } from '../../shared/crud/createCrudModule';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  country: z.string().min(1),
  quote: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  avatar: z.string().optional(),
  university: z.string().optional(),
});

export default createCrudModule({
  model: 'testimonial',
  permission: { read: 'blogs:read', write: 'blogs:write' },
  schema,
  idField: 'id',
});
