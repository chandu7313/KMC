import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supportApi } from '../api/support.api';

export const useSupportDashboard = () => {
  const [period, setPeriod] = useState('today');

  const { data: dashboardData, isLoading, isError, refetch } = useQuery({
    queryKey: ['support', 'dashboard', period],
    queryFn: async () => {
      const res = await supportApi.getDashboardStats(period);
      return res.data?.data || res.data || {};
    },
    refetchInterval: 30000,
    staleTime: 15000,
    retry: 2,
  });

  return {
    stats: dashboardData?.stats || {},
    ticketVolume: dashboardData?.ticketVolume || [],
    categoryBreakdown: dashboardData?.categoryBreakdown || [],
    criticalTickets: dashboardData?.criticalTickets || [],
    slaBreaching: dashboardData?.slaBreaching || [],
    liveActivity: dashboardData?.liveActivity || [],
    isLoading,
    isError,
    period,
    setPeriod,
    refetch,
  };
};

export default useSupportDashboard;
