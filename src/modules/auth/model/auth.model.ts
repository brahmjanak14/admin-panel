import { and, eq, gt } from 'drizzle-orm';
import { db } from '../../../config/database';
import {
  mapDbUser,
  refreshTokens,
  users,
  type DbUser,
} from '../schema/auth.schema';

export type {
  AuthSession,
  AuthTokens,
  DbUser,
  JwtPayload,
  Permission,
  Role,
  User,
} from '../schema/auth.schema';

export const authModel = {
  async findUserByEmail(email: string): Promise<DbUser | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user ? mapDbUser(user) : null;
  },

  async findUserById(id: string): Promise<DbUser | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user ? mapDbUser(user) : null;
  },

  async createRefreshToken(userId: string, tokenHash: string, expiresAt: Date) {
    const [token] = await db
      .insert(refreshTokens)
      .values({ userId, tokenHash, expiresAt })
      .returning();
    return token;
  },

  async findRefreshToken(tokenHash: string) {
    const [token] = await db
      .select()
      .from(refreshTokens)
      .where(and(eq(refreshTokens.tokenHash, tokenHash), gt(refreshTokens.expiresAt, new Date())))
      .limit(1);

    if (!token) return null;

    const [user] = await db.select().from(users).where(eq(users.id, token.userId)).limit(1);
    return user ? { ...token, user } : null;
  },

  async revokeRefreshToken(tokenHash: string) {
    await db.delete(refreshTokens).where(eq(refreshTokens.tokenHash, tokenHash));
  },

  async revokeAllUserTokens(userId: string) {
    await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
  },
};
