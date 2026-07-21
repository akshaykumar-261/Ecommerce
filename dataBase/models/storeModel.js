import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const StoreModel = sequelize.define(
  "store",
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

    store_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
    },

    store_logo: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },

    store_banner: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },

    phoneNo: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    zipcode: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    rating: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0.0,
    },

    total_products: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    total_orders: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    store_banner_public_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    store_logo_public_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    paranoid: true, // deletedAt automatically handle karega
  },
);

export default StoreModel;
