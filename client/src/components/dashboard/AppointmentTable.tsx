import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Appointment } from '../../types';
import { AppointmentStatusBadge } from './AppointmentStatusBadge';
import { Button } from '../common/Button';
import { Eye, Edit2, ArrowRight, CalendarClock, User, Stethoscope, Clock } from 'lucide-react';
import { getDoctorPhoto } from '../../utils/doctorData';

interface AppointmentTableProps {
  appointments: Appointment[];
  isLoading?: boolean;
}

export const AppointmentTable: React.FC<AppointmentTableProps> = ({ appointments }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card overflow-hidden">
      <div className="px-6 py-4.5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">Today&apos;s Clinical Agenda</h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Scheduled patient consultations, triage reviews, and follow-ups
            </p>
          </div>
        </div>
        <Link
          to="/appointments"
          className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1.5 transition-colors self-start sm:self-auto py-1"
        >
          <span>View All Schedule</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs font-bold text-[#64748B] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-6">Time Slot</th>
              <th className="py-3 px-6">Patient</th>
              <th className="py-3 px-6">Attending Physician</th>
              <th className="py-3 px-6">Clinical Reason</th>
              <th className="py-3 px-6">Triage Status</th>
              <th className="py-3 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#64748B]">
                  <CalendarClock className="w-8 h-8 mx-auto text-[#94A3B8] mb-2" />
                  <p className="font-semibold text-[#0F172A]">No consultations scheduled for today</p>
                  <p className="text-xs mt-1">Upcoming patient consultations will synchronize here automatically</p>
                </td>
              </tr>
            ) : (
              appointments.map((apt) => {
                const doctorPhoto = getDoctorPhoto(apt.doctor?.doctorId, apt.doctor?.name);

                return (
                  <tr
                    key={apt._id}
                    className="hover:bg-[#F8FAFC]/80 transition-colors group"
                  >
                    <td className="py-4 px-6 font-semibold text-[#0F172A] whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-blue-700 bg-blue-50/80 px-2.5 py-1 rounded-md w-fit border border-blue-100">
                        <Clock className="w-3 h-3" />
                        <span>{apt.appointmentTime}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-[#0F172A] flex items-center justify-center text-xs font-bold shrink-0 border border-slate-200">
                          {apt.patient?.fullName ? (
                            apt.patient.fullName.charAt(0)
                          ) : (
                            <User className="w-3.5 h-3.5 text-[#64748B]" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-[#0F172A]">
                            {apt.patient?.fullName || 'Unassigned Patient'}
                          </div>
                          <div className="text-[11px] font-mono text-[#64748B]">
                            {apt.patient?.patientId || 'ID: -'}
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
                            {apt.doctor?.name || 'Attending Physician'}
                          </div>
                          <div className="text-[11px] text-[#64748B]">
                            {apt.doctor?.specialization || 'Clinical Staff'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap text-xs text-[#334155] max-w-xs truncate">
                      {apt.reason || 'General Routine Consultation'}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <AppointmentStatusBadge status={apt.status} />
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100">
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
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
