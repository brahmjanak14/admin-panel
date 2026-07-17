import type { Permission, Role } from '../modules/auth/auth.types';

export const ALL_PERMISSIONS: Permission[] = [
  'leads:read',
  'leads:write',
  'countries:read',
  'countries:write',
  'services:read',
  'services:write',
  'blogs:read',
  'blogs:write',
  'users:read',
  'users:write',
  'settings:write',
];

export const rolePermissions: Record<Role, Permission[]> = {
  super_admin: ALL_PERMISSIONS,
  admin: ALL_PERMISSIONS.filter((p) => !p.startsWith('users:')),
  editor: [
    'leads:read',
    'countries:read',
    'countries:write',
    'services:read',
    'services:write',
    'blogs:read',
    'blogs:write',
  ],
  viewer: ['leads:read', 'countries:read', 'services:read', 'blogs:read'],
};

export const DEFAULT_PAGE = 1;
export const DEFAULT_PER_PAGE = 20;
export const MAX_PER_PAGE = 100;
