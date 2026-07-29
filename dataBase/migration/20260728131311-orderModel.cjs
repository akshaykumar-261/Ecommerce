"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      address_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "addresses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      order_number: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },

      grand_total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      payment_status: {
        type: Sequelize.ENUM(
          "Pending",
          "Paid",
          "Failed",
          "Refunded"
        ),
        allowNull: false,
        defaultValue: "Pending",
      },

      order_status: {
        type: Sequelize.ENUM(
          "Pending",
          "Confirmed",
          "Packed",
          "Shipped",
          "Delivered",
          "Cancelled"
        ),
        allowNull: false,
        defaultValue: "Pending",
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
    await queryInterface.dropTable("orders");
  },
};