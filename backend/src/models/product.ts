import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Product extends Model {
  declare id: string;
  declare userId: string;
  declare name: string;
  declare sourceUrl: string;
  declare normalizedUrl: string;
  declare shopeeItemId: string | null;
  declare shopeeShopId: string | null;
  declare imageUrl: string | null;
  declare currentPrice: number | null;
  declare currency: string;
  declare status: string;
  declare lastCheckedAt: Date | null;
  declare lastNotifiedPrice: number | null;
  declare lastNotifiedAt: Date | null;
}

Product.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  sourceUrl: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  normalizedUrl: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  shopeeItemId: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  shopeeShopId: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  currentPrice: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  currency: {
    type: DataTypes.STRING(10),
    defaultValue: 'IDR'
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'active'
  },
  lastCheckedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastNotifiedPrice: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  lastNotifiedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Product',
  indexes: [
    { fields: ['userId'] },
    { fields: ['status'] }
  ]
});
