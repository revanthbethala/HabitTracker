import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/api/services/habits';
import type { CheckIn, CheckInRequest, DashboardSummary, Badge } from '@/types/habit';

export const checkInService = {
  upsert: async (habitId: number, data: CheckInRequest) => {
    const response = await apiClient.put<ApiResponse<CheckIn>>(`/habits/${habitId}/check-ins`, data);
    return response.data;
  },

  getHistory: async (habitId: number, page: number = 0) => {
    const response = await apiClient.get<ApiResponse<any>>(`/habits/${habitId}/check-ins?page=${page}&size=7`);
    return response.data;
  },

  getHistoryMetrics: async (habitId: number, days: number = 30) => {
    const response = await apiClient.get<ApiResponse<any[]>>(`/habits/${habitId}/history?days=${days}`);
    return response.data;
  },

  delete: async (checkInId: number) => {
    await apiClient.delete(`/check-ins/${checkInId}`);
  }
};

export const dashboardService = {
  getSummary: async () => {
    const response = await apiClient.get<ApiResponse<DashboardSummary>>('/dashboard');
    return response.data;
  },

  getDueHabits: async () => {
    const response = await apiClient.get<ApiResponse<any[]>>('/dashboard/due');
    return response.data;
  },

  getGlobalSummary: async (days: number = 30) => {
    const response = await apiClient.get<ApiResponse<any[]>>(`/dashboard/metrics?days=${days}`);
    return response.data;
  }
};

export const badgeService = {
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<Badge[]>>('/badges');
    return response.data;
  }
};
