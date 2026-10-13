import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { User } from '../models/User';
import { Patient } from '../models/Patient';
import { Doctor } from '../models/Doctor';
import { Appointment } from '../models/Appointment';
import { connectDB } from '../config/db';

export const seedDatabase = async (): Promise<void> => {
  try {
    console.log('--- MediCore Database Seeding ---');

    // 1. Seed Admin User
    const adminEmail = 'admin@medicore.com';
    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      adminUser = new User({
        name: 'MediCore Administrator',
        email: adminEmail,
        password: 'Admin@123',
        role: 'ADMIN',
      });
      await adminUser.save();
      console.log('✓ Admin user seeded (admin@medicore.com / Admin@123)');
    } else {
      console.log('✓ Admin user already exists');
    }

    // 2. Seed Doctors
    const doctorsCount = await Doctor.countDocuments();
    let seededDoctors = [];
    if (doctorsCount === 0) {
      const doctorsData = [
        {
          doctorId: 'DOC001',
          name: 'Dr. John Smith',
          specialization: 'General Medicine',
          phone: '+1 555-0101',
          email: 'dr.smith@medicore.com',
          status: 'Active',
        },
        {
          doctorId: 'DOC002',
          name: 'Dr. Priya Kumar',
          specialization: 'Cardiology',
          phone: '+1 555-0102',
          email: 'dr.kumar@medicore.com',
          status: 'Active',
        },
        {
          doctorId: 'DOC003',
          name: 'Dr. David Lee',
          specialization: 'Orthopedics',
          phone: '+1 555-0103',
          email: 'dr.lee@medicore.com',
          status: 'Active',
        },
        {
          doctorId: 'DOC004',
          name: 'Dr. Sarah Johnson',
          specialization: 'Pediatrics',
          phone: '+1 555-0104',
          email: 'dr.johnson@medicore.com',
          status: 'Active',
        },
        {
          doctorId: 'DOC005',
          name: 'Dr. Michael Chen',
          specialization: 'Neurology',
          phone: '+1 555-0105',
          email: 'dr.chen@medicore.com',
          status: 'Active',
        },
      ];
      seededDoctors = await Doctor.insertMany(doctorsData);
      console.log(`✓ Seeded ${seededDoctors.length} doctors`);
    } else {
      seededDoctors = await Doctor.find();
      console.log(`✓ Doctors exist (${doctorsCount} found)`);
    }

    // 3. Seed Patients
    const patientCount = await Patient.countDocuments();
    let seededPatients = [];
    if (patientCount === 0) {
      const patientsData = [
        {
          patientId: 'P001',
          fullName: 'John Doe',
          phone: '+91 9876543210',
          email: 'john.doe@example.com',
          dateOfBirth: new Date('1998-05-14'),
          gender: 'Male',
          address: '42 Oak Avenue, Metro City',
          emergencyContact: '+91 9876543299 (Jane Doe - Spouse)',
          medicalNotes: 'No known drug allergies. Mild seasonal asthma.',
        },
        {
          patientId: 'P002',
          fullName: 'Sarah Wilson',
          phone: '+91 9876543211',
          email: 'sarah.wilson@example.com',
          dateOfBirth: new Date('1992-08-22'),
          gender: 'Female',
          address: '15 Pine Crescent, Maplewood',
          emergencyContact: '+91 9876543298 (Mark Wilson - Brother)',
          medicalNotes: 'Penicillin allergy documented. Annual health check.',
        },
        {
          patientId: 'P003',
          fullName: 'Alex Thomas',
          phone: '+91 9876543212',
          email: 'alex.thomas@example.com',
          dateOfBirth: new Date('1981-03-10'),
          gender: 'Male',
          address: '88 Elm Street, West Valley',
          emergencyContact: '+91 9876543297 (Clara Thomas - Mother)',
          medicalNotes: 'Hypertension under regular ACE inhibitor treatment.',
        },
        {
          patientId: 'P004',
          fullName: 'Maria Garcia',
          phone: '+91 9876543213',
          email: 'maria.garcia@example.com',
          dateOfBirth: new Date('1995-11-04'),
          gender: 'Female',
          address: '23 Birch Boulevard, Suite 4',
          emergencyContact: '+91 9876543296 (Carlos Garcia - Father)',
          medicalNotes: 'Type 1 diabetes. Regular insulin monitoring required.',
        },
        {
          patientId: 'P005',
          fullName: 'David Brown',
          phone: '+91 9876543214',
          email: 'david.brown@example.com',
          dateOfBirth: new Date('1974-01-18'),
          gender: 'Male',
          address: '104 Cedar Lane, Riverside',
          emergencyContact: '+91 9876543295 (Helen Brown - Spouse)',
          medicalNotes: 'Previous knee arthroscopy in 2021.',
        },
        {
          patientId: 'P006',
          fullName: 'Emily Clark',
          phone: '+91 9876543215',
          email: 'emily.clark@example.com',
          dateOfBirth: new Date('2000-09-30'),
          gender: 'Female',
          address: '77 Willow Way, Fairview',
          emergencyContact: '+91 9876543294 (Donna Clark - Mother)',
          medicalNotes: 'Migraine episodes treated with triptans.',
        },
        {
          patientId: 'P007',
          fullName: 'Robert Taylor',
          phone: '+91 9876543216',
          email: 'robert.taylor@example.com',
          dateOfBirth: new Date('1965-06-12'),
          gender: 'Male',
          address: '310 Highland Drive, Oakwood',
          emergencyContact: '+91 9876543293 (Patricia Taylor - Spouse)',
          medicalNotes: 'Coronary artery disease monitored by cardiology.',
        },
        {
          patientId: 'P008',
          fullName: 'Priya Patel',
          phone: '+91 9876543217',
          email: 'priya.patel@example.com',
          dateOfBirth: new Date('1997-12-05'),
          gender: 'Female',
          address: '56 Jasmine Court, Greenfield',
          emergencyContact: '+91 9876543292 (Rohan Patel - Brother)',
          medicalNotes: 'Routine wellness consultation.',
        },
        {
          patientId: 'P009',
          fullName: 'Michael Zhang',
          phone: '+91 9876543218',
          email: 'michael.zhang@example.com',
          dateOfBirth: new Date('1985-04-19'),
          gender: 'Male',
          address: '91 Horizon Heights, Downtown',
          emergencyContact: '+91 9876543291 (Alice Zhang - Spouse)',
          medicalNotes: 'Allergic to sulfa medications.',
        },
        {
          patientId: 'P010',
          fullName: 'Lisa Anderson',
          phone: '+91 9876543219',
          email: 'lisa.anderson@example.com',
          dateOfBirth: new Date('1988-07-28'),
          gender: 'Female',
          address: '12 Magnolia Park, Bayside',
          emergencyContact: '+91 9876543290 (Kevin Anderson - Spouse)',
          medicalNotes: 'Mild eczema, topical ointment prescribed.',
        },
        {
          patientId: 'P011',
          fullName: 'James Wilson',
          phone: '+91 9876543220',
          email: 'james.wilson@example.com',
          dateOfBirth: new Date('1977-10-15'),
          gender: 'Male',
          address: '64 Summit Ridge, Northview',
          emergencyContact: '+91 9876543289 (Martha Wilson - Sister)',
          medicalNotes: 'Hyperlipidemia, on daily statin therapy.',
        },
        {
          patientId: 'P012',
          fullName: 'Sophia Martinez',
          phone: '+91 9876543221',
          email: 'sophia.martinez@example.com',
          dateOfBirth: new Date('1993-02-14'),
          gender: 'Female',
          address: '82 Sunset Blvd, Sunnyvale',
          emergencyContact: '+91 9876543288 (Elena Martinez - Mother)',
          medicalNotes: 'Pre-natal wellness checks.',
        },
      ];
      seededPatients = await Patient.insertMany(patientsData);
      console.log(`✓ Seeded ${seededPatients.length} patients`);
    } else {
      seededPatients = await Patient.find();
      console.log(`✓ Patients exist (${patientCount} found)`);
    }

    // 4. Seed Appointments
    const appointmentCount = await Appointment.countDocuments();
    if (appointmentCount === 0 && seededPatients.length > 0 && seededDoctors.length > 0) {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      const getOffsetDate = (offsetDays: number): string => {
        const d = new Date();
        d.setDate(d.getDate() + offsetDays);
        return d.toISOString().split('T')[0];
      };

      const appointmentsData = [
        {
          appointmentId: 'APT-1001',
          patient: seededPatients[0]._id,
          doctor: seededDoctors[0]._id,
          appointmentDate: todayStr,
          appointmentTime: '09:00 AM',
          reason: 'Routine Health Checkup',
          status: 'Confirmed',
        },
        {
          appointmentId: 'APT-1002',
          patient: seededPatients[1]._id,
          doctor: seededDoctors[1]._id,
          appointmentDate: todayStr,
          appointmentTime: '10:30 AM',
          reason: 'Cardiology Follow-up',
          status: 'Pending',
        },
        {
          appointmentId: 'APT-1003',
          patient: seededPatients[2]._id,
          doctor: seededDoctors[1]._id,
          appointmentDate: todayStr,
          appointmentTime: '11:00 AM',
          reason: 'Blood Pressure Evaluation',
          status: 'Confirmed',
        },
        {
          appointmentId: 'APT-1004',
          patient: seededPatients[3]._id,
          doctor: seededDoctors[2]._id,
          appointmentDate: todayStr,
          appointmentTime: '02:00 PM',
          reason: 'Post-operative Joint Assessment',
          status: 'Pending',
        },
        {
          appointmentId: 'APT-1005',
          patient: seededPatients[4]._id,
          doctor: seededDoctors[2]._id,
          appointmentDate: todayStr,
          appointmentTime: '03:30 PM',
          reason: 'Knee Pain Consultation',
          status: 'Confirmed',
        },
        {
          appointmentId: 'APT-1006',
          patient: seededPatients[5]._id,
          doctor: seededDoctors[4]._id,
          appointmentDate: todayStr,
          appointmentTime: '04:15 PM',
          reason: 'Chronic Migraine Review',
          status: 'Pending',
        },
        {
          appointmentId: 'APT-1007',
          patient: seededPatients[6]._id,
          doctor: seededDoctors[1]._id,
          appointmentDate: getOffsetDate(1),
          appointmentTime: '09:30 AM',
          reason: 'ECG Analysis & Stress Test',
          status: 'Confirmed',
        },
        {
          appointmentId: 'APT-1008',
          patient: seededPatients[7]._id,
          doctor: seededDoctors[0]._id,
          appointmentDate: getOffsetDate(1),
          appointmentTime: '11:15 AM',
          reason: 'Annual Physical Examination',
          status: 'Pending',
        },
        {
          appointmentId: 'APT-1009',
          patient: seededPatients[8]._id,
          doctor: seededDoctors[3]._id,
          appointmentDate: getOffsetDate(2),
          appointmentTime: '10:00 AM',
          reason: 'Pediatric Care Plan',
          status: 'Confirmed',
        },
        {
          appointmentId: 'APT-1010',
          patient: seededPatients[9]._id,
          doctor: seededDoctors[0]._id,
          appointmentDate: getOffsetDate(2),
          appointmentTime: '01:30 PM',
          reason: 'Skin Rash & Dermatology Followup',
          status: 'Pending',
        },
        {
          appointmentId: 'APT-1011',
          patient: seededPatients[10]._id,
          doctor: seededDoctors[1]._id,
          appointmentDate: getOffsetDate(3),
          appointmentTime: '02:45 PM',
          reason: 'Cholesterol Profile Check',
          status: 'Confirmed',
        },
        {
          appointmentId: 'APT-1012',
          patient: seededPatients[11]._id,
          doctor: seededDoctors[3]._id,
          appointmentDate: getOffsetDate(3),
          appointmentTime: '04:00 PM',
          reason: 'Pre-natal Consultation',
          status: 'Pending',
        },
        {
          appointmentId: 'APT-1013',
          patient: seededPatients[0]._id,
          doctor: seededDoctors[2]._id,
          appointmentDate: getOffsetDate(-2),
          appointmentTime: '10:00 AM',
          reason: 'Sprain Rehabilitation',
          status: 'Completed',
        },
        {
          appointmentId: 'APT-1014',
          patient: seededPatients[1]._id,
          doctor: seededDoctors[0]._id,
          appointmentDate: getOffsetDate(-3),
          appointmentTime: '03:00 PM',
          reason: 'Cold & Viral Symptoms',
          status: 'Completed',
        },
        {
          appointmentId: 'APT-1015',
          patient: seededPatients[2]._id,
          doctor: seededDoctors[4]._id,
          appointmentDate: getOffsetDate(-1),
          appointmentTime: '09:00 AM',
          reason: 'Neurological Reflex Test',
          status: 'Completed',
        },
        {
          appointmentId: 'APT-1016',
          patient: seededPatients[3]._id,
          doctor: seededDoctors[1]._id,
          appointmentDate: getOffsetDate(-4),
          appointmentTime: '11:30 AM',
          reason: 'Routine ECG Checkup',
          status: 'Cancelled',
        },
      ];

      await Appointment.insertMany(appointmentsData);
      console.log(`✓ Seeded ${appointmentsData.length} appointments`);
    } else {
      console.log(`✓ Appointments exist (${appointmentCount} found)`);
    }

    console.log('--- Database Seeding Complete ---');
  } catch (error) {
    console.error('Error during database seeding:', error);
    throw error;
  }
};

// If run directly via command line
if (require.main === module) {
  (async () => {
    await connectDB();
    await seedDatabase();
    await mongoose.disconnect();
    process.exit(0);
  })();
}
