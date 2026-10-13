import { Request } from 'express';

export type UserRole = 'ADMIN' | 'DOCTOR' | 'NURSE' | 'PATIENT' | 'RECEPTIONIST';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    name: string;
  };
}

export interface IPatient {
  _id: string;
  patientId: string;
  fullName: string;
  phone: string;
  email?: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other';
  address?: string;
  emergencyContact?: string;
  medicalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDoctor {
  _id: string;
  doctorId: string;
  name: string;
  specialization: string;
  phone: string;
  email: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

export type AppointmentStatus = 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';

export interface IAppointment {
  _id: string;
  appointmentId: string;
  patient: string | IPatient;
  doctor: string | IDoctor;
  appointmentDate: string;
  appointmentTime: string;
  reason?: string;
  status: AppointmentStatus;
  createdAt: Date;
  updatedAt: Date;
}
