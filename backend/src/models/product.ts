const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
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

module.exports = Product;
