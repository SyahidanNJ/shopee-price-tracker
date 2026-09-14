import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class NotificationLog extends Model {
  public id!: string;
  public userId!: string;
  public productId!: string;
  public alertId!: string;
  public channel!: string;
  public status!: string;
  public telegramMessageId!: string | null;
  public errorMessage!: string | null;
  public sentAt!: Date;
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
    allowNull: false
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
  indexes: [
    { fields: ['userId'] },
    { fields: ['productId'] }
  ]
});
