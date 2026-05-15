import { useQuery } from '@tanstack/react-query';
import { dashboardService, badgeService } from '@/api/services/metrics';

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardService.getSummary(),
  });
};

export const useBadges = () => {
  return useQuery({
    queryKey: ['badges'],
    queryFn: () => badgeService.getAll(),
  });
};

export const useGlobalMetrics = (days: number = 30) => {
  return useQuery({
    queryKey: ['global-metrics', days],
    queryFn: () => dashboardService.getGlobalSummary(days),
  });
};
