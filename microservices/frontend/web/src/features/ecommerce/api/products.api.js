import api from '../../../core/api/axios.instance';
import API from '../../../core/api/api.config';

export const getProducts = async (params = {}) => {
  const { data } = await api.get(`${API.PRODUCT}/list`, { params });
  return data;
};

export const getProductById = async (id) => {
  const { data } = await api.get(`${API.PRODUCT}/${id}`);
  return data;
};

export const getFertilizers = async () => {
  const { data } = await api.get(`${API.FERTILIZER}/list`);
  return data;
};

export const getEquipments = async () => {
  const { data } = await api.get(`${API.EQUIPMENT}/list`);
  return data;
};
