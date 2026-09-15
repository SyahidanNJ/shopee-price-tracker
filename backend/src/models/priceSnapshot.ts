import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class PriceSnapshot extends Model {
  declare id: string;
  declare productId: string;
  declare price: number | null;
  declare originalPrice: number | null;
  declare discountPrice: number | null;
  declare stockStatus: string | null;
  declare rawData: any | null;
}

PriceSnapshot.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  originalPrice: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  discountPrice: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  stockStatus: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  rawData: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'PriceSnapshot',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    { fields: ['productId'] },
    { fields: ['created_at'] }
  ]
});
