"use strict";

/*
 * Adds an admin-controlled switch for the hero badge pill
 * ("Mega Sale — Up to 70% Off"). Defaults to true so the existing
 * banner keeps rendering exactly as before until an admin turns it off.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("hero_banners", "show_badge", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("hero_banners", "show_badge");
  },
};
