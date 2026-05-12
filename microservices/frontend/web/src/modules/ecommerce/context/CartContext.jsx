/**
 * Cart Context
 * Manages shopping cart state extracted from the monolithic AppContext.
 */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

import { createContext, useState, useCallback } from 'react';
import * as cartApi from '../api/cart.api';
import { useGlobalStore } from '@/app/store/globalStore';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { userData } = useGlobalStore();
  const [cartItems, setCartItems] = useState({});

  const getCartData = useCallback(async () => {
    if (!userData) return;
    try {
      const data = await cartApi.getCart(userData.id);
      if (data.success) {
        setCartItems(data.cartData);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }, [userData]);

  const getCartCount = useCallback(() => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        totalCount += cartItems[itemId];
      }
    }
    return totalCount;
  }, [cartItems]);

  const value = {
    cartItems,
    setCartItems,
    getCartData,
    getCartCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
