import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/core/api/axios.instance';
import { useGlobalStore } from '@/app/store/globalStore';

export const useFarmerDashboard = () => {
  const queryClient = useQueryClient();
  const userData = useGlobalStore((state) => state.userData);
  const state = userData?.state || 'Maharashtra';

  // Fetch Dashboard Data
  const dashboardQuery = useQuery({
    queryKey: ['farmerDashboard'],
    queryFn: async () => {
      const response = await api.get('/users/farmer/dashboard');
      return response.data.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    retry: 2
  });

  // Fetch Market Prices
  const marketQuery = useQuery({
    queryKey: ['dashboardMarketPrices', state],
    queryFn: async () => {
      const response = await api.get(`/market/dashboard-prices?state=${encodeURIComponent(state)}&limit=5`);
      return response.data.data.prices || [];
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1
  });

  // Mark single alert read
  const markAlertRead = useMutation({
    mutationFn: async (alertId) => {
      await api.post(`/users/farmer/alerts/${alertId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['farmerDashboard']);
    }
  });

  // Mark all alerts read
  const markAllRead = useMutation({
    mutationFn: async () => {
      await api.post('/users/farmer/alerts/read-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['farmerDashboard']);
    }
  });

  return {
    dashboard: dashboardQuery.data,
    marketPrices: marketQuery.data,
    isLoading: dashboardQuery.isLoading || marketQuery.isLoading,
    isError: dashboardQuery.isError,
    error: dashboardQuery.error || marketQuery.error,
    refetch: () => {
      dashboardQuery.refetch();
      marketQuery.refetch();
    },
    markAlertRead: markAlertRead.mutate,
    markAllRead: markAllRead.mutate
  };
};
