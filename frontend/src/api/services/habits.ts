import { apiClient } from '@/api/client';
import type { Habit, HabitRequest, HabitStatus } from '@/types/habit';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const habitService = {
  create: async (data: HabitRequest) => {
    const response = await apiClient.post<ApiResponse<Habit>>('/habits', data);
    return response.data;
  },

  getAll: async (status?: HabitStatus, sort?: string) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (sort) params.append('sort', sort);
    
    const response = await apiClient.get<ApiResponse<Habit[]>>(`/habits?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<ApiResponse<Habit>>(`/habits/${id}`);
    return response.data;
  },

  update: async (id: number, data: Partial<HabitRequest>) => {
    const response = await apiClient.patch<ApiResponse<Habit>>(`/habits/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/habits/${id}`);
  },

  pause: async (id: number) => {
    await apiClient.patch(`/habits/${id}/pause`);
  },

  resume: async (id: number) => {
    await apiClient.patch(`/habits/${id}/resume`);
  },

  archive: async (id: number) => {
    await apiClient.patch(`/habits/${id}/archive`);
  }
};
