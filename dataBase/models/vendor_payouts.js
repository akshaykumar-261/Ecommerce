import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";
const VendorPayoutModel = sequelize.define(
  "vendor_payout",
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

    payment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    stripe_account_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    gross_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    platform_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    vendor_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    currency: {
      type: DataTypes.STRING,
      defaultValue: "usd",
    },

    transfer_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    payout_status: {
      type: DataTypes.ENUM("pending", "paid", "failed", "refunded"),
      defaultValue: "pending",
    },
  },
  {
    timestamps: true,
  },
);
export default VendorPayoutModel;
