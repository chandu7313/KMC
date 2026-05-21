import { models } from '@kissan/shared';

const { UserAddress } = models;

/**
 * Address repository — Sequelize queries for user_addresses table.
 */
class AddressRepository {
  async findByUserId(userId) {
    return UserAddress.findAll({
      where: { userId },
      order: [['created_at', 'DESC']],
      raw: true
    });
  }

  async findById(id) {
    return UserAddress.findByPk(id, { raw: true });
  }

  async create(addressData) {
    const address = await UserAddress.create(addressData);
    return address.get({ plain: true });
  }

  async update(id, updates) {
    const [_, [updatedAddress]] = await UserAddress.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedAddress;
  }

  async delete(id) {
    await UserAddress.destroy({ where: { id } });
    return true;
  }
}

export default new AddressRepository();
