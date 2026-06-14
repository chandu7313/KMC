import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supportApi } from '../api/support.api';

export const useTickets = (filters = {}) => {
  return useQuery({
    queryKey: ['support', 'tickets', filters],
    queryFn: async () => {
      const res = await supportApi.getTickets(filters);
      return res.data?.data || res.data || {};
    },
    staleTime: 10000,
  });
};

export const useTicketDetail = (id) => {
  return useQuery({
    queryKey: ['support', 'ticket', id],
    queryFn: async () => {
      const res = await supportApi.getTicketById(id);
      return res.data?.data || res.data || {};
    },
    enabled: !!id,
  });
};

export const useTicketMessages = (ticketId) => {
  return useQuery({
    queryKey: ['support', 'messages', ticketId],
    queryFn: async () => {
      const res = await supportApi.getMessages(ticketId);
      return res.data?.data?.messages || [];
    },
    enabled: !!ticketId,
    refetchInterval: 15000,
  });
};

export const useCreateTicket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => supportApi.createTicket(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['support', 'tickets'] });
      qc.invalidateQueries({ queryKey: ['support', 'dashboard'] });
    },
  });
};

export const useUpdateTicket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => supportApi.updateTicket(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['support', 'ticket', id] });
      qc.invalidateQueries({ queryKey: ['support', 'tickets'] });
      qc.invalidateQueries({ queryKey: ['support', 'dashboard'] });
    },
  });
};

export const useAssignTicket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, agentId }) => supportApi.assignTicket(ticketId, agentId),
    onSuccess: (_, { ticketId }) => {
      qc.invalidateQueries({ queryKey: ['support', 'ticket', ticketId] });
      qc.invalidateQueries({ queryKey: ['support', 'tickets'] });
    },
  });
};

export const useResolveTicket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => supportApi.resolveTicket(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['support', 'ticket', id] });
      qc.invalidateQueries({ queryKey: ['support', 'tickets'] });
      qc.invalidateQueries({ queryKey: ['support', 'dashboard'] });
    },
  });
};

export const useCloseTicket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => supportApi.closeTicket(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['support', 'ticket', id] });
      qc.invalidateQueries({ queryKey: ['support', 'tickets'] });
      qc.invalidateQueries({ queryKey: ['support', 'dashboard'] });
    },
  });
};

export const useAddMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, data }) => supportApi.addMessage(ticketId, data),
    onSuccess: (_, { ticketId }) => {
      qc.invalidateQueries({ queryKey: ['support', 'messages', ticketId] });
    },
  });
};

export const useAddNote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, data }) => supportApi.addNote(ticketId, data),
    onSuccess: (_, { ticketId }) => {
      qc.invalidateQueries({ queryKey: ['support', 'messages', ticketId] });
    },
  });
};
