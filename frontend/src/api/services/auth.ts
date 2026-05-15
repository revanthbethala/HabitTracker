import { apiClient } from '@/api/client';
import type { AuthResponse, User } from '@/types/auth';

export const authService = {
  register: async (data: any) => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
  
  login: async (data: any) => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
  
  getMe: async () => {
    const response = await apiClient.get<{ success: boolean, data: User }>('/auth/me');
    return response.data;
  },
  
  logout: async () => {
    await apiClient.post('/auth/logout');
  }
};
