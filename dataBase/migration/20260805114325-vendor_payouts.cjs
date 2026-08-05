"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("vendor_payouts", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "orders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      payment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "payments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      stripe_account_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      gross_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      platform_fee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      vendor_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      currency: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "usd",
      },

      transfer_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      payout_status: {
        type: Sequelize.ENUM("pending", "paid", "failed", "refunded"),
        allowNull: false,
        defaultValue: "pending",
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("vendor_payouts");
  },
};
