import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class PriceSnapshot extends Model {
  public id!: string;
  public productId!: string;
  public price!: number | null;
  public originalPrice!: number | null;
  public discountPrice!: number | null;
  public stockStatus!: string | null;
  public rawData!: any | null;
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
  indexes: [
    { fields: ['productId'] },
    { fields: ['created_at'] }
  ]
});
