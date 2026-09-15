import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class NotificationLog extends Model {
  declare id: string;
  declare userId: string;
  declare productId: string;
  declare alertId: string | null;
  declare channel: string;
  declare status: string;
  declare telegramMessageId: string | null;
  declare errorMessage: string | null;
  declare sentAt: Date;
}

NotificationLog.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  alertId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  channel: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  telegramMessageId: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sentAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'NotificationLog',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  indexes: [
    { fields: ['userId'] },
    { fields: ['productId'] }
  ]
});
