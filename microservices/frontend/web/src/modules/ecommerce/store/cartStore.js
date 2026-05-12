import { create } from 'zustand';
import { getCart } from '@/modules/ecommerce/api/cart.api';

export const useCartStore = create((set, get) => ({
  cartItems: {},

  setCartItems: (items) => set({ cartItems: items }),

  getCartData: async () => {
    try {
      // In the legacy AppContext, it posted {} to cart/get and relied on cookies/withCredentials
      // The new API accepts userId optionally, but we'll just pass empty object to maintain compat
      const data = await getCart();
      if (data && data.success) {
        set({ cartItems: data.cartData || {} });
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  },

  getCartCount: () => {
    const items = get().cartItems;
    let totalCount = 0;
    for (const itemId in items) {
      if (items[itemId] > 0) {
        totalCount += items[itemId];
      }
    }
    return totalCount;
  }
}));
