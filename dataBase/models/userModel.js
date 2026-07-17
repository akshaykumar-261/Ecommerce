import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";
import bcrypt from "bcrypt";
const UserModel = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
    },
    phoneNo: {
      type: DataTypes.STRING,
    },
    avtar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otp: {
      type: DataTypes.INTEGER,
    },
    otp_expire: {
      type: DataTypes.DATE,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    role_Id: {
      type: DataTypes.INTEGER,
    },
    is_mobile_notification_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    socail_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otp_type: {
      type: DataTypes.ENUM("EMAIL_VERIFICATION", "FORGOT_PASSWORD"),
      allowNull: true,
    },
    provider: {
      type: DataTypes.ENUM("LOCAL", "GOOGLE", "FACEBOOK", "GITHUB"),
      defaultValue: "LOCAL",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    avatar_public_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  },
);
export default UserModel;
