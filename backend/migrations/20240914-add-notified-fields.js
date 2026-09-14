const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('products', 'last_notified_price', {
      type: DataTypes.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('products', 'last_notified_at', {
      type: DataTypes.DATE,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('products', 'last_notified_price');
    await queryInterface.removeColumn('products', 'last_notified_at');
  }
};
