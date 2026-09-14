import { RefreshToken } from '../models';

export const refreshTokenRepository = {
  create: async (data: { userId: string; tokenHash: string; expiresAt: Date }) => {
    return RefreshToken.create(data);
  },

  findByTokenHash: async (tokenHash: string) => {
    return RefreshToken.findOne({ where: { tokenHash } });
  },

  findById: async (id: string) => {
    return RefreshToken.findByPk(id);
  },

  revoke: async (id: string) => {
    await RefreshToken.update(
      { revokedAt: new Date() },
      { where: { id } }
    );
  },

  revokeByUserId: async (userId: string) => {
    await RefreshToken.update(
      { revokedAt: new Date() },
      { where: { userId } }
    );
  },

  revokeExpired: async () => {
    await RefreshToken.update(
      { revokedAt: new Date() },
      { where: { expiresAt: { [Op.lte]: new Date() } } }
    );
  }
};
