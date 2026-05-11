import api from '../../../core/api/axios.instance';
import API from '../../../core/api/api.config';

export const submitSoilTest = async (testData) => {
  const { data } = await api.post(`${API.SOIL}/test`, testData);
  return data;
};

export const getSoilHistory = async () => {
  const { data } = await api.get(`${API.SOIL}/history`);
  return data;
};

export const getSoilTestDetail = async (id) => {
  const { data } = await api.get(`${API.SOIL}/detail/${id}`);
  return data;
};

export const getAISoilAnalysis = async (testData) => {
  const { data } = await api.post(`${API.SOIL}/ai-analysis`, testData);
  return data;
};
