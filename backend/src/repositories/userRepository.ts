import { User } from '../models';

export const userRepository = {
  create: async (data: { email: string; passwordHash: string; name: string }) => {
    return User.create(data);
  },

  findByEmail: async (email: string) => {
    return User.findOne({ where: { email } });
  },

  findById: async (id: string) => {
    return User.findByPk(id);
  }
};
