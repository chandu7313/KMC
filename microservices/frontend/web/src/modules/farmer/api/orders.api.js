import api from '@/shared/services/http/axios.client';
import API from '@/core/api/api.config';

export const getOrders = async () => {
  const { data } = await api.get(`${API.ORDER}/my-orders`);
  return data;
};

export const getOrderDetail = async (id) => {
  const { data } = await api.get(`${API.ORDER}/${id}`);
  return data;
};

export const cancelOrder = async (id) => {
  const { data } = await api.post(`${API.ORDER}/cancel`, { orderId: id });
  return data;
};

export const placeOrder = async (orderData) => {
  const { data } = await api.post(`${API.ORDER}/place`, orderData);
  return data;
};
