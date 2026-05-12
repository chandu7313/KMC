import api from '@/shared/services/http/axios.client';
import API from '@/core/api/api.config';

export const getExperts = async () => {
  const { data } = await api.get(`${API.EXPERT}/list`);
  return data;
};

export const bookConsultation = async (bookingData) => {
  const { data } = await api.post(`${API.BOOKING}/create`, bookingData);
  return data;
};

export const getMyBookings = async () => {
  const { data } = await api.get(`${API.BOOKING}/my-bookings`);
  return data;
};

export const cancelBooking = async (id) => {
  const { data } = await api.post(`${API.BOOKING}/cancel`, { bookingId: id });
  return data;
};
