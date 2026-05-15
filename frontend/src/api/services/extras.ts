import { apiClient } from '@/api/client.ts';
import type { ApiResponse } from '@/api/services/habits.ts';
import type { HabitException, Reminder } from '@/types/habit';

export const exceptionService = {
  getAll: async (habitId: number) => {
    const response = await apiClient.get<ApiResponse<HabitException[]>>(`/habits/${habitId}/exceptions`);
    return response.data;
  },

  create: async (habitId: number, data: { date: string; reason?: string }) => {
    const response = await apiClient.post<ApiResponse<HabitException>>(`/habits/${habitId}/exceptions`, data);
    return response.data;
  },

  update: async (exceptionId: number, data: { date?: string; reason?: string }) => {
    const response = await apiClient.put<ApiResponse<HabitException>>(`/exceptions/${exceptionId}`, data);
    return response.data;
  },

  delete: async (exceptionId: number) => {
    await apiClient.delete(`/exceptions/${exceptionId}`);
  }
};

export const reminderService = {
  get: async (habitId: number) => {
    const response = await apiClient.get<ApiResponse<Reminder>>(`/habits/${habitId}/reminder`);
    return response.data;
  },

  upsert: async (habitId: number, data: { time: string; enabled: boolean }) => {
    const response = await apiClient.put<ApiResponse<Reminder>>(`/habits/${habitId}/reminder`, data);
    return response.data;
  },

  delete: async (habitId: number) => {
    await apiClient.delete(`/habits/${habitId}/reminder`);
  }
};
