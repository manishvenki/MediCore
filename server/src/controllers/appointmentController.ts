import { Request, Response, NextFunction } from 'express';
import { Appointment } from '../models/Appointment';
import { Patient } from '../models/Patient';
import { Doctor } from '../models/Doctor';

export const getAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string || '').trim();
    const status = req.query.status as string;
    const date = req.query.date as string;

    const filterQuery: Record<string, any> = {};

    if (status && ['Confirmed', 'Pending', 'Cancelled', 'Completed'].includes(status)) {
      filterQuery.status = status;
    }

    if (date) {
      filterQuery.appointmentDate = date;
    }

    // If search term is present, find matching patient or doctor IDs first, or match appointmentId
    if (search) {
      const [matchingPatients, matchingDoctors] = await Promise.all([
        Patient.find({
          $or: [
            { fullName: { $regex: search, $options: 'i' } },
            { patientId: { $regex: search, $options: 'i' } },
          ],
        }).select('_id'),
        Doctor.find({
          name: { $regex: search, $options: 'i' },
        }).select('_id'),
      ]);

      const patientIds = matchingPatients.map((p) => p._id);
      const doctorIds = matchingDoctors.map((d) => d._id);

      filterQuery.$or = [
        { appointmentId: { $regex: search, $options: 'i' } },
        { patient: { $in: patientIds } },
        { doctor: { $in: doctorIds } },
      ];
    }

    const skip = (page - 1) * limit;
    const [total, appointments] = await Promise.all([
      Appointment.countDocuments(filterQuery),
      Appointment.find(filterQuery)
        .populate('patient', 'fullName patientId phone email gender')
        .populate('doctor', 'name specialization doctorId email')
        .sort({ appointmentDate: -1, appointmentTime: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    res.status(200).json({
      success: true,
      data: appointments,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

export const getAppointmentById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
      .populate('patient', 'fullName patientId phone email gender address emergencyContact')
      .populate('doctor', 'name specialization doctorId phone email');

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: 'Appointment not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

export const createAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { patient, doctor, appointmentDate, appointmentTime, reason, status } = req.body;

    if (!patient) {
      res.status(400).json({ success: false, message: 'Patient selection is required.' });
      return;
    }
    if (!doctor) {
      res.status(400).json({ success: false, message: 'Doctor selection is required.' });
      return;
    }
    if (!appointmentDate) {
      res.status(400).json({ success: false, message: 'Appointment date is required.' });
      return;
    }
    if (!appointmentTime) {
      res.status(400).json({ success: false, message: 'Appointment time is required.' });
      return;
    }

    // Validate patient exists
    const existingPatient = await Patient.findById(patient);
    if (!existingPatient) {
      res.status(404).json({ success: false, message: 'Selected patient does not exist.' });
      return;
    }

    // Validate doctor exists
    const existingDoctor = await Doctor.findById(doctor);
    if (!existingDoctor) {
      res.status(404).json({ success: false, message: 'Selected doctor does not exist.' });
      return;
    }

    // Prevent dates in past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(appointmentDate);
    if (selectedDate < today) {
      res.status(400).json({
        success: false,
        message: 'Cannot schedule appointments in the past.',
      });
      return;
    }

    // Generate unique Appointment ID
    const count = await Appointment.countDocuments();
    const aptSeq = (count + 1).toString().padStart(4, '0');
    const appointmentId = `APT-${aptSeq}`;

    const newAppointment = new Appointment({
      appointmentId,
      patient,
      doctor,
      appointmentDate,
      appointmentTime,
      reason: reason ? reason.trim() : 'General Consultation',
      status: status || 'Pending',
    });

    await newAppointment.save();

    const populatedAppointment = await Appointment.findById(newAppointment._id)
      .populate('patient', 'fullName patientId phone email gender')
      .populate('doctor', 'name specialization doctorId');

    res.status(201).json({
      success: true,
      message: 'Appointment scheduled successfully.',
      data: populatedAppointment,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { patient, doctor, appointmentDate, appointmentTime, reason, status } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      res.status(404).json({ success: false, message: 'Appointment not found.' });
      return;
    }

    if (patient) appointment.patient = patient;
    if (doctor) appointment.doctor = doctor;
    if (appointmentDate) appointment.appointmentDate = appointmentDate;
    if (appointmentTime) appointment.appointmentTime = appointmentTime;
    if (reason !== undefined) appointment.reason = reason.trim();
    if (status && ['Confirmed', 'Pending', 'Cancelled', 'Completed'].includes(status)) {
      appointment.status = status;
    }

    await appointment.save();

    const updated = await Appointment.findById(id)
      .populate('patient', 'fullName patientId phone email gender')
      .populate('doctor', 'name specialization doctorId');

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      res.status(404).json({ success: false, message: 'Appointment not found.' });
      return;
    }

    await Appointment.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
