import api from '@/shared/services/http/axios.client';
import API from '@/core/api/api.config';

export const getCart = async (userId) => {
  const { data } = await api.post(`${API.CART}/get`, { userId });
  return data;
};

export const updateCartItem = async (userId, itemId, quantity) => {
  const { data } = await api.post(`${API.CART}/update`, { userId, itemId, quantity });
  return data;
};
