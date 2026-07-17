export type Role = 'super_admin' | 'admin' | 'editor' | 'viewer';

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
