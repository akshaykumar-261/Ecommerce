export default class AddressService {
  async init(db) {
    this.Model = db.models;
  }
  async createAddress(payload) {
    return await this.Model.Address.create(payload);
  }

  async getAddressById(id) {
    return await this.Model.Address.findByPk(id);
  }

  async updateAddress(id, payload) {
    return await this.Model.Address.update(payload, {
      where: {
        id,
      },
    });
  }

  async getAllAddress(userId) {
    return await this.Model.Address.findAll({
      where: {
        user_id: userId,
      },
      order: [["createdAt", "DESC"]],
    });
  }

  async deleteAddress(id) {
    return await this.Model.Address.destroy({
      where: {
        id,
      },
    });
  }
}
