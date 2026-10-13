export type UserRole = 'ADMIN' | 'DOCTOR' | 'NURSE' | 'PATIENT' | 'RECEPTIONIST';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Patient {
  _id: string;
  patientId: string;
  fullName: string;
  phone: string;
  email?: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  address?: string;
  emergencyContact?: string;
  medicalNotes?: string;
  age?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  _id: string;
  doctorId: string;
  name: string;
  specialization: string;
  phone: string;
  email: string;
  status: 'Active' | 'On Leave' | 'Inactive';
}

export type AppointmentStatus = 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';

export interface Appointment {
  _id: string;
  appointmentId: string;
  patient: Patient;
  doctor: Doctor;
  appointmentDate: string;
  appointmentTime: string;
  reason?: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalPatients: number;
  todaysAppointments: number;
  totalDoctors: number;
  pendingAppointments: number;
}

export interface AppointmentStatistic {
  day: string;
  appointments: number;
  completed: number;
  pending: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: any[];
}
