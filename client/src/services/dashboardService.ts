import api from './api';
import { DashboardStats, Appointment, AppointmentStatistic, ApiResponse } from '../types';

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return response.data.data;
  },

  getTodayAppointments: async (): Promise<Appointment[]> => {
    const response = await api.get<ApiResponse<Appointment[]>>('/dashboard/today-appointments');
    return response.data.data;
  },

  getAppointmentStatistics: async (): Promise<AppointmentStatistic[]> => {
    const response = await api.get<ApiResponse<AppointmentStatistic[]>>('/dashboard/appointment-statistics');
    return response.data.data;
  },
};
