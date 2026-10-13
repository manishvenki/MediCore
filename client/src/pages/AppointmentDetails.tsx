import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { appointmentService } from '../services/appointmentService';
import { Appointment, AppointmentStatus } from '../types';
import { Button } from '../components/common/Button';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Card } from '../components/common/Card';
import { AppointmentStatusBadge } from '../components/dashboard/AppointmentStatusBadge';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { DetailsSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { useToast } from '../hooks/useToast';
import { formatDateReadable } from '../utils/formatters';
import { getDoctorPhoto, getDoctorDetail } from '../utils/doctorData';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  User,
  Stethoscope,
  FileText,
  CheckCircle2,
  Building,
  Phone,
  Mail,
  ShieldCheck,
  Activity,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const AppointmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);

  const fetchAppointmentDetails = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await appointmentService.getAppointmentById(id);
      setAppointment(data);
    } catch (err: any) {
      console.error('Failed to load appointment details:', err);
      setError(err.response?.data?.message || 'Appointment record not found.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAppointmentDetails();
  }, [fetchAppointmentDetails]);

  const handleStatusChange = async (newStatus: AppointmentStatus) => {
    if (!id || !appointment) return;
    setIsUpdatingStatus(true);
    try {
      const updated = await appointmentService.updateAppointment(id, {
        status: newStatus,
      });
      setAppointment(updated);
      showToast(`Appointment status updated to ${newStatus}.`, 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update status.', 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await appointmentService.deleteAppointment(id);
      showToast('Appointment cancelled and slot released.', 'success');
      navigate('/appointments');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to cancel appointment.', 'error');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={[{ label: 'Appointments', path: '/appointments' }, { label: 'Details' }]} />
        <DetailsSkeleton />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={[{ label: 'Appointments', path: '/appointments' }, { label: 'Error' }]} />
        <ErrorState
          title="Appointment Record Not Located"
          message={error || 'The requested appointment record does not exist or has been archived.'}
          onRetry={fetchAppointmentDetails}
        />
        <Button
          variant="secondary"
          onClick={() => navigate('/appointments')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Appointments
        </Button>
      </div>
    );
  }

  const doctorPhoto = getDoctorPhoto(appointment.doctor?.doctorId, appointment.doctor?.name);
  const doctorDetail = getDoctorDetail(appointment.doctor?.doctorId, appointment.doctor?.name);

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Appointments', path: '/appointments' },
          { label: appointment.appointmentId },
        ]}
      />

      {/* Top Banner and Actions */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-[#2563EB] flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md">
                {appointment.appointmentId}
              </span>
              <h1 className="text-2xl font-bold text-[#0F172A]">Clinical Encounter Dossier</h1>
              <AppointmentStatusBadge status={appointment.status} />
            </div>
            <p className="text-xs text-[#64748B] mt-1.5 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 font-semibold text-[#0F172A]">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                {appointment.appointmentTime}
              </span>
              <span>&bull;</span>
              <span>{formatDateReadable(appointment.appointmentDate)}</span>
              <span>&bull;</span>
              <span>Booked on {formatDateReadable(appointment.createdAt)}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <Button
            variant="secondary"
            onClick={() => navigate('/appointments')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate(`/appointments/${appointment._id}/edit`)}
            leftIcon={<Edit2 className="w-4 h-4" />}
          >
            Edit Encounter
          </Button>
          <Button
            variant="danger"
            onClick={() => setIsDeleteModalOpen(true)}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Cancel Appointment
          </Button>
        </div>
      </div>

      {/* Clinical Status Transition Bar */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">
            Clinical Lifecycle Management
          </span>
          <p className="text-xs text-[#0F172A] font-semibold mt-0.5">
            Advance encounter through operational care stages:
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(['Pending', 'Confirmed', 'Completed', 'Cancelled'] as AppointmentStatus[]).map(
            (status) => {
              const isActive = appointment.status === status;
              return (
                <button
                  key={status}
                  disabled={isUpdatingStatus || isActive}
                  onClick={() => handleStatusChange(status)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isActive
                      ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-sm cursor-default'
                      : 'bg-white hover:bg-slate-50 text-[#475569] border-[#E2E8F0]'
                  }`}
                >
                  Mark as {status}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attending Physician Card */}
        <Card
          title="Attending Physician"
          subtitle="Assigned clinical specialist"
          action={
            <button
              onClick={() => navigate('/doctors')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Doctor Directory <ExternalLink className="w-3 h-3" />
            </button>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
              <img
                src={doctorPhoto}
                alt={appointment.doctor?.name}
                className="w-14 h-14 rounded-2xl object-cover object-top border-2 border-slate-200 shadow-sm"
              />
              <div>
                <h4 className="font-bold text-[#0F172A] text-sm">
                  {appointment.doctor?.name || 'Assigned Physician'}
                </h4>
                <p className="text-xs font-semibold text-blue-600">
                  {appointment.doctor?.specialization}
                </p>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  {doctorDetail?.department || 'Clinical Services'}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-[#64748B]">
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-[#94A3B8]" />
                  Consultation Room:
                </span>
                <span className="font-semibold text-[#0F172A]">
                  {doctorDetail?.roomNumber || 'Room 301'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#64748B]">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#94A3B8]" />
                  Contact Line:
                </span>
                <span className="font-semibold text-[#0F172A]">
                  {appointment.doctor?.phone || '+1 555-0100'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#64748B]">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#94A3B8]" />
                  Internal Email:
                </span>
                <span className="font-mono text-[#0F172A]">
                  {appointment.doctor?.email || 'doctor@medicore.com'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Patient Demographic Card */}
        <Card
          title="Patient Demographic"
          subtitle="Registered patient identification"
          action={
            appointment.patient?._id && (
              <button
                onClick={() => navigate(`/patients/${appointment.patient._id}`)}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                View Full Profile <ExternalLink className="w-3 h-3" />
              </button>
            )
          }
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 text-[#0F172A] flex items-center justify-center font-bold text-lg shrink-0">
                {appointment.patient?.fullName ? appointment.patient.fullName.charAt(0) : 'P'}
              </div>
              <div>
                <h4 className="font-bold text-[#0F172A] text-sm">
                  {appointment.patient?.fullName || 'Unassigned Patient'}
                </h4>
                <p className="font-mono text-xs font-bold text-blue-600">
                  {appointment.patient?.patientId || 'ID: -'}
                </p>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  {appointment.patient?.gender} &bull; {appointment.patient?.phone}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-[#64748B]">
                <span>Registered Email:</span>
                <span className="font-medium text-[#0F172A]">
                  {appointment.patient?.email || 'Not provided'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#64748B]">
                <span>Emergency Contact:</span>
                <span className="font-medium text-[#0F172A] truncate max-w-[180px]">
                  {appointment.patient?.emergencyContact || 'None listed'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#64748B]">
                <span>Residential Address:</span>
                <span className="font-medium text-[#0F172A] truncate max-w-[180px]">
                  {appointment.patient?.address || 'On file'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Clinical Reason & Notes Card */}
        <Card title="Encounter Purpose" subtitle="Clinical reason & triage directives">
          <div className="space-y-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#94A3B8] font-bold block mb-1">
                Stated Chief Complaint / Reason
              </span>
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium text-[#0F172A] leading-relaxed">
                {appointment.reason || 'Routine general clinical review.'}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Standard infection control precautions verified</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Activity className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Pre-consultation vital signs queued at nursing triage</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Cancellation Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Cancel and Release Appointment"
        message={`Are you sure you want to cancel appointment "${appointment.appointmentId}"? This reservation will be removed from the daily schedule.`}
        confirmText="Cancel Appointment"
        confirmVariant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
