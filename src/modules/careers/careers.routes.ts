import { createCrudModule } from '../../shared/crud/createCrudModule';
import { z } from 'zod';

const schema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  department: z.string().min(1),
  location: z.string().min(1),
  type: z.enum(['full-time', 'part-time', 'contract']),
  experience: z.string(),
  description: z.string(),
  responsibilities: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
});

export default createCrudModule({
  model: 'career',
  permission: { read: 'blogs:read', write: 'blogs:write' },
  schema,
  idField: 'slug',
  mapTypeField: (data) => ({
    ...data,
    type: String(data.type).replace(/-/g, '_'),
  }),
  mapFromDb: (row) => ({
    ...row,
    type: String(row.type).replace(/_/g, '-'),
  }),
});
