import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class TelegramBinding extends Model {
  public id!: string;
  public userId!: string;
  public telegramUserId!: string;
  public telegramUsername!: string | null;
  public bindingCode!: string;
  public isActive!: boolean;
}

TelegramBinding.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  telegramUserId: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  telegramUsername: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  bindingCode: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'TelegramBinding',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['telegram_user_id'] }
  ]
});
