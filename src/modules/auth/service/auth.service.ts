import jwt from 'jsonwebtoken';
import { env } from '../../../config/env';
import { UnauthorizedError } from '../../../shared/errors/UnauthorizedError';
import { comparePassword, hashToken } from '../../../shared/utils/password';
import { authModel, type AuthSession, type JwtPayload, type User } from '../model/auth.model';
import { getRefreshExpiry, signAccessToken, signRefreshToken, toUser } from '../util/auth.util';

export const authService = {
  async login(email: string, password: string): Promise<AuthSession> {
    const user = await authModel.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const dbUser = await authModel.findUserById(user.id);
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

    await authModel.createRefreshToken(
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

    const stored = await authModel.findRefreshToken(hashToken(refreshToken));
    if (!stored || stored.userId !== decoded.sub) {
      throw new UnauthorizedError('Refresh token revoked or expired');
    }

    const user = await authModel.findUserById(decoded.sub);
    if (!user?.isActive) {
      throw new UnauthorizedError('User not found or inactive');
    }

    await authModel.revokeRefreshToken(hashToken(refreshToken));
    const session = await this.issueSession(user);
    return session.tokens;
  },

  async logout(refreshToken?: string, userId?: string) {
    if (refreshToken) {
      await authModel.revokeRefreshToken(hashToken(refreshToken));
    } else if (userId) {
      await authModel.revokeAllUserTokens(userId);
    }
  },

  async me(userId: string): Promise<User> {
    const user = await authModel.findUserById(userId);
    if (!user?.isActive) {
      throw new UnauthorizedError('User not found');
    }
    return toUser(user);
  },
};
