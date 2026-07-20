"use strict";

const { allow } = require("joi");

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await (queryInterface.createTable("categories", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
       primaryKey: true
      },
      cat_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(200),
        allowNull: false,
        unique: true,
      },
      is_active: {
        type: Sequelize.STRING(200),
        allowNull: false,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }))
  },

  async down(queryInterface, Sequelize) {
  await queryInterface.dropTable("categories");
  },
};
