import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { UnauthorizedError } from '../../shared/errors/UnauthorizedError';
import { comparePassword, hashToken } from '../../shared/utils/password';
import { authRepository } from './auth.repository';
import type { AuthSession, JwtPayload, User } from './auth.types';

function toUser(user: {
  id: string;
  name: string;
  email: string;
  role: User['role'];
  avatar?: string | null;
}): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar ?? undefined,
  };
}

function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

function getRefreshExpiry(): Date {
  const match = env.JWT_REFRESH_EXPIRES_IN.match(/^(\d+)([dhms])$/);
  if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const value = Number(match[1]);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    d: 24 * 60 * 60 * 1000,
    h: 60 * 60 * 1000,
    m: 60 * 1000,
    s: 1000,
  };
  return new Date(Date.now() + value * (multipliers[unit] ?? multipliers.d));
}

export const authService = {
  async login(email: string, password: string): Promise<AuthSession> {
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const dbUser = await authRepository.findUserById(user.id);
    if (!dbUser?.isActive) {
      throw new UnauthorizedError('Account is inactive');
    }

    return this.issueSession(user);
  },

  async issueSession(user: {
    id: string;
    name: string;
    email: string;
    role: User['role'];
    avatar?: string | null;
  }): Promise<AuthSession> {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await authRepository.createRefreshToken(
      user.id,
      hashToken(refreshToken),
      getRefreshExpiry(),
    );

    return {
      user: toUser(user),
      tokens: { accessToken, refreshToken },
    };
  },

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as JwtPayload;
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const stored = await authRepository.findRefreshToken(hashToken(refreshToken));
    if (!stored || stored.userId !== decoded.sub) {
      throw new UnauthorizedError('Refresh token revoked or expired');
    }

    const user = await authRepository.findUserById(decoded.sub);
    if (!user?.isActive) {
      throw new UnauthorizedError('User not found or inactive');
    }

    await authRepository.revokeRefreshToken(hashToken(refreshToken));
    const session = await this.issueSession(user);
    return session.tokens;
  },

  async logout(refreshToken?: string, userId?: string) {
    if (refreshToken) {
      await authRepository.revokeRefreshToken(hashToken(refreshToken));
    } else if (userId) {
      await authRepository.revokeAllUserTokens(userId);
    }
  },

  async me(userId: string): Promise<User> {
    const user = await authRepository.findUserById(userId);
    if (!user?.isActive) {
      throw new UnauthorizedError('User not found');
    }
    return toUser(user);
  },
};
