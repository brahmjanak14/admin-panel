import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { AppError } from '../../../shared/errors/AppError';
import { buildPaginationMeta } from '../../../shared/utils/pagination';
import { hashPassword } from '../../../shared/utils/password';
import { usersModel, type AdminUser } from '../model/users.model';

export const usersService = {
  async list(query: { page?: number; perPage?: number; search?: string }) {
    const result = await usersModel.findMany(query);
    return {
      data: result.items,
      meta: buildPaginationMeta(result.total, result.page, result.perPage),
    };
  },

  async getById(id: string): Promise<AdminUser> {
    const user = await usersModel.findById(id);
    if (!user) throw new NotFoundError('User not found');
    return user;
  },

  async create(input: {
    name: string;
    email: string;
    password: string;
    role: string;
    avatar?: string;
  }): Promise<AdminUser> {
    const exists = await usersModel.findByEmail(input.email);
    if (exists) throw new AppError('Email already in use', 409);

    return usersModel.create({
      name: input.name,
      email: input.email,
      passwordHash: await hashPassword(input.password),
      role: input.role,
      avatar: input.avatar,
    });
  },

  async update(
    id: string,
    input: {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
      avatar?: string;
    },
  ): Promise<AdminUser> {
    const data: Record<string, unknown> = {};
    if (input.name) data.name = input.name;
    if (input.email) data.email = input.email;
    if (input.role) data.role = input.role;
    if (input.avatar !== undefined) data.avatar = input.avatar;
    if (input.password) data.passwordHash = await hashPassword(input.password);

    try {
      return await usersModel.update(id, data);
    } catch {
      throw new NotFoundError('User not found');
    }
  },

  async delete(id: string, currentUserId?: string): Promise<void> {
    if (currentUserId === id) {
      throw new AppError('Cannot delete your own account', 400);
    }
    try {
      await usersModel.delete(id);
    } catch {
      throw new NotFoundError('User not found');
    }
  },
};
