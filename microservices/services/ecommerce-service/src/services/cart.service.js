import { HttpError, models, createLogger } from '@kissan/shared';

const { User } = models;
const logger = createLogger('ecommerce-service');

/**
 * Shopping Cart Service — manages user cart state stored on User document.
 */
class CartService {
  async getCart(userId) {
    const user = await User.findByPk(userId, { attributes: ['cartData'], raw: true });
    if (!user) throw HttpError.notFound('User not found');
    return user.cartData || {};
  }

  async addToCart(userId, itemId) {
    const cartData = await this.getCart(userId);
    cartData[itemId] = (cartData[itemId] || 0) + 1;
    await User.update({ cartData }, { where: { id: userId } });
    return cartData;
  }

  async updateCart(userId, itemId, quantity) {
    const cartData = await this.getCart(userId);
    if (quantity <= 0) delete cartData[itemId];
    else cartData[itemId] = quantity;
    await User.update({ cartData }, { where: { id: userId } });
    return cartData;
  }

  async clearCart(userId) {
    await User.update({ cartData: {} }, { where: { id: userId } });
    return {};
  }
}

export default new CartService();
