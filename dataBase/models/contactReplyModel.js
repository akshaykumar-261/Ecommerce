import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const ContactReply = sequelize.define(
  "contact_reply",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    message_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    reply: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "contact_replies",
    timestamps: true,
  },
);

export default ContactReply;
