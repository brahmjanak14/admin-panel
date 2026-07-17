import type { Role } from '../../users/schema/users.schema';
import type { UserRow } from '../../users/schema/users.schema';

export type { Role };

export type Permission =
  | 'leads:read'
  | 'leads:write'
  | 'countries:read'
  | 'countries:write'
  | 'services:read'
  | 'services:write'
  | 'blogs:read'
  | 'blogs:write'
  | 'users:read'
  | 'users:write'
  | 'settings:write';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSession {
  user: User;
  tokens: AuthTokens;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

export interface DbUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  avatar: string | null;
  isActive: boolean;
}

export function mapDbUser(user: UserRow): DbUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
    role: user.role,
    avatar: user.avatar,
    isActive: user.isActive,
  };
}

// Re-export tables used by auth model
export { users, refreshTokens } from '../../users/schema/users.schema';
