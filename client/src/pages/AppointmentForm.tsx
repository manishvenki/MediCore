import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { appointmentService, AppointmentFormData } from '../services/appointmentService';
import { patientService } from '../services/patientService';
import { doctorService } from '../services/doctorService';
import { Patient, Doctor, AppointmentStatus } from '../types';
import { Select } from '../components/common/Select';
import { Input } from '../components/common/Input';
import { Textarea } from '../components/common/Textarea';
import { Button } from '../components/common/Button';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Card } from '../components/common/Card';
import { useToast } from '../hooks/useToast';
import { formatDateInput } from '../utils/formatters';
import { getDoctorPhoto, getDoctorDetail } from '../utils/doctorData';
import {
  Calendar,
  Clock,
  ArrowLeft,
  Save,
  PlusCircle,
  Stethoscope,
  User,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const AppointmentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const initialPatientId = searchParams.get('patientId') || '';
  const initialDoctorId = searchParams.get('doctorId') || '';
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState<boolean>(true);

  // Form State
  const [formData, setFormData] = useState<AppointmentFormData>({
    patient: initialPatientId,
    doctor: initialDoctorId,
    appointmentDate: '',
    appointmentTime: '09:00 AM',
    reason: 'General Clinical Review',
    status: 'Pending',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(isEditMode);

  // Load patients and doctors for selection dropdowns
  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [patientsRes, doctorsRes] = await Promise.all([
          patientService.getPatients({ limit: 100 }),
          doctorService.getDoctors(),
        ]);
        setPatients(patientsRes.data);
        setDoctors(doctorsRes);

        // Pre-select first doctor and patient if creating new and not provided via query
        if (!isEditMode) {
          const selectedDoc = initialDoctorId && doctorsRes.some(d => d._id === initialDoctorId)
            ? initialDoctorId
            : (doctorsRes.length > 0 ? doctorsRes[0]._id : '');
          
          const selectedPat = initialPatientId && patientsRes.data.some(p => p._id === initialPatientId)
            ? initialPatientId
            : (patientsRes.data.length > 0 ? patientsRes.data[0]._id : '');

          const today = new Date().toISOString().split('T')[0];
          setFormData((prev) => ({
            ...prev,
            doctor: prev.doctor || selectedDoc,
            patient: prev.patient || selectedPat,
            appointmentDate: prev.appointmentDate || today,
          }));
        }
      } catch (err) {
        console.error('Error fetching patients/doctors:', err);
        showToast('Unable to load clinical reference data.', 'error');
      } finally {
        setIsLoadingDropdowns(false);
      }
    };

    loadDependencies();
  }, [isEditMode, showToast, initialPatientId, initialDoctorId]);

  // If editing, load appointment details
  useEffect(() => {
    if (isEditMode && id) {
      const loadAppointment = async () => {
        try {
          const apt = await appointmentService.getAppointmentById(id);
          setFormData({
            patient: typeof apt.patient === 'object' ? apt.patient._id : apt.patient,
            doctor: typeof apt.doctor === 'object' ? apt.doctor._id : apt.doctor,
            appointmentDate: formatDateInput(apt.appointmentDate),
            appointmentTime: apt.appointmentTime,
            reason: apt.reason || '',
            status: apt.status,
          });
        } catch (err: any) {
          showToast('Failed to load appointment information.', 'error');
          navigate('/appointments');
        } finally {
          setIsLoadingDetails(false);
        }
      };
      loadAppointment();
    }
  }, [id, isEditMode, navigate, showToast]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.patient) {
      errs.patient = 'Please select a registered patient.';
    }

    if (!formData.doctor) {
      errs.doctor = 'Please assign an attending physician.';
    }

    if (!formData.appointmentDate) {
      errs.appointmentDate = 'Appointment date is required.';
    } else {
      const selected = new Date(formData.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today && !isEditMode) {
        errs.appointmentDate = 'Cannot schedule consultations in the past.';
      }
    }

    if (!formData.appointmentTime) {
      errs.appointmentTime = 'Consultation time slot is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (isEditMode && id) {
        await appointmentService.updateAppointment(id, formData);
        showToast('Appointment record updated successfully.', 'success');
        navigate(`/appointments/${id}`);
      } else {
        const created = await appointmentService.createAppointment(formData);
        showToast('Appointment scheduled successfully.', 'success');
        navigate(`/appointments/${created._id}`);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to schedule appointment.';
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSlots = [
    '08:30 AM',
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '01:00 PM',
    '01:30 PM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM',
    '05:00 PM',
  ];

  const selectedDoctorObj = doctors.find((d) => d._id === formData.doctor);
  const selectedDoctorPhoto = getDoctorPhoto(selectedDoctorObj?.doctorId, selectedDoctorObj?.name);
  const selectedDoctorDetail = getDoctorDetail(selectedDoctorObj?.doctorId, selectedDoctorObj?.name);

  if (isLoadingDetails || isLoadingDropdowns) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: 'Appointments', path: '/appointments' },
          { label: isEditMode ? 'Edit Encounter' : 'Schedule Appointment' },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            {isEditMode ? 'Modify Consultation Record' : 'Book Clinical Consultation'}
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            {isEditMode
              ? 'Update attending clinician, scheduled time slot, or triage notes.'
              : 'Reserve a clinical consultation slot and assign an attending specialist.'}
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate(isEditMode ? `/appointments/${id}` : '/appointments')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Cancel
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Patient and Doctor Assignment */}
        <Card title="Clinical Assignment" subtitle="Select registered patient and attending specialist">
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-[#0F172A]">
                  Select Patient <span className="text-[#DC2626]">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/patients/new')}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Register New Patient
                </button>
              </div>
              <Select
                value={formData.patient}
                onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                options={patients.map((p) => ({
                  value: p._id,
                  label: `${p.fullName} (${p.patientId}) - ${p.phone}`,
                }))}
                placeholder="Choose a registered patient record"
                error={errors.patient}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                Attending Physician <span className="text-[#DC2626]">*</span>
              </label>
              <Select
                value={formData.doctor}
                onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                options={doctors.map((d) => ({
                  value: d._id,
                  label: `${d.name} — ${d.specialization} (${d.doctorId})`,
                }))}
                placeholder="Assign an attending medical specialist"
                error={errors.doctor}
              />
            </div>

            {/* Selected Doctor Preview Card */}
            {selectedDoctorObj && (
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-4 animate-in fade-in duration-150">
                <img
                  src={selectedDoctorPhoto}
                  alt={selectedDoctorObj.name}
                  className="w-14 h-14 rounded-xl object-cover object-top border border-slate-200 shadow-sm shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0F172A] text-sm truncate">
                      {selectedDoctorObj.name}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                      {selectedDoctorObj.doctorId}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-blue-600 truncate">
                    {selectedDoctorObj.specialization}
                  </p>
                  <p className="text-[11px] text-[#64748B] flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Building className="w-3 h-3 text-[#94A3B8]" />
                      {selectedDoctorDetail?.roomNumber || 'Room 301'}
                    </span>
                    <span>&bull;</span>
                    <span>{selectedDoctorDetail?.experienceYears || 12} yrs experience</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Step 2: Date, Time & Triage Status */}
        <Card title="Scheduling & Triage" subtitle="Consultation slot and initial status">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Consultation Date"
              type="date"
              required
              value={formData.appointmentDate}
              onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
              error={errors.appointmentDate}
              leftIcon={<Calendar className="w-4 h-4" />}
            />

            <Select
              label="Consultation Time Slot"
              required
              value={formData.appointmentTime}
              onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
              options={timeSlots.map((t) => ({ value: t, label: t }))}
              error={errors.appointmentTime}
            />

            <div className="md:col-span-2">
              <Select
                label="Initial Triage Status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as AppointmentStatus,
                  })
                }
                options={[
                  { value: 'Pending', label: 'Pending (Queued for Confirmation)' },
                  { value: 'Confirmed', label: 'Confirmed (Scheduled on Clinical Roster)' },
                  { value: 'Completed', label: 'Completed (Consultation Finished)' },
                  { value: 'Cancelled', label: 'Cancelled' },
                ]}
              />
            </div>

            <div className="md:col-span-2">
              <Textarea
                label="Clinical Objective / Reason for Consultation"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="State the primary clinical reason (e.g. Annual cardiology assessment, hypertension monitoring, post-op joint review)..."
                rows={3}
              />
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(isEditMode ? `/appointments/${id}` : '/appointments')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
            className="font-semibold shadow-sm"
          >
            {isEditMode ? 'Save Encounter Updates' : 'Confirm & Schedule Appointment'}
          </Button>
        </div>
      </form>
    </div>
  );
};
