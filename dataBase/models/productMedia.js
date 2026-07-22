import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";
const ProductMediaModel = sequelize.define(
  "product_media",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    media_type: {
      type: DataTypes.ENUM("images", "video"),
      allowNull: false,
    },
    media_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    public_id: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    paranoid: true,
  },
);
export default ProductMediaModel;
