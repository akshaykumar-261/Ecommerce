"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("hero_banners", [
      {
        badge_text: "Mega Sale — Up to 70% Off",
        heading_line_one: "Discover the",
        heading_line_two: "Best Deals Online",
        description:
          "Shop from thousands of products across 20+ categories. Unbeatable prices, fast delivery, and secure payments.",
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("hero_banners", null, {});
  },
};
