import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Alert extends Model {
  declare id: string;
  declare userId: string;
  declare productId: string;
  declare isActive: boolean;
  declare alertType: string;
  declare targetPrice: number | null;
  declare minDropPercentage: number | null;
  declare cooldownMinutes: number;
}

const alertTypes = ['any_drop', 'target_price', 'min_drop_percentage'];

Alert.init({
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
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  alertType: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  targetPrice: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  minDropPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  cooldownMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 360
  }
}, {
  sequelize,
  modelName: 'Alert',
  indexes: [
    { fields: ['userId'] },
    { fields: ['productId'] }
  ]
});
