import api from './api';
import { User, ApiResponse } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthData {
  token: string;
  user: User;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthData> => {
    const response = await api.post<ApiResponse<AuthData>>('/auth/login', credentials);
    return response.data.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },
};
