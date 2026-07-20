"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "categories",
      [
        {
          cat_name: "Electronics",
          slug: "electronics",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cat_name: "Mobiles",
          slug: "mobiles",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cat_name: "Laptops",
          slug: "laptops",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cat_name: "Computers & Accessories",
          slug: "computers-accessories",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cat_name: "Fashion",
          slug: "fashion",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cat_name: "Men's Clothing",
          slug: "mens-clothing",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cat_name: "Children's Clothing",
          slug: "childs-clothing",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cat_name: "Women's Clothing",
          slug: "womens-clothing",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cat_name: "Footwear",
          slug: "footwear",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cat_name: "Beauty & Personal Care",
          slug: "beauty-personal-care",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cat_name: "Home & Kitchen",
          slug: "home-kitchen",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cat_name: "Furniture",
          slug: "furniture",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cat_name: "Grocery",
          slug: "grocery",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cat_name: "Books",
          slug: "books",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cat_name: "Sports & Fitness",
          slug: "sports-fitness",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cat_name: "Automotive",
          slug: "automotive",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cat_name: "Pet Supplies",
          slug: "pet-supplies",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cat_name: "Office Supplies",
          slug: "office-supplies",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cat_name: "Jewellery",
          slug: "jewellery",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cat_name: "Bags & Luggage",
          slug: "bags-luggage",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cat_name: "Toys & Games",
          slug: "toys-games",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("categories", null, {});
  },
};
