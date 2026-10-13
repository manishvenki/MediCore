import api from './api';
import { Appointment, PaginatedResponse, ApiResponse, AppointmentStatus } from '../types';

export interface AppointmentFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  date?: string;
}

export interface AppointmentFormData {
  patient: string;
  doctor: string;
  appointmentDate: string;
  appointmentTime: string;
  reason?: string;
  status?: AppointmentStatus;
}

export const appointmentService = {
  getAppointments: async (
    params: AppointmentFilterParams = {}
  ): Promise<PaginatedResponse<Appointment>> => {
    const response = await api.get<PaginatedResponse<Appointment>>('/appointments', { params });
    return response.data;
  },

  getAppointmentById: async (id: string): Promise<Appointment> => {
    const response = await api.get<ApiResponse<Appointment>>(`/appointments/${id}`);
    return response.data.data;
  },

  createAppointment: async (data: AppointmentFormData): Promise<Appointment> => {
    const response = await api.post<ApiResponse<Appointment>>('/appointments', data);
    return response.data.data;
  },

  updateAppointment: async (
    id: string,
    data: Partial<AppointmentFormData>
  ): Promise<Appointment> => {
    const response = await api.put<ApiResponse<Appointment>>(`/appointments/${id}`, data);
    return response.data.data;
  },

  deleteAppointment: async (id: string): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },
};
