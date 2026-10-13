import { Request, Response, NextFunction } from 'express';
import { Patient } from '../models/Patient';
import { Appointment } from '../models/Appointment';

export const getPatients = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string || '').trim();
    const gender = req.query.gender as string;

    const query: Record<string, any> = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { patientId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (gender && ['Male', 'Female', 'Other'].includes(gender)) {
      query.gender = gender;
    }

    const skip = (page - 1) * limit;
    const [total, patients] = await Promise.all([
      Patient.countDocuments(query),
      Patient.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    res.status(200).json({
      success: true,
      data: patients,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

export const getPatientById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const patient = await Patient.findById(id);
    if (!patient) {
      res.status(404).json({
        success: false,
        message: 'Patient record not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

export const createPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { fullName, phone, email, dateOfBirth, gender, address, emergencyContact, medicalNotes } =
      req.body;

    // Field validations
    if (!fullName || !fullName.trim()) {
      res.status(400).json({ success: false, message: 'Full name is required.' });
      return;
    }
    if (!phone || !phone.trim()) {
      res.status(400).json({ success: false, message: 'Phone number is required.' });
      return;
    }
    if (!dateOfBirth) {
      res.status(400).json({ success: false, message: 'Date of birth is required.' });
      return;
    }
    if (!gender || !['Male', 'Female', 'Other'].includes(gender)) {
      res.status(400).json({ success: false, message: 'Valid gender (Male, Female, Other) is required.' });
      return;
    }

    // Auto-generate next Patient ID: P001, P002...
    const count = await Patient.countDocuments();
    const patientSeq = (count + 1).toString().padStart(3, '0');
    const patientId = `P${patientSeq}`;

    const newPatient = new Patient({
      patientId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email ? email.trim().toLowerCase() : undefined,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      address: address ? address.trim() : '',
      emergencyContact: emergencyContact ? emergencyContact.trim() : '',
      medicalNotes: medicalNotes ? medicalNotes.trim() : '',
    });

    await newPatient.save();

    res.status(201).json({
      success: true,
      message: 'Patient created successfully.',
      data: newPatient,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { fullName, phone, email, dateOfBirth, gender, address, emergencyContact, medicalNotes } =
      req.body;

    const patient = await Patient.findById(id);
    if (!patient) {
      res.status(404).json({ success: false, message: 'Patient not found.' });
      return;
    }

    if (fullName) patient.fullName = fullName.trim();
    if (phone) patient.phone = phone.trim();
    if (email !== undefined) patient.email = email ? email.trim().toLowerCase() : '';
    if (dateOfBirth) patient.dateOfBirth = new Date(dateOfBirth);
    if (gender && ['Male', 'Female', 'Other'].includes(gender)) patient.gender = gender;
    if (address !== undefined) patient.address = address.trim();
    if (emergencyContact !== undefined) patient.emergencyContact = emergencyContact.trim();
    if (medicalNotes !== undefined) patient.medicalNotes = medicalNotes.trim();

    await patient.save();

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully.',
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const patient = await Patient.findById(id);
    if (!patient) {
      res.status(404).json({ success: false, message: 'Patient not found.' });
      return;
    }

    // Delete associated appointments or cascade cleanup
    await Appointment.deleteMany({ patient: patient._id });
    await Patient.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Patient and related records deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
