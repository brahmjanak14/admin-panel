import { createCrudModule } from '../../shared/crud/createCrudModule';
import { z } from 'zod';

const schema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export default createCrudModule({
  model: 'faq',
  permission: { read: 'blogs:read', write: 'blogs:write' },
  schema,
  idField: 'id',
});
