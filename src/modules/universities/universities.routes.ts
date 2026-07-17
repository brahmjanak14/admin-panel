import { createCrudModule } from '../../shared/crud/createCrudModule';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  country: z.string().min(1),
  ranking: z.number().int(),
  logo: z.string().optional(),
  location: z.string().min(1),
  programs: z.array(z.string()).default([]),
});

export default createCrudModule({
  model: 'university',
  permission: { read: 'countries:read', write: 'countries:write' },
  schema,
  idField: 'id',
});
