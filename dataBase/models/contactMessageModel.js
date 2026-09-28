import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const ContactMessage = sequelize.define(
  "contact_message",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "REPLIED", "CLOSED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
    replied_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "contact_messages",
    timestamps: true,
  },
);

export default ContactMessage;
