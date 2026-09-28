"use strict";

/*
 * Guests (no account) and unverified users can now send contact messages, so
 * user_id must accept NULL. The FK is re-created with ON DELETE SET NULL
 * instead of CASCADE so an enquiry is never destroyed because the sender
 * later deletes their account.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [constraints] = await queryInterface.sequelize.query(
      `SELECT CONSTRAINT_NAME AS name
         FROM information_schema.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'contact_messages'
          AND COLUMN_NAME = 'user_id'
          AND REFERENCED_TABLE_NAME IS NOT NULL`,
    );

    for (const constraint of constraints) {
      await queryInterface.removeConstraint("contact_messages", constraint.name);
    }

    await queryInterface.changeColumn("contact_messages", "user_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addConstraint("contact_messages", {
      fields: ["user_id"],
      type: "foreign key",
      name: "contact_messages_user_id_fk",
      references: { table: "users", field: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    // Orphan rows cannot satisfy the original NOT NULL constraint.
    await queryInterface.sequelize.query(
      "DELETE FROM contact_messages WHERE user_id IS NULL",
    );

    const [constraints] = await queryInterface.sequelize.query(
      `SELECT CONSTRAINT_NAME AS name
         FROM information_schema.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'contact_messages'
          AND COLUMN_NAME = 'user_id'
          AND REFERENCED_TABLE_NAME IS NOT NULL`,
    );

    for (const constraint of constraints) {
      await queryInterface.removeConstraint("contact_messages", constraint.name);
    }

    await queryInterface.changeColumn("contact_messages", "user_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.addConstraint("contact_messages", {
      fields: ["user_id"],
      type: "foreign key",
      name: "contact_messages_user_id_fk",
      references: { table: "users", field: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },
};
