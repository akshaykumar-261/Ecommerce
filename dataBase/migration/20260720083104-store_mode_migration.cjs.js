"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("stores", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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

      store_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },

      slug: {
        type: Sequelize.STRING(200),
        allowNull: false,
        unique: true,
      },

      store_logo: {
        type: Sequelize.STRING(300),
        allowNull: true,
      },

      store_banner: {
        type: Sequelize.STRING(300),
        allowNull: true,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      email: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },

      phoneNo: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },

      address: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      city: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      state: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      country: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      zipcode: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },

      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      rating: {
        type: Sequelize.DECIMAL(2, 1),
        defaultValue: 0.0,
      },

      total_products: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      total_orders: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("stores");
  },
};