import mongoose, { Schema, Document } from 'mongoose';
import { AppointmentStatus } from '../types';

export interface IAppointmentDocument extends Document {
  appointmentId: string;
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // e.g. "09:00 AM"
  reason?: string;
  status: AppointmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointmentDocument>(
  {
    appointmentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient reference is required'],
      index: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor reference is required'],
      index: true,
    },
    appointmentDate: {
      type: String,
      required: [true, 'Appointment date is required (YYYY-MM-DD)'],
      index: true,
    },
    appointmentTime: {
      type: String,
      required: [true, 'Appointment time is required (e.g. 09:00 AM)'],
    },
    reason: {
      type: String,
      trim: true,
      default: 'General Consultation',
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Pending', 'Cancelled', 'Completed'],
      default: 'Pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Appointment = mongoose.model<IAppointmentDocument>('Appointment', AppointmentSchema);
