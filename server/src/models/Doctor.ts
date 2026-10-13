import mongoose, { Schema, Document } from 'mongoose';

export interface IDoctorDocument extends Document {
  doctorId: string;
  name: string;
  specialization: string;
  phone: string;
  email: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema = new Schema<IDoctorDocument>(
  {
    doctorId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

export const Doctor = mongoose.model<IDoctorDocument>('Doctor', DoctorSchema);
