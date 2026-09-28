"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("contact_messages", {
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

      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      subject: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
      },

      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM("PENDING", "REPLIED", "CLOSED"),
        allowNull: false,
        defaultValue: "PENDING",
      },

      replied_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
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

    await queryInterface.addIndex("contact_messages", ["user_id"], {
      name: "contact_messages_user_id",
    });

    await queryInterface.addIndex("contact_messages", ["status"], {
      name: "contact_messages_status",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("contact_messages");
  },
};
