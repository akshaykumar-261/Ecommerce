'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("hero_banners", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      badge_text: {
        type: Sequelize.STRING(120),
        allowNull: true,
      },

      heading_line_one: {
        type: Sequelize.STRING(120),
        allowNull: true,
      },

      heading_line_two: {
        type: Sequelize.STRING(120),
        allowNull: true,
      },

      description: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      image_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      image_public_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("hero_banners");
  },
};
