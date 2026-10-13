import api from './api';
import { Doctor, ApiResponse } from '../types';

export const doctorService = {
  getDoctors: async (): Promise<Doctor[]> => {
    const response = await api.get<ApiResponse<Doctor[]>>('/doctors');
    return response.data.data;
  },
};
