import { HttpError, createLogger } from '@kissan/shared';
import addressRepository from '../repositories/address.repository.js';

const logger = createLogger('user-service');

class AddressService {
  async getAddresses(userId) {
    return addressRepository.findByUserId(userId);
  }

  async addAddress(userId, address) {
    if (!address.fullName || !address.phone || !address.address) {
      throw HttpError.badRequest('fullName, phone, and address are required');
    }

    const saved = await addressRepository.create({
      userId,
      fullName: address.fullName,
      phone: address.phone,
      address: address.address,
    });

    logger.info(`Address added for user ${userId}`);

    // Return all addresses
    const addresses = await addressRepository.findByUserId(userId);
    return { address: saved, addresses };
  }

  async updateAddress(userId, addressId, updates) {
    const existing = await addressRepository.findById(addressId);
    if (!existing || existing.userId !== userId) {
      throw HttpError.notFound('Address not found');
    }
    return addressRepository.update(addressId, updates);
  }

  async deleteAddress(userId, addressId) {
    const existing = await addressRepository.findById(addressId);
    if (!existing || existing.userId !== userId) {
      throw HttpError.notFound('Address not found');
    }
    await addressRepository.delete(addressId);
    return addressRepository.findByUserId(userId);
  }
}

export default new AddressService();
