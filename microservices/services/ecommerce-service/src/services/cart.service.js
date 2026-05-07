import { HttpError, getSupabaseClient, createLogger } from '@kissan/shared';

const logger = createLogger('ecommerce-service');
const db = getSupabaseClient();

class CartService {
  async getCart(userId) {
    const { data, error } = await db.from('users').select('cartData').eq('id', userId).single();
    if (error) throw error;
    return data?.cartData || {};
  }

  async addToCart(userId, itemId) {
    const cartData = await this.getCart(userId);
    cartData[itemId] = (cartData[itemId] || 0) + 1;
    await db.from('users').update({ cartData }).eq('id', userId);
    return cartData;
  }

  async updateCart(userId, itemId, quantity) {
    const cartData = await this.getCart(userId);
    if (quantity <= 0) delete cartData[itemId];
    else cartData[itemId] = quantity;
    await db.from('users').update({ cartData }).eq('id', userId);
    return cartData;
  }

  async clearCart(userId) {
    await db.from('users').update({ cartData: {} }).eq('id', userId);
    return {};
  }
}

export default new CartService();
