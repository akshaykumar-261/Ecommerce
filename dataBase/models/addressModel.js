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
    // User_name
    name: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    // Contact Number
    phone_no: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    house_no: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    // Road / Area / Colony
    road_area_colony: {
      type: DataTypes.STRING(255),
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

    // Nearby Famous Place / Shop / School
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
