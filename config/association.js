import UserModel from "../dataBase/models/userModel.js";
import RoleModel from "../dataBase/models/roleModel.js";
import UserDeviceModel from "../dataBase/models/user_deviceModel.js";
import StoreModel from "../dataBase/models/storeModel.js";
import ProductModel from "../dataBase/models/productModel.js";
import CategoryModel from "../dataBase/models/categoryModel.js";
import AddressModel from "../dataBase/models/addressModel.js";
import ProductMediaModel from "../dataBase/models/productMedia.js";
import CartModel from "../dataBase/models/cartModel.js";
import CartItemModel from "../dataBase/models/cartItemModel.js";
import OrderItemModel from "../dataBase/models/orderItem.js";
import OrderModel from "../dataBase/models/orderModel.js";
import PaymentModel from "../dataBase/models/paymetModel.js";
import VendorPayoutModel from "../dataBase/models/vendor_payouts.js";
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
});
StoreModel.belongsTo(UserModel, {
  foreignKey: "user_id",
});
StoreModel.belongsTo(UserModel, {
  foreignKey: "user_id",
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
ProductMediaModel.belongsTo(ProductModel, {
  foreignKey: "product_id",
});
ProductModel.hasMany(ProductMediaModel, {
  foreignKey: "product_id",
});
CartModel.belongsTo(UserModel, {
  foreignKey: "user_id",
});
UserModel.hasOne(CartModel, {
  foreignKey: "user_id",
});
CartItemModel.belongsTo(CartModel, {
  foreignKey: "cart_id",
});
CartModel.hasMany(CartItemModel, {
  foreignKey: "cart_id",
});

CartItemModel.belongsTo(ProductModel, {
  foreignKey: "product_id",
});

ProductModel.hasMany(CartItemModel, {
  foreignKey: "product_id",
});

// OrderModel
OrderModel.belongsTo(UserModel, {
  foreignKey: "user_id",
});
OrderModel.belongsTo(AddressModel, {
  foreignKey: "address_id",
});
OrderModel.hasMany(OrderItemModel, {
  foreignKey: "order_id",
});

// OrderItemModel
OrderItemModel.belongsTo(OrderModel, {
  foreignKey: "order_id",
});
OrderItemModel.belongsTo(ProductModel, {
  foreignKey: "product_id",
});

PaymentModel.belongsTo(OrderModel, {
  foreignKey: "order_id",
});
OrderModel.hasOne(PaymentModel, {
  foreignKey: "order_id",
});

// VendorPayoutModel Associations
VendorPayoutModel.belongsTo(OrderModel,{
    foreignKey:"order_id"
})

OrderModel.hasOne(VendorPayoutModel,{
    foreignKey:"order_id"
})

VendorPayoutModel.belongsTo(PaymentModel,{
    foreignKey:"payment_id"
})

PaymentModel.hasOne(VendorPayoutModel,{
    foreignKey:"payment_id"
})

VendorPayoutModel.belongsTo(UserModel,{
    foreignKey:"vendor_id"
})

UserModel.hasMany(VendorPayoutModel,{
    foreignKey:"vendor_id"
})
