import mongoose, { Schema, Document } from 'mongoose';

export interface IPatientDocument extends Document {
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

const PatientSchema = new Schema<IPatientDocument>(
  {
    patientId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['Male', 'Female', 'Other'],
    },
    address: {
      type: String,
      trim: true,
    },
    emergencyContact: {
      type: String,
      trim: true,
    },
    medicalNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field for calculated Age
PatientSchema.virtual('age').get(function (this: IPatientDocument) {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

PatientSchema.set('toJSON', { virtuals: true });
PatientSchema.set('toObject', { virtuals: true });

export const Patient = mongoose.model<IPatientDocument>('Patient', PatientSchema);
