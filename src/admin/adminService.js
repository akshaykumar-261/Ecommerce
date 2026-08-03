import { Op, where } from "sequelize";
export default class AdminServices {
  async init(db) {
    this.Model = db.models;
  }
  getUserById = async (id) => {
    return this.Model.Users.findOne({
      where: {
        id: id,
        deletedAt: null,
      },
      attributes: {
        exclude: [
          "password",
          "createdAt",
          "updatedAt",
          "department_Id",
          "refreshToken",
          "is_mobile_notification_active",
          "socail_id",
          "provider",
          "deletedAt",
        ],
      },
    });
  };
  getAllVenders = async (id) => {
    return this.Model.Users.findAll({
      where: {
        role_Id: 2,
        deletedAt: null,
      },
      attributes: {
        exclude: [
          "password",
          "createdAt",
          "updatedAt",
          "department_Id",
          "refreshToken",
          "is_mobile_notification_active",
          "socail_id",
          "provider",
          "deletedAt",
        ],
      },
    });
  };
}
