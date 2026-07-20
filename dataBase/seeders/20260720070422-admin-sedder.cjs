const bcrypt = require("bcrypt");
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashPassword = await bcrypt.hash("Admin123@", 10);
    await queryInterface.bulkInsert("users", [
      {
        name: "Admin",
        lastname:"User",
        email: "admin123@yopmail.com",
        password: hashPassword,
        phoneNo: "7658943648",
        address: "847, Darpan City, Delhi",
        role_Id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
