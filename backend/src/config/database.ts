import { Sequelize } from 'sequelize';
import { config } from './index';

export const sequelize = new Sequelize(config.databaseUrl!, {
  dialect: 'postgres',
  logging: false,
  define: {
    timestamps: true,
    underscored: true
  }
});

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    return true;
  } catch {
    return false;
  }
};
