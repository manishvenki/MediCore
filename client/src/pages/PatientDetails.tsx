import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { patientService } from '../services/patientService';
import { appointmentService } from '../services/appointmentService';
import { Patient, Appointment } from '../types';
import { Button } from '../components/common/Button';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Card } from '../components/common/Card';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { DetailsSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { useToast } from '../hooks/useToast';
import { formatDateReadable, calculateAge } from '../utils/formatters';
import { getDoctorPhoto } from '../utils/doctorData';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  HeartHandshake,
  FileText,
  Activity,
  PlusCircle,
  Copy,
  Check,
  Clock,
  AlertTriangle,
  Stethoscope,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [copiedMRN, setCopiedMRN] = useState<boolean>(false);

  const fetchPatientDetails = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await patientService.getPatientById(id);
      setPatient(data);

      // Fetch patient's appointments
      setIsLoadingAppointments(true);
      try {
        const aptRes = await appointmentService.getAppointments({
          search: data.patientId,
          limit: 10,
        });
        setAppointments(aptRes.data || []);
      } catch (aptErr) {
        console.warn('Could not load appointment history for patient:', aptErr);
      } finally {
        setIsLoadingAppointments(false);
      }
    } catch (err: any) {
      console.error('Failed to load patient details:', err);
      setError(err.response?.data?.message || 'Patient record could not be found.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPatientDetails();
  }, [fetchPatientDetails]);

  const handleCopyMRN = () => {
    if (!patient?.patientId) return;
    navigator.clipboard.writeText(patient.patientId);
    setCopiedMRN(true);
    showToast(`Copied MRN: ${patient.patientId}`, 'info');
    setTimeout(() => setCopiedMRN(false), 2000);
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await patientService.deletePatient(id);
      showToast('Patient record deleted successfully.', 'success');
      navigate('/patients');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete patient.', 'error');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={[{ label: 'Patients', path: '/patients' }, { label: 'Details' }]} />
        <DetailsSkeleton />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={[{ label: 'Patients', path: '/patients' }, { label: 'Error' }]} />
        <ErrorState
          title="Patient Not Found"
          message={error || 'The requested patient profile does not exist or has been removed.'}
          onRetry={fetchPatientDetails}
        />
        <Button variant="secondary" onClick={() => navigate('/patients')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Patients
        </Button>
      </div>
    );
  }

  // Detect critical notes or allergy alerts
  const hasAllergyWarning =
    Boolean(patient.medicalNotes) &&
    /allergy|allergic|penicillin|latex|asthma|diabet|hypertens/i.test(patient.medicalNotes || '');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Patients', path: '/patients' },
          { label: patient.fullName },
        ]}
      />

      {/* Enterprise Patient Dossier Header */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white flex items-center justify-center font-bold text-2xl shadow-sm ring-4 ring-[#F1F5F9] shrink-0">
              {patient.fullName.charAt(0)}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">{patient.fullName}</h1>
                
                <button
                  onClick={handleCopyMRN}
                  title="Click to copy MRN"
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] border border-[#CBD5E1] transition-colors"
                >
                  <span>MRN: {patient.patientId}</span>
                  {copiedMRN ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-[#64748B]" />
                  )}
                </button>

                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Inpatient / Outpatient
                </span>
              </div>

              {/* Demographics Pill Bar */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] mt-2">
                <span className="font-medium text-[#1E293B]">
                  {patient.gender}
                </span>
                <span>•</span>
                <span>
                  {patient.age ?? (patient.dateOfBirth ? calculateAge(patient.dateOfBirth) : 'N/A')} Years Old
                </span>
                <span>•</span>
                <span>
                  DOB: {formatDateReadable(patient.dateOfBirth)}
                </span>
                <span>•</span>
                <span>
                  Intake: {formatDateReadable(patient.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="secondary"
              onClick={() => navigate('/patients')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>

            <Button
              variant="primary"
              onClick={() => navigate(`/appointments/new?patientId=${patient._id}`)}
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Schedule Appointment
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate(`/patients/${patient._id}/edit`)}
              leftIcon={<Edit2 className="w-4 h-4" />}
            >
              Edit Record
            </Button>

            <Button
              variant="danger"
              onClick={() => setIsDeleteModalOpen(true)}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Clinical Allergy & Safety Alert Banner */}
        {hasAllergyWarning && (
          <div className="mt-5 p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <span className="font-bold uppercase tracking-wider text-[11px] text-amber-800 block mb-0.5">
                Clinical Precaution Notice
              </span>
              Patient profile notes contain reported allergies or chronic risk factors. Please review medication sensitivities and clinical notes prior to prescribing or scheduling invasive procedures.
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Clinical Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Demographics & Clinical Observations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Demographics Card */}
          <Card
            title="Patient Demographics"
            subtitle="Identification, primary contact, and verified location"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center gap-2 text-[#64748B] text-xs font-medium mb-1">
                  <User className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Full Legal Name</span>
                </div>
                <p className="font-semibold text-[#0F172A]">{patient.fullName}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center gap-2 text-[#64748B] text-xs font-medium mb-1">
                  <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Date of Birth</span>
                </div>
                <p className="font-semibold text-[#0F172A]">
                  {formatDateReadable(patient.dateOfBirth)} ({patient.age ?? (patient.dateOfBirth ? calculateAge(patient.dateOfBirth) : 'N/A')} yrs)
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center gap-2 text-[#64748B] text-xs font-medium mb-1">
                  <Phone className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Primary Telephone</span>
                </div>
                <p className="font-semibold text-[#0F172A] font-mono">{patient.phone}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center gap-2 text-[#64748B] text-xs font-medium mb-1">
                  <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Email Address</span>
                </div>
                <p className="font-semibold text-[#0F172A] truncate">
                  {patient.email || <span className="text-[#94A3B8] font-normal italic">None provided</span>}
                </p>
              </div>

              <div className="sm:col-span-2 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center gap-2 text-[#64748B] text-xs font-medium mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Residential Address</span>
                </div>
                <p className="font-semibold text-[#0F172A]">
                  {patient.address || <span className="text-[#94A3B8] font-normal italic">No residential address recorded.</span>}
                </p>
              </div>
            </div>
          </Card>

          {/* Clinical Notes & Allergies Card */}
          <Card
            title="Clinical History & Observations"
            subtitle="Known allergies, ongoing prescriptions, and medical precautions"
          >
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">
                  <FileText className="w-4 h-4 text-[#2563EB]" />
                  <span>Physician Notes & Encounter History</span>
                </div>
                <p className="text-sm text-[#1E293B] leading-relaxed whitespace-pre-wrap">
                  {patient.medicalNotes || 'No specific clinical notes or allergic alerts documented for this patient.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-white border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[11px]">Primary Status</span>
                  <span className="font-semibold text-[#0F172A] mt-0.5 block">Verified EHR</span>
                </div>
                <div className="p-3 rounded-lg bg-white border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[11px]">HIPAA Consent</span>
                  <span className="font-semibold text-emerald-600 mt-0.5 block flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> On File
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-white border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[11px]">Billing Tier</span>
                  <span className="font-semibold text-[#0F172A] mt-0.5 block">Standard Ambulatory</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Appointment History */}
          <Card
            title="Consultation History"
            subtitle="Scheduled, active, and completed appointments for this patient"
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/appointments/new?patientId=${patient._id}`)}
                leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
              >
                New Booking
              </Button>
            }
          >
            {isLoadingAppointments ? (
              <div className="p-8 text-center text-sm text-[#64748B]">
                <div className="w-6 h-6 border-2 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin mx-auto mb-2" />
                Loading consultation records...
              </div>
            ) : appointments.length === 0 ? (
              <div className="p-8 text-center bg-[#F8FAFC] rounded-xl border border-dashed border-[#CBD5E1]">
                <Calendar className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#1E293B]">No Consultation History Found</p>
                <p className="text-xs text-[#64748B] max-w-sm mx-auto mt-1 mb-4">
                  There are no scheduled or historical clinical encounters on file for {patient.fullName}.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/appointments/new?patientId=${patient._id}`)}
                  leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
                >
                  Schedule Initial Consultation
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((apt) => {
                  const doctorObj = typeof apt.doctor === 'object' ? apt.doctor : null;
                  const docPhoto = doctorObj ? getDoctorPhoto(doctorObj.doctorId || doctorObj.name) : null;

                  return (
                    <div
                      key={apt._id}
                      onClick={() => navigate(`/appointments/${apt._id}`)}
                      className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#2563EB]/40 hover:shadow-sm transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-[#E2E8F0]">
                          {docPhoto ? (
                            <img
                              src={docPhoto}
                              alt={doctorObj?.name || 'Doctor'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-blue-50 text-[#2563EB]">
                              <Stethoscope className="w-5 h-5" />
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                              {doctorObj?.name || 'Attending Physician'}
                            </span>
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-[#475569] border border-slate-200">
                              {apt.appointmentId}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-[#64748B] mt-0.5">
                            <span>{doctorObj?.specialization || 'Clinical Specialist'}</span>
                            <span>•</span>
                            <span className="truncate max-w-[180px] text-[#475569]">
                              {apt.reason || 'General Consultation'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:justify-end">
                        <div className="text-right text-xs">
                          <p className="font-semibold text-[#0F172A]">{formatDateReadable(apt.appointmentDate)}</p>
                          <p className="text-[#64748B] font-mono text-[11px]">{apt.appointmentTime}</p>
                        </div>

                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusBadge(
                            apt.status
                          )}`}
                        >
                          {apt.status}
                        </span>

                        <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#2563EB] transition-colors hidden sm:block" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Emergency Contact, Vital Telemetry, Roadmap */}
        <div className="space-y-6">
          {/* Emergency Contact & Caregiver */}
          <Card
            title="Emergency & Caregiver"
            subtitle="Authorized next of kin contact"
          >
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] mb-1.5">
                  <HeartHandshake className="w-4 h-4 text-rose-500" />
                  <span>Designated Caregiver</span>
                </div>
                <p className="font-semibold text-sm text-[#0F172A]">
                  {patient.emergencyContact || (
                    <span className="text-[#94A3B8] font-normal italic">
                      No designated emergency contact registered.
                    </span>
                  )}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-xs text-[#1E40AF] leading-relaxed">
                <span className="font-bold block mb-1">Emergency Protocol</span>
                For critical clinical escalations, verify caregiver identity prior to disclosing electronic health records.
              </div>
            </div>
          </Card>

          {/* Vitals Baseline & Telemetry */}
          <Card
            title="Baseline Clinical Vitals"
            subtitle="Standard outpatient intake metrics"
          >
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[11px]">Heart Rate</span>
                <span className="font-mono font-bold text-sm text-[#0F172A] mt-0.5 block">
                  72 <span className="text-[10px] text-[#64748B] font-normal">BPM</span>
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">Resting Normal</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[11px]">Blood Pressure</span>
                <span className="font-mono font-bold text-sm text-[#0F172A] mt-0.5 block">
                  120/80 <span className="text-[10px] text-[#64748B] font-normal">mmHg</span>
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">Normotensive</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[11px]">Oxygen (SpO2)</span>
                <span className="font-mono font-bold text-sm text-[#0F172A] mt-0.5 block">
                  98%
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">Optimal</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[11px]">Temperature</span>
                <span className="font-mono font-bold text-sm text-[#0F172A] mt-0.5 block">
                  98.6°F
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">Afebrile</span>
              </div>
            </div>
          </Card>

          {/* Electronic Records Roadmap Preview */}
          <div className="bg-white rounded-2xl border border-dashed border-[#CBD5E1] p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-[#0F172A]">Diagnostic Lab Records</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                PHASE 2
              </span>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed mb-4">
              Integrated PACS imaging, HL7 lab reports, and automated electronic prescription sync will be available in the next deployment.
            </p>
            <Button
              variant="secondary"
              size="sm"
              disabled
              className="w-full"
              leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
            >
              Upload Lab Document
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Patient Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Patient Record"
        message={`Are you sure you want to permanently delete patient "${patient.fullName}" (${patient.patientId})? This action will remove all affiliated health records.`}
        confirmText="Delete Record"
        confirmVariant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
