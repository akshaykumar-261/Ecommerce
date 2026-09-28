import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const HeroBannerModel = sequelize.define(
  "hero_banner",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    badge_text: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    heading_line_one: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    heading_line_two: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    image_public_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "hero_banners",
    timestamps: true,
  },
);

export default HeroBannerModel;
