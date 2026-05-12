import api from '@/shared/services/http/axios.client';
import API from '@/core/api/api.config';

export const getMarketPrices = async (params = {}) => {
  const { data } = await api.get(`${API.MARKET}/prices`, { params });
  return data;
};

export const getMarketTrends = async (commodity) => {
  const { data } = await api.get(`${API.MARKET}/trends/${commodity}`);
  return data;
};
