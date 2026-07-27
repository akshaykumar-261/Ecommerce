import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const CartModel = sequelize.define(
  "cart",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

export default CartModel;
