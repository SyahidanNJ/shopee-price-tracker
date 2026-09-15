const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });

    await queryInterface.createTable('refresh_tokens', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      token_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      revoked_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });

    await queryInterface.createTable('telegram_bindings', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      telegram_user_id: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      telegram_username: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      binding_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });

    await queryInterface.createTable('products', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
      source_url: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      normalized_url: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      shopee_item_id: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      shopee_shop_id: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      image_url: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      current_price: {
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
      last_checked_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      last_notified_price: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      last_notified_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });

    await queryInterface.createTable('price_snapshots', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      original_price: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      discount_price: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      stock_status: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      raw_data: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });

    await queryInterface.createTable('alerts', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      alert_type: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      target_price: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      min_drop_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
      },
      cooldown_minutes: {
        type: DataTypes.INTEGER,
        defaultValue: 360
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });

    await queryInterface.createTable('notification_logs', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      alert_id: {
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
      telegram_message_id: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      error_message: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      sent_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });

    await queryInterface.createTable('price_check_logs', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      error_message: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      duration_ms: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });

    // Add indexes
    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('products', ['user_id']);
    await queryInterface.addIndex('products', ['status']);
    await queryInterface.addIndex('alerts', ['user_id', 'product_id']);
    await queryInterface.addIndex('telegram_bindings', ['user_id', 'binding_code']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('price_check_logs');
    await queryInterface.dropTable('notification_logs');
    await queryInterface.dropTable('alerts');
    await queryInterface.dropTable('price_snapshots');
    await queryInterface.dropTable('products');
    await queryInterface.dropTable('telegram_bindings');
    await queryInterface.dropTable('refresh_tokens');
    await queryInterface.dropTable('users');
  }
};
