import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const AdminConfiguration = sequelize.define(
  "admin_configurations",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    commission_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
  },
);
export default AdminConfiguration;
