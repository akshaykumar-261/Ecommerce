import { Op, where } from "sequelize";
export default class UserServices {
  async init(db) {
    this.Model = db.models;
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

  createUser = async (payload) => {
    const user = await this.Model.Users.create(payload);
    return await this.Model.Users.findByPk(user.id, {
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

  async verifyUser(id) {
    return await this.Model.Users.update(
      {
        is_verified: true,
        otp: null,
        otp_expire: null,
      },
      {
        where: { id },
      },
    );
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

  async createSession(userId, sessionId) {
    return await this.Model.UserDevices.create({
      user_Id: userId,
      session_id: sessionId,
    });
  }

  async updateOtp(userId, otp) {
    return await this.Model.Users.update(
      {
        otp,
        otp_expire: new Date(Date.now() + 10 * 60 * 1000),
      },
      {
        where: {
          id: userId,
        },
      },
    );
  }

  async updateSession(oldSessionId, newSessionId) {
    return await this.Model.UserDevices.update(
      {
        session_id: newSessionId,
      },
      {
        where: {
          session_id: oldSessionId,
        },
      },
    );
  }
  async updateUser(userId, payload) {
    return await this.Model.Users.update(payload, {
      where: {
        id: userId,
      },
    });
  }
  
  async getSessionBySessionId(sessionId) {
    return await this.Model.UserDevices.findOne({
      where: {
        session_id: sessionId,
        //  is_login: true,
      },
    });
  }
}
