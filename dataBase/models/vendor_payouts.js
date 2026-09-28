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
    
    payout_status: {
      type: DataTypes.ENUM("pending", "paid", "failed", "refunded"),
      defaultValue: "pending",
    },

    // Stripe transfer that moved the vendor's share, e.g. "tr_1abc...".
    // Needed to reverse a payout on refund and to reconcile against Stripe.
    transfer_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    // Set when a transfer attempt failed, so payouts can be retried.
    failure_reason: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);
export default VendorPayoutModel;
