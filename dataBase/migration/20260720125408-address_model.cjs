"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("addresses", {
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

      name: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },

      address: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },

      city: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },

      zipcode: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },

      landmark: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },

      state: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },

      country: {
        type: Sequelize.STRING(200),
        allowNull: false,
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("addresses");
  },
};