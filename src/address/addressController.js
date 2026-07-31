import AddressService from "./addressService.js";
import { STATUS_CODE } from "../helper/statusCode.js";
import { sendResponse } from "../helper/responseHandler.js";
import { cartMessage, productMessage } from "../helper/commanMessages.js";
import { addressMessages } from "../helper/commanMessages.js";

export default class AddressController {
  async init(db) {
    this.services = new AddressService();
    await this.services.init(db);
  }

  async addAddress(req, res) {
    const payload = {
      ...req.body,
      user_id: req.user.id,
    };
    const address = await this.services.createAddress(payload);
    return sendResponse(
      res,
      STATUS_CODE.CREATED,
      addressMessages.ADDRESS_CREATED,
      {
        address,
      },
    );
  }

  async updateAddress(req, res) {
    const { addressId } = req.params;
    const address = await this.services.getAddressById(addressId);
    if (!address) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        addressMessages.ADDRESS_NOT_FOUND,
      );
    }
    if (address.user_id !== req.user.id) {
      return sendResponse(
        res,
        STATUS_CODE.FORBIDDEN,
        addressMessages.UNAUTHORIZED_ADDRESS,
      );
    }
    await this.services.updateAddress(addressId, req.body);
    const updatedAddress = await this.services.getAddressById(addressId);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      addressMessages.ADDRESS_UPDATED,
      {
        address: updatedAddress,
      },
    );
  }

  async getAllAddress(req, res) {
    const addresses = await this.services.getAllAddress(req.user.id);
    if (!addresses) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        addressMessages.ADDRESS_NOT_FOUND,
      );
    }
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      addressMessages.ADDRESS_FETCHED,
      {
        addresses,
      },
    );
  }

  async deleteAddress(req, res) {
    const { addressId } = req.params;
    const address = await this.services.getAddressById(addressId);
    if (!address) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        addressMessages.ADDRESS_NOT_FOUND,
      );
    }
    if (address.user_id !== req.user.id) {
      return sendResponse(
        res,
        STATUS_CODE.FORBIDDEN,
        addressMessages.UNAUTHORIZED_ADDRESS,
      );
    }
    await this.services.deleteAddress(addressId);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      addressMessages.ADDRESS_DELETED,
    );
  }
}
