import express from "express";
import AddressController from "../address/addressController.js";
import { asyncHandler } from "../helper/commonFunction.js";
import { sequelize } from "../../config/db.js";
import Address from "../../dataBase/models/addressModel.js";
import authorize from "../middleweare/authmiddleweare.js";
import {
  addAddressValidation,
  validateRequest,
} from "../address/addressValidation.js";
const router = express.Router();
const addressController = new AddressController();
await addressController.init(sequelize);
addressController.init({ models: { Address } });
router.post(
  "/add-address",
  authorize,
  validateRequest(addAddressValidation),
  asyncHandler(addressController.addAddress.bind(addressController)),
);
router.put(
  "/upadte-address/:addressId",
  authorize,
  asyncHandler(addressController.updateAddress.bind(addressController)),
);
router.get(
  "/get-address",
  authorize,
  asyncHandler(addressController.getAllAddress.bind(addressController)),
);
router.delete(
  "/deleteAddress/:addressId",
  authorize,
  asyncHandler(addressController.deleteAddress.bind(addressController)),
);
export default router;
