import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { patientService } from '../services/patientService';
import { Patient } from '../types';
import { Button } from '../components/common/Button';
import { SearchInput } from '../components/common/SearchInput';
import { Pagination } from '../components/common/Pagination';
import { TableSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../hooks/useToast';
import { useDebounce } from '../hooks/useDebounce';
import { formatDateReadable, calculateAge } from '../utils/formatters';
import {
  UserPlus,
  Users,
  Eye,
  Edit2,
  Trash2,
  Filter,
  User,
  Phone,
  Calendar,
  RotateCcw,
} from 'lucide-react';

export const Patients: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const urlSearch = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const debouncedSearch = useDebounce(searchTerm, 350);

  const [genderFilter, setGenderFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit] = useState<number>(10);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Deletion modal state
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await patientService.getPatients({
        page: currentPage,
        limit,
        search: debouncedSearch,
        gender: genderFilter || undefined,
      });
      setPatients(res.data);
      setTotalPages(res.totalPages);
      setTotalRecords(res.total);
    } catch (err: any) {
      console.error('Failed to fetch patients:', err);
      setError(err.response?.data?.message || 'Unable to load patients directory.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, debouncedSearch, genderFilter]);

  // Sync search param with URL
  useEffect(() => {
    if (debouncedSearch) {
      setSearchParams({ search: debouncedSearch });
    } else {
      setSearchParams({});
    }
    setCurrentPage(1);
  }, [debouncedSearch, setSearchParams]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleDeleteConfirm = async () => {
    if (!patientToDelete) return;
    setIsDeleting(true);
    try {
      await patientService.deletePatient(patientToDelete._id);
      showToast(`Patient ${patientToDelete.fullName} record deleted successfully.`, 'success');
      setPatientToDelete(null);
      fetchPatients();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete patient record.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setGenderFilter('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Patient Records &amp; Directory
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {totalRecords} Total Patients
            </span>
          </div>
          <p className="text-sm text-[#64748B] mt-1">
            Central registry of patient demographic records, medical identifiers, and clinical baseline histories.
          </p>
        </div>
        <Button
          onClick={() => navigate('/patients/new')}
          leftIcon={<UserPlus className="w-4 h-4" />}
          className="self-start sm:self-auto font-semibold shadow-sm"
        >
          Register New Patient
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by legal name, phone, or Patient ID..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
            <Filter className="w-4 h-4 text-[#94A3B8]" />
            <span>Gender:</span>
          </div>
          <select
            value={genderFilter}
            onChange={(e) => {
              setGenderFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#0F172A] font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          {(searchTerm || genderFilter) && (
            <button
              onClick={resetFilters}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 transition-colors px-2 py-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Patients Table Container */}
      {isLoading ? (
        <TableSkeleton rows={8} cols={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchPatients} />
      ) : patients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No patients found"
          description={
            debouncedSearch || genderFilter
              ? 'No patient records match the applied criteria. Try adjusting your search term.'
              : 'Begin by registering a new patient intake record into the MediCore healthcare management directory.'
          }
          actionText={debouncedSearch || genderFilter ? undefined : 'Register Patient'}
          onAction={() => navigate('/patients/new')}
          actionIcon={<UserPlus className="w-4 h-4" />}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs font-bold text-[#64748B] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Patient ID</th>
                  <th className="py-3.5 px-6">Full Legal Name</th>
                  <th className="py-3.5 px-6">Phone Number</th>
                  <th className="py-3.5 px-6">Age / DOB</th>
                  <th className="py-3.5 px-6">Gender</th>
                  <th className="py-3.5 px-6">Registration Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {patients.map((patient) => (
                  <tr
                    key={patient._id}
                    className="hover:bg-[#F8FAFC]/80 transition-colors group"
                  >
                    <td className="py-4 px-6 font-mono text-xs font-bold text-blue-700 whitespace-nowrap">
                      <span className="bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md">
                        {patient.patientId}
                      </span>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-[#0F172A] flex items-center justify-center text-xs font-bold shrink-0">
                          {patient.fullName.charAt(0)}
                        </div>
                        <div>
                          <button
                            onClick={() => navigate(`/patients/${patient._id}`)}
                            className="font-bold text-[#0F172A] hover:text-[#2563EB] transition-colors text-left"
                          >
                            {patient.fullName}
                          </button>
                          <div className="text-[11px] text-[#64748B]">
                            {patient.email || 'No email recorded'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap text-[#334155] font-medium text-xs">
                      {patient.phone}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="text-xs font-semibold text-[#0F172A]">
                        {patient.age ?? calculateAge(patient.dateOfBirth)} yrs
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        {formatDateReadable(patient.dateOfBirth)}
                      </div>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-[#334155] font-semibold border border-slate-200">
                        {patient.gender}
                      </span>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap text-xs text-[#64748B]">
                      {formatDateReadable(patient.createdAt)}
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/patients/${patient._id}`)}
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                          className="text-[#64748B] hover:text-[#2563EB]"
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/patients/${patient._id}/edit`)}
                          leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                          className="text-[#64748B] hover:text-[#0F766E]"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPatientToDelete(patient)}
                          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                          className="text-[#DC2626] hover:bg-red-50 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
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

      {/* Confirmation Modal for Patient Deletion */}
      <ConfirmDialog
        isOpen={!!patientToDelete}
        onClose={() => setPatientToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Patient Record"
        message={`Are you sure you want to delete patient "${patientToDelete?.fullName}" (${patientToDelete?.patientId})? This action will permanently remove the patient profile and purge any associated consultations.`}
        confirmText="Delete Patient"
        confirmVariant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
