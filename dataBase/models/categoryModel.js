import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const CategoryModel = sequelize.define(
  "categories",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    cat_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
  }
);

export default CategoryModel;
