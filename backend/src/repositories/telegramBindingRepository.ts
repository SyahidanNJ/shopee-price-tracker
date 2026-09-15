import { TelegramBinding } from '../models/telegramBinding';
import { Op } from 'sequelize';

export const telegramBindingRepository = {
  findByUserId: async (userId: string) => {
    return TelegramBinding.findOne({ where: { userId } });
  },

  findByTelegramUserId: async (telegramUserId: string) => {
    return TelegramBinding.findOne({ where: { telegramUserId } });
  },

  findByBindingCode: async (bindingCode: string) => {
    return TelegramBinding.findOne({ where: { bindingCode } });
  },

  findById: async (id: string) => {
    return TelegramBinding.findByPk(id);
  },

  create: async (data: any) => {
    return TelegramBinding.create(data);
  },

  update: async (id: string, data: any) => {
    return TelegramBinding.update(data, { where: { id } });
  },

  delete: async (id: string) => {
    return TelegramBinding.destroy({ where: { id } });
  },

  deactivateByUserId: async (userId: string) => {
    return TelegramBinding.update(
      { isActive: false },
      { where: { userId } }
    );
  }
};
