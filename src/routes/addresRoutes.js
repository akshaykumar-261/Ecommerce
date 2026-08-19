import express from "express";
import AddressController from "../address/addressController.js";
import { asyncHandler } from "../helper/commonFunction.js";
import { sequelize } from "../../config/db.js";
import Address from "../../dataBase/models/addressModel.js";
import authorize from "../middleweare/authmiddleweare.js";
import checkRole from "../middleweare/roleBasemiddleweare.js";
import {
  addAddressValidation,
  validateRequest,
} from "../address/addressValidation.js";
const router = express.Router();
const addressController = new AddressController();
const role = checkRole("Customer");
await addressController.init(sequelize);
addressController.init({ models: { Address } });
router.post(
  "/add-address",
  authorize,
  role,
  validateRequest(addAddressValidation),
  asyncHandler(addressController.addAddress.bind(addressController)),
);
router.put(
  "/upadte-address/:addressId",
  authorize,
  role,
  asyncHandler(addressController.updateAddress.bind(addressController)),
);
router.get(
  "/get-address",
  authorize,
  role,
  asyncHandler(addressController.getAllAddress.bind(addressController)),
);
router.delete(
  "/deleteAddress/:addressId",
  authorize,
  role,
  asyncHandler(addressController.deleteAddress.bind(addressController)),
);
export default router;
