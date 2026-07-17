import { createCrudModule } from '../../shared/crud/createCrudModule';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1),
  date: z.string(),
  location: z.string().min(1),
  type: z.enum(['webinar', 'fair', 'workshop']),
  description: z.string(),
});

export default createCrudModule({
  model: 'event',
  permission: { read: 'blogs:read', write: 'blogs:write' },
  schema,
  idField: 'id',
  transformCreate: (data) => ({
    ...data,
    date: new Date(data.date as string),
  }),
  transformUpdate: (data) => ({
    ...data,
    ...(data.date ? { date: new Date(data.date as string) } : {}),
  }),
});
