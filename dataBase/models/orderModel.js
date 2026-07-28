import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";
const OrderModel = sequelize.define(
  "order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order_number: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    grand_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.ENUM("Pending", "Paid", "Failed", "Refunded"),
      allowNull: false,
      defaultValue: "Pending",
    },
    order_status: {
      type: DataTypes.ENUM(
        "Pending",
        "Confirmed",
        "Packed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ),
      allowNull: false,
      defaultValue: "Pending",
    },
  },
  {
    timestamps: true,
  },
);
export default OrderModel;
