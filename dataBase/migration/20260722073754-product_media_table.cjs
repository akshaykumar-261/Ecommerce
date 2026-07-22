"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("product_media", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "products", // Product table ka naam
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      media_type: {
        type: Sequelize.ENUM("images", "video"),
        allowNull: false,
      },

      media_url: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },

      public_id: {
        type: Sequelize.STRING(250),
        allowNull: false,
      },

      is_primary: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      sort_order: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },

      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },

      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("product_media");

    // ENUM remove karne ke liye (MySQL me ignore ho sakta hai)
    await queryInterface.sequelize.query(
      "DROP TYPE IF EXISTS enum_product_media_media_type;"
    );
  },
};