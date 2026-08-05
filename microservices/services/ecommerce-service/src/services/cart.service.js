import { HttpError, models, createLogger } from '@kissan/shared';

const { User } = models;
const logger = createLogger('ecommerce-service');

/**
 * Shopping Cart Service — manages user cart state stored on User document.
 */
class CartService {
  /**
   * Fetch current user's cart object map of item IDs to quantities.
   * @param {string} userId - User UUID
   * @returns {Promise<Record<string, number>>} Cart data map
   * @throws {HttpError} If user not found
   */
  async getCart(userId) {
    const user = await User.findByPk(userId, { attributes: ['cartData'], raw: true });
    if (!user) throw HttpError.notFound('User not found');
    return user.cartData || {};
  }

  /**
   * Increment quantity of an item in cart.
   * @param {string} userId - User UUID
   * @param {string} itemId - Product / Fertilizer / Equipment UUID
   * @returns {Promise<Record<string, number>>} Updated cart map
   */
  async addToCart(userId, itemId) {
    const cartData = await this.getCart(userId);
    cartData[itemId] = (cartData[itemId] || 0) + 1;
    await User.update({ cartData }, { where: { id: userId } });
    return cartData;
  }

  /**
   * Set specific quantity for an item, removing if quantity <= 0.
   * @param {string} userId - User UUID
   * @param {string} itemId - Item UUID
   * @param {number} quantity - New quantity
   * @returns {Promise<Record<string, number>>} Updated cart map
   */
  async updateCart(userId, itemId, quantity) {
    const cartData = await this.getCart(userId);
    if (quantity <= 0) delete cartData[itemId];
    else cartData[itemId] = quantity;
    await User.update({ cartData }, { where: { id: userId } });
    return cartData;
  }

  /**
   * Clear all items from user cart.
   * @param {string} userId - User UUID
   * @returns {Promise<object>} Empty cart map
   */
  async clearCart(userId) {
    await User.update({ cartData: {} }, { where: { id: userId } });
    return {};
  }
}

export default new CartService();
