import UserModel from "../dataBase/models/userModel.js";
import RoleModel from "../dataBase/models/roleModel.js";
import UserDeviceModel from "../dataBase/models/user_deviceModel.js";
import StoreModel from "../dataBase/models/storeModel.js";
import ProductModel from "../dataBase/models/productModel.js";
import CategoryModel from "../dataBase/models/categoryModel.js";
import AddressModel from "../dataBase/models/addressModel.js";
UserModel.belongsTo(RoleModel, {
  foreignKey: "role_Id",
});
RoleModel.hasMany(UserModel, {
  foreignKey: "role_Id",
});
UserDeviceModel.belongsTo(UserModel, {
  foreignKey: "user_Id",
});
StoreModel.hasOne(StoreModel, {
  foreignKey: "user_id",
  as: "user",
});
StoreModel.belongsTo(UserModel, {
  foreignKey: "user_id",
  as: "users",
});
StoreModel.hasMany(ProductModel, {
  foreignKey: "store_id",
});
ProductModel.belongsTo(StoreModel, {
  foreignKey: "store_id",
});
CategoryModel.hasMany(ProductModel, {
  foreignKey: "category_id",
});
ProductModel.belongsTo(CategoryModel, {
  foreignKey: "category_id",
});
UserModel.hasMany(AddressModel, {
  foreignKey: "user_id",
});
AddressModel.belongsTo(UserModel, {
  foreignKey: "user_id",
});