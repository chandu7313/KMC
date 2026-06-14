import api from '../../../../core/api/axios.instance';
import API from '../../../../core/api/api.config';

const BASE = API.SUPPORT;

export const supportApi = {
  // ── Dashboard ──
  getDashboardStats: (period = 'today') =>
    api.get(`${BASE}/tickets/dashboard`, { params: { period } }),

  // ── Tickets ──
  getTickets: (params) =>
    api.get(`${BASE}/tickets`, { params }),

  getTicketById: (id) =>
    api.get(`${BASE}/tickets/${id}`),

  createTicket: (data) =>
    api.post(`${BASE}/tickets`, data),

  updateTicket: (id, data) =>
    api.put(`${BASE}/tickets/${id}`, data),

  assignTicket: (id, agentId) =>
    api.post(`${BASE}/tickets/${id}/assign`, { agentId }),

  escalateTicket: (id) =>
    api.post(`${BASE}/tickets/${id}/escalate`),

  resolveTicket: (id, data = {}) =>
    api.post(`${BASE}/tickets/${id}/resolve`, data),

  closeTicket: (id) =>
    api.post(`${BASE}/tickets/${id}/close`),

  deleteTicket: (id) =>
    api.delete(`${BASE}/tickets/${id}`),

  // ── Messages ──
  getMessages: (ticketId) =>
    api.get(`${BASE}/tickets/${ticketId}/messages`),

  addMessage: (ticketId, data) =>
    api.post(`${BASE}/tickets/${ticketId}/messages`, data),

  addNote: (ticketId, data) =>
    api.post(`${BASE}/tickets/${ticketId}/notes`, data),

  // ── Activity ──
  getActivity: (ticketId) =>
    api.get(`${BASE}/tickets/${ticketId}/activity`),

  // ── Farmers ──
  getFarmers: (params) =>
    api.get(`${BASE}/manage/farmers`, { params }),

  getFarmerById: (id) =>
    api.get(`${BASE}/manage/farmers/${id}`),

  blockFarmer: (id) =>
    api.post(`${BASE}/manage/farmers/${id}/block`),

  // ── Bookings ──
  getBookings: (params) =>
    api.get(`${BASE}/manage/bookings`, { params }),

  updateBooking: (id, data) =>
    api.put(`${BASE}/manage/bookings/${id}`, data),

  sendBookingReminder: (id) =>
    api.post(`${BASE}/manage/bookings/${id}/remind`),

  // ── Templates ──
  getTemplates: (params) =>
    api.get(`${BASE}/manage/templates`, { params }),

  createTemplate: (data) =>
    api.post(`${BASE}/manage/templates`, data),

  updateTemplate: (id, data) =>
    api.put(`${BASE}/manage/templates/${id}`, data),

  deleteTemplate: (id) =>
    api.delete(`${BASE}/manage/templates/${id}`),

  // ── Notifications ──
  sendNotification: (data) =>
    api.post(`${BASE}/manage/notifications/send`, data),

  getNotificationHistory: (params) =>
    api.get(`${BASE}/manage/notifications/history`, { params }),

  // ── Reports ──
  getReportsDashboard: () =>
    api.get(`${BASE}/manage/reports/dashboard`),

  getAgentReports: () =>
    api.get(`${BASE}/manage/reports/agents`),

  // ── Agents ──
  getAgents: () =>
    api.get(`${BASE}/manage/agents`),

  getAgentById: (id) =>
    api.get(`${BASE}/manage/agents/${id}`),

  updateAgentStatus: (id, status) =>
    api.put(`${BASE}/manage/agents/${id}/status`, { status }),

  // ── SLA Settings ──
  getSLAConfig: () =>
    api.get(`${BASE}/manage/settings/sla`),

  updateSLAConfig: (configs) =>
    api.put(`${BASE}/manage/settings/sla`, { configs }),
};

export default supportApi;
