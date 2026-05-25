import api from '../../../core/api/axios.instance';

export const expertApi = {
  getExperts: (params) =>
    api.get('/api/experts', { params }),

  getExpertProfile: (expertId) =>
    api.get(`/api/experts/${expertId}/profile`),

  getExpertSlots: (expertId, date) =>
    api.get(`/api/experts/${expertId}/slots`, { params: { date } }),

  bookConsultation: (data) =>
    api.post('/api/experts/book', data),

  getMyConsultations: (params) =>
    api.get('/api/experts/consultations/my', { params }),

  getConsultationNotes: (id) =>
    api.get(`/api/experts/consultations/${id}/notes`),

  cancelConsultation: (id, reason) =>
    api.put(`/api/experts/consultations/${id}/cancel`, { reason }),

  rateConsultation: (id, data) =>
    api.post(`/api/experts/consultations/${id}/rate`, data)
};
