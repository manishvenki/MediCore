import api from './api';
import { Patient, PaginatedResponse, ApiResponse } from '../types';

export interface PatientFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  gender?: string;
}

export interface PatientFormData {
  fullName: string;
  phone: string;
  email?: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  address?: string;
  emergencyContact?: string;
  medicalNotes?: string;
}

export const patientService = {
  getPatients: async (params: PatientFilterParams = {}): Promise<PaginatedResponse<Patient>> => {
    const response = await api.get<PaginatedResponse<Patient>>('/patients', { params });
    return response.data;
  },

  getPatientById: async (id: string): Promise<Patient> => {
    const response = await api.get<ApiResponse<Patient>>(`/patients/${id}`);
    return response.data.data;
  },

  createPatient: async (data: PatientFormData): Promise<Patient> => {
    const response = await api.post<ApiResponse<Patient>>('/patients', data);
    return response.data.data;
  },

  updatePatient: async (id: string, data: Partial<PatientFormData>): Promise<Patient> => {
    const response = await api.put<ApiResponse<Patient>>(`/patients/${id}`, data);
    return response.data.data;
  },

  deletePatient: async (id: string): Promise<void> => {
    await api.delete(`/patients/${id}`);
  },
};
