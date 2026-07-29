import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const PaymentModel = sequelize.define(
  "payment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    transaction_id: {
      type: DataTypes.STRING(200),
      allowNull: true,
      unique: true,
    },

    payment_method: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    payment_provider: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "success", "failed", "refunded"),
      defaultValue: "pending",
    },

    currency: {
      type: DataTypes.STRING(10),
      defaultValue: "INR",
    },
  },
  {
    timestamps: true,
  },
);

export default PaymentModel;
