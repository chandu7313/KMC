/**
 * Disease Detection API Layer
 * All crop doctor / disease detection API calls.
 */
import api from '@/shared/services/http/axios.client';
import API from '@/core/api/api.config';

export const diagnose = async (formData) => {
  const { data } = await api.post(`${API.DISEASE}/diagnose`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getHistory = async () => {
  const { data } = await api.get(`${API.DISEASE}/history`);
  return data;
};

export const getDiagnosisDetail = async (id) => {
  const { data } = await api.get(`${API.DISEASE}/detail/${id}`);
  return data;
};
