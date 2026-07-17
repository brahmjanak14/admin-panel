import { prisma } from '../../config/database';
import type { DbUser, Role } from './auth.types';

export const authRepository = {
  async findUserByEmail(email: string): Promise<(DbUser & { isActive: boolean }) | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return { ...mapUser(user), isActive: user.isActive };
  },

  async findUserById(id: string): Promise<(DbUser & { isActive: boolean }) | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return { ...mapUser(user), isActive: user.isActive };
  },

  async createRefreshToken(userId: string, tokenHash: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: { userId, tokenHash, expiresAt },
    });
  },

  async findRefreshToken(tokenHash: string) {
    return prisma.refreshToken.findFirst({
      where: { tokenHash, expiresAt: { gt: new Date() } },
      include: { user: true },
    });
  },

  async revokeRefreshToken(tokenHash: string) {
    await prisma.refreshToken.deleteMany({ where: { tokenHash } });
  },

  async revokeAllUserTokens(userId: string) {
    await prisma.refreshToken.deleteMany({ where: { userId } });
  },
};

function mapUser(user: {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  avatar: string | null;
}): DbUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
    role: user.role as Role,
    avatar: user.avatar,
    isActive: true,
  };
}
