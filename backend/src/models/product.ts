import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Product extends Model {
  public id!: string;
  public userId!: string;
  public name!: string;
  public sourceUrl!: string;
  public normalizedUrl!: string;
  public shopeeItemId!: string | null;
  public shopeeShopId!: string | null;
  public imageUrl!: string | null;
  public currentPrice!: number | null;
  public currency!: string;
  public status!: string;
  public lastCheckedAt!: Date | null;
  public lastNotifiedPrice!: number | null;
  public lastNotifiedAt!: Date | null;
}

const statuses = ['active', 'paused', 'error', 'not_found', 'out_of_stock'];

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
