import { Op } from "sequelize";
export default class UserServices {
  async init(db) {
    this.Model = db.models;
  }

  getByEmail = async (email) => {
    if (!email) return null;
    return await this.Model.user.findOne({
      where: {
        email: email.toLowerCase().trim(),
        deletedAt: null,
      },
    });
  };

  createUser = async (payload) => {
    const user = await this.Model.user.create(payload);
    return await this.Model.user.findByPk(user.id, {
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
}
