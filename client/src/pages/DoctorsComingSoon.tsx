import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorService } from '../services/doctorService';
import { Doctor } from '../types';
import { DOCTOR_PROFILES, DoctorDetail, getDoctorDetail } from '../utils/doctorData';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { SearchInput } from '../components/common/SearchInput';
import {
  Stethoscope,
  Mail,
  Phone,
  Building,
  Calendar,
  Award,
  GraduationCap,
  Clock,
  CheckCircle2,
  CalendarPlus,
  Languages,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const DoctorsComingSoon: React.FC = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorDetail | null>(null);

  useEffect(() => {
    doctorService
      .getDoctors()
      .then((data) => setDoctors(data))
      .catch(console.error);
  }, []);

  const departments = ['All', 'Internal Medicine', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Neurology'];

  const filteredDoctors = doctors.filter((doc) => {
    const detail = getDoctorDetail(doc.doctorId, doc.name);
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.doctorId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept =
      departmentFilter === 'All' ||
      (detail && detail.department.toLowerCase().includes(departmentFilter.toLowerCase()));
    return matchesSearch && matchesDept;
  });

  const getStatusBadge = (availability: string) => {
    switch (availability) {
      case 'Available Today':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Available Today
          </span>
        );
      case 'In Consultation':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            In Consultation
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            {availability}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
              Clinical Staff &amp; Doctors
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              COMING SOON
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Active Roster ({doctors.length})
            </span>
          </div>
          <p className="text-sm text-[#64748B] mt-1">
            Directory of attending medical specialists and clinical departments. Staff onboarding and rotation management scheduled for Phase 2.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate('/appointments/new')}
          leftIcon={<CalendarPlus className="w-4 h-4" />}
        >
          Book Consultation
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by physician name, specialty, or ID..."
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
            <Filter className="w-4 h-4 text-[#94A3B8]" />
            <span>Department:</span>
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#0F172A] font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => {
          const detail = getDoctorDetail(doc.doctorId, doc.name);
          const photoUrl = detail?.avatarUrl || '/images/dr_john_smith.jpg';
          const availability = detail?.availability || 'Available Today';
          const room = detail?.roomNumber || 'Room 301';
          const experience = detail?.experienceYears || 12;
          const dept = detail?.department || `${doc.specialization} Unit`;

          return (
            <div
              key={doc._id}
              className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              {/* Doctor Header Banner with Photograph */}
              <div>
                <div className="p-6 pb-4">
                  <div className="flex items-start gap-4">
                    {/* Realistic High-Resolution Doctor Headshot */}
                    <div className="relative shrink-0">
                      <img
                        src={photoUrl}
                        alt={doc.name}
                        className="w-20 h-20 rounded-2xl object-cover object-top border-2 border-white shadow-sm ring-1 ring-slate-200"
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {doc.doctorId}
                        </span>
                        {getStatusBadge(availability)}
                      </div>

                      <h3 className="text-base font-bold text-[#0F172A] truncate mt-1">
                        {doc.name}
                      </h3>
                      <p className="text-xs font-semibold text-blue-600 truncate">
                        {doc.specialization}
                      </p>
                      <p className="text-[11px] text-[#64748B] truncate mt-0.5">{dept}</p>
                    </div>
                  </div>
                </div>

                {/* Clinical Meta Information */}
                <div className="px-6 py-3 bg-[#F8FAFC] border-y border-[#E2E8F0] grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-bold block">
                      Assigned Room
                    </span>
                    <span className="font-semibold text-[#0F172A] flex items-center gap-1.5 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      {room}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-bold block">
                      Experience
                    </span>
                    <span className="font-semibold text-[#0F172A] flex items-center gap-1.5 mt-0.5">
                      <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      {experience} Years Clinical
                    </span>
                  </div>
                </div>

                {/* Direct Contact Details */}
                <div className="p-6 pt-4 space-y-2 text-xs text-[#64748B]">
                  <div className="flex items-center gap-2.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                    <span className="truncate">{doc.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                    <span>{doc.phone}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 px-6 bg-white border-t border-[#E2E8F0] flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => setSelectedDoctor(detail || null)}
                >
                  View Profile
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => navigate('/appointments/new')}
                  rightIcon={<ArrowRight className="w-3 h-3" />}
                >
                  Schedule
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Doctor Profile Dossier Modal */}
      {selectedDoctor && (
        <Modal
          isOpen={Boolean(selectedDoctor)}
          onClose={() => setSelectedDoctor(null)}
          maxWidth="lg"
          title={`Physician Profile: ${selectedDoctor.name}`}
        >
          <div className="space-y-6">
            {/* Top Doctor Profile Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-[#E2E8F0]">
              <img
                src={selectedDoctor.avatarUrl}
                alt={selectedDoctor.name}
                className="w-24 h-24 rounded-2xl object-cover object-top border-2 border-slate-200 shadow-sm"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-[#0F172A]">{selectedDoctor.name}</h2>
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {selectedDoctor.doctorId}
                  </span>
                </div>
                <p className="text-sm font-semibold text-blue-600">
                  {selectedDoctor.specialization} &bull; {selectedDoctor.department}
                </p>
                <p className="text-xs text-[#64748B] flex items-center gap-3 pt-1">
                  <span>{selectedDoctor.roomNumber}</span>
                  <span>&bull;</span>
                  <span>{selectedDoctor.experienceYears} Years Practice</span>
                  <span>&bull;</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {selectedDoctor.availability}
                  </span>
                </p>
              </div>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
                <span className="font-bold text-[#0F172A] flex items-center gap-1.5 text-sm">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  Credentials &amp; Education
                </span>
                <p className="text-[#64748B]">{selectedDoctor.education}</p>
                <p className="text-[#0F172A] font-medium pt-1">{selectedDoctor.qualifications}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
                <span className="font-bold text-[#0F172A] flex items-center gap-1.5 text-sm">
                  <Award className="w-4 h-4 text-amber-600" />
                  Accreditations &amp; Fellowships
                </span>
                <p className="text-[#64748B]">{selectedDoctor.awards}</p>
                <p className="text-[#0F172A] font-medium pt-1 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-[#64748B]" />
                  Languages: {selectedDoctor.languages.join(', ')}
                </p>
              </div>
            </div>

            {/* Biography */}
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#94A3B8] mb-1.5">
                Clinical Biography &amp; Practice Overview
              </h4>
              <p className="text-xs leading-relaxed text-[#334155] p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                {selectedDoctor.bio}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
              <Button variant="secondary" onClick={() => setSelectedDoctor(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedDoctor(null);
                  navigate('/appointments/new');
                }}
                leftIcon={<CalendarPlus className="w-4 h-4" />}
              >
                Schedule Appointment with {selectedDoctor.name}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
