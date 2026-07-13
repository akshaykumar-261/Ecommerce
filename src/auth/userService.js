import { Op } from "sequelize";
export default class UserServices {
  async init(db) {
    this.Model = db.models;
  }
}

getByEmail = async (email) => {
  if (!email) return null;
  return await this.Model.Users.findOne({
    where: {
      email: email.toLowerCase().trim(),
      deletedAt: null,
    },
  });
};

createUser = async (id, payload) => {
  const user = await this.Model.Users.create(payload);
  return await this.Model.Users.findByPk(user.id, {
    attributes: {
      exclude: [
        "password",
        "createdAt",
        "updatedAt",
        "department_Id",
        "refreshToken",
        "otp",
        "otp_expire",
        "otp_type",
        "is_active",
        "is_verified",
        "deletedAt",
      ],
    },
  });
};
