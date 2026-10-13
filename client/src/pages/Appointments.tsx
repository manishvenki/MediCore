import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentService } from '../services/appointmentService';
import { Appointment, AppointmentStatus } from '../types';
import { Button } from '../components/common/Button';
import { SearchInput } from '../components/common/SearchInput';
import { Pagination } from '../components/common/Pagination';
import { TableSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { AppointmentStatusBadge } from '../components/dashboard/AppointmentStatusBadge';
import { useToast } from '../hooks/useToast';
import { useDebounce } from '../hooks/useDebounce';
import { formatDateReadable } from '../utils/formatters';
import { getDoctorPhoto } from '../utils/doctorData';
import {
  CalendarPlus,
  Calendar,
  Eye,
  Edit2,
  Trash2,
  Filter,
  User,
  Clock,
  RotateCcw,
} from 'lucide-react';

export const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 350);

  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit] = useState<number>(10);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Deletion modal state
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await appointmentService.getAppointments({
        page: currentPage,
        limit,
        search: debouncedSearch,
        status: statusFilter || undefined,
        date: dateFilter || undefined,
      });
      setAppointments(res.data);
      setTotalPages(res.totalPages);
      setTotalRecords(res.total);
    } catch (err: any) {
      console.error('Failed to fetch appointments:', err);
      setError(err.response?.data?.message || 'Unable to load appointments schedule.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, debouncedSearch, statusFilter, dateFilter]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleDeleteConfirm = async () => {
    if (!appointmentToDelete) return;
    setIsDeleting(true);
    try {
      await appointmentService.deleteAppointment(appointmentToDelete._id);
      showToast(
        `Appointment ${appointmentToDelete.appointmentId} removed successfully.`,
        'success'
      );
      setAppointmentToDelete(null);
      fetchAppointments();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to remove appointment.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setDateFilter('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Clinical Appointments
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {totalRecords} Total Scheduled
            </span>
          </div>
          <p className="text-sm text-[#64748B] mt-1">
            Manage scheduled patient consultations, attending staff assignments, and consultation lifecycles.
          </p>
        </div>
        <Button
          onClick={() => navigate('/appointments/new')}
          leftIcon={<CalendarPlus className="w-4 h-4" />}
          className="self-start sm:self-auto font-semibold shadow-sm"
        >
          Schedule Appointment
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-card flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
            placeholder="Search by patient, physician, or Appointment ID..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
            <Filter className="w-4 h-4 text-[#94A3B8]" />
            <span>Triage Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#0F172A] font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
          >
            <option value="">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
            <Calendar className="w-4 h-4 text-[#94A3B8]" />
            <span>Consultation Date:</span>
          </div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-[#0F172A] font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
          />

          {(searchTerm || statusFilter || dateFilter) && (
            <button
              onClick={clearFilters}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 transition-colors px-2 py-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Appointments Table */}
      {isLoading ? (
        <TableSkeleton rows={8} cols={7} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchAppointments} />
      ) : appointments.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No appointments scheduled"
          description={
            debouncedSearch || statusFilter || dateFilter
              ? 'No appointments match the applied filter criteria.'
              : 'Maintain organized clinical schedules by booking consultation slots for registered patients.'
          }
          actionText={debouncedSearch || statusFilter || dateFilter ? undefined : 'Book Consultation'}
          onAction={() => navigate('/appointments/new')}
          actionIcon={<CalendarPlus className="w-4 h-4" />}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs font-bold text-[#64748B] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Appointment ID</th>
                  <th className="py-3.5 px-6">Patient</th>
                  <th className="py-3.5 px-6">Attending Physician</th>
                  <th className="py-3.5 px-6">Scheduled Date</th>
                  <th className="py-3.5 px-6">Time Slot</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {appointments.map((apt) => {
                  const doctorPhoto = getDoctorPhoto(apt.doctor?.doctorId, apt.doctor?.name);

                  return (
                    <tr
                      key={apt._id}
                      className="hover:bg-[#F8FAFC]/80 transition-colors group"
                    >
                      <td className="py-4 px-6 font-mono text-xs font-bold text-blue-700 whitespace-nowrap">
                        <span className="bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md">
                          {apt.appointmentId}
                        </span>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-[#0F172A] flex items-center justify-center text-xs font-bold shrink-0">
                            {apt.patient?.fullName ? (
                              apt.patient.fullName.charAt(0)
                            ) : (
                              <User className="w-3.5 h-3.5 text-[#64748B]" />
                            )}
                          </div>
                          <div>
                            <button
                              onClick={() => apt.patient?._id && navigate(`/patients/${apt.patient._id}`)}
                              className="font-bold text-[#0F172A] hover:text-[#2563EB] transition-colors text-left"
                            >
                              {apt.patient?.fullName || 'Unassigned Patient'}
                            </button>
                            <div className="text-[11px] text-[#64748B]">
                              {apt.patient?.phone || 'No phone'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={doctorPhoto}
                            alt={apt.doctor?.name || 'Doctor'}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-[#0F172A]">
                              {apt.doctor?.name || 'Dr. Assigned'}
                            </div>
                            <div className="text-[11px] text-[#64748B]">
                              {apt.doctor?.specialization || 'Clinical'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap text-[#0F172A] font-medium text-xs">
                        {formatDateReadable(apt.appointmentDate)}
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-xs text-[#0F172A] bg-slate-100/80 px-2.5 py-1 rounded-md w-fit">
                          <Clock className="w-3 h-3 text-blue-600" />
                          <span>{apt.appointmentTime}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <AppointmentStatusBadge status={apt.status} />
                      </td>

                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/appointments/${apt._id}`)}
                            leftIcon={<Eye className="w-3.5 h-3.5" />}
                            className="text-[#64748B] hover:text-[#2563EB]"
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/appointments/${apt._id}/edit`)}
                            leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                            className="text-[#64748B] hover:text-[#0F766E]"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setAppointmentToDelete(apt)}
                            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                            className="text-[#DC2626] hover:bg-red-50 hover:text-red-700"
                          >
                            Cancel
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            limit={limit}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Confirmation Modal for Appointment Cancellation */}
      <ConfirmDialog
        isOpen={!!appointmentToDelete}
        onClose={() => setAppointmentToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Cancel Scheduled Appointment"
        message={`Are you sure you want to cancel appointment "${appointmentToDelete?.appointmentId}" for patient ${appointmentToDelete?.patient?.fullName}? This slot will be released.`}
        confirmText="Cancel Appointment"
        confirmVariant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
