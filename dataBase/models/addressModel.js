import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";
const AddressModel = sequelize.define(
  "address",
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
    name: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    zipcode: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    landmark: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  },
);
export default AddressModel;
