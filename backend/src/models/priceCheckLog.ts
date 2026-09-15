import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class PriceCheckLog extends Model {
  declare id: string;
  declare productId: string;
  declare status: string;
  declare errorMessage: string | null;
  declare durationMs: number | null;
}

PriceCheckLog.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  durationMs: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'PriceCheckLog',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    { fields: ['productId'] },
    { fields: ['created_at'] }
  ]
});
