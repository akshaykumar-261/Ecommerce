import UserModel from "../dataBase/models/userModel.js";
import RoleModel from "../dataBase/models/roleModel.js";
import UserDeviceModel from "../dataBase/models/user_deviceModel.js";
UserModel.belongTo(RoleModel, {
  foreignKey: "role_Id",
});
RoleModel.hasMany(UserModel, {
  foreignKey: "role_Id",
});
UserDeviceModel.belongsTo(UserModel, {
    foreignKey: "user_Id",
});
