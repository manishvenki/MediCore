import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { patientService, PatientFormData } from '../services/patientService';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Textarea } from '../components/common/Textarea';
import { Button } from '../components/common/Button';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Card } from '../components/common/Card';
import { useToast } from '../hooks/useToast';
import { formatDateInput } from '../utils/formatters';
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  HeartHandshake,
  FileText,
  ArrowLeft,
  Save,
  ShieldCheck,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

export const PatientForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<PatientFormData>({
    fullName: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    emergencyContact: '',
    medicalNotes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isEditMode && id) {
      const loadPatient = async () => {
        try {
          const patient = await patientService.getPatientById(id);
          setFormData({
            fullName: patient.fullName,
            phone: patient.phone,
            email: patient.email || '',
            dateOfBirth: formatDateInput(patient.dateOfBirth),
            gender: patient.gender,
            address: patient.address || '',
            emergencyContact: patient.emergencyContact || '',
            medicalNotes: patient.medicalNotes || '',
          });
        } catch (err: any) {
          showToast('Failed to load patient information.', 'error');
          navigate('/patients');
        } finally {
          setIsLoading(false);
        }
      };
      loadPatient();
    }
  }, [id, isEditMode, navigate, showToast]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Full Name is required.';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (formData.phone.trim().length < 7) {
      errs.phone = 'Please enter a valid phone number.';
    }

    if (!formData.dateOfBirth) {
      errs.dateOfBirth = 'Date of birth is required.';
    } else {
      const dob = new Date(formData.dateOfBirth);
      const now = new Date();
      if (dob > now) {
        errs.dateOfBirth = 'Date of birth cannot be in the future.';
      }
    }

    if (!formData.gender) {
      errs.gender = 'Gender selection is required.';
    }

    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errs.email = 'Please provide a valid email address.';
      }
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
        await patientService.updatePatient(id, formData);
        showToast('Patient record updated successfully.', 'success');
        navigate(`/patients/${id}`);
      } else {
        const created = await patientService.createPatient(formData);
        showToast('Patient registered successfully.', 'success');
        navigate(`/patients/${created._id}`);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to save patient information.';
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppendNote = (preset: string) => {
    setFormData((prev) => ({
      ...prev,
      medicalNotes: prev.medicalNotes
        ? `${prev.medicalNotes.trim()}, ${preset}`
        : preset,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16">
        <div className="w-8 h-8 border-3 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin" />
        <span className="text-xs text-[#64748B] mt-3">Loading patient record...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: 'Patients', path: '/patients' },
          { label: isEditMode ? 'Edit Patient Record' : 'Patient Registration' },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
              {isEditMode ? 'Update Patient Dossier' : 'New Patient Intake'}
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100">
              {isEditMode ? 'EHR Revision' : 'Ingestion Form'}
            </span>
          </div>
          <p className="text-sm text-[#64748B] mt-1">
            {isEditMode
              ? 'Modify identifying information, verified contact details, or clinical observations.'
              : 'Complete institutional clinical intake. A unique Medical Record Number (MRN) is assigned on submission.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="secondary"
            onClick={() => navigate(isEditMode ? `/patients/${id}` : '/patients')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {isEditMode ? 'Save Changes' : 'Register Patient'}
          </Button>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details */}
        <Card
          title="Demographic & Legal Identity"
          subtitle="Full legal name, birth records, and gender classification"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Full Legal Name"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Eleanor Vance"
              error={errors.fullName}
              leftIcon={<User className="w-4 h-4" />}
            />

            <Select
              label="Gender Classification"
              required
              value={formData.gender}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  gender: e.target.value as 'Male' | 'Female' | 'Other',
                })
              }
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other / Non-Binary' },
              ]}
              error={errors.gender}
            />

            <Input
              label="Date of Birth"
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              error={errors.dateOfBirth}
              leftIcon={<Calendar className="w-4 h-4" />}
            />

            <Input
              label="Primary Phone Number"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. +1 (555) 234-5678"
              error={errors.phone}
              leftIcon={<Phone className="w-4 h-4" />}
            />
          </div>
        </Card>

        {/* Contact & Emergency Details */}
        <Card
          title="Electronic Contact & Residence"
          subtitle="Direct communication channels and emergency caregiver records"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Email Address (Optional)"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="patient.name@example.com"
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Emergency Contact & Next of Kin"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              placeholder="e.g. Thomas Vance (+1 555-987-6543 - Spouse)"
              leftIcon={<HeartHandshake className="w-4 h-4" />}
            />

            <div className="md:col-span-2">
              <Input
                label="Residential Street Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="452 Elm Street, Suite 400, Chicago, IL 60611"
                leftIcon={<MapPin className="w-4 h-4" />}
              />
            </div>
          </div>
        </Card>

        {/* Clinical Notes & Allergies */}
        <Card
          title="Clinical History & Allergies"
          subtitle="Pre-existing medical conditions, drug sensitivities, and physician alerts"
        >
          <div className="space-y-3">
            <Textarea
              label="Medical Notes & Allergy Precautions"
              value={formData.medicalNotes}
              onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
              placeholder="Document drug sensitivities (e.g. Penicillin, Latex), chronic illnesses (e.g. Type 2 Diabetes, Hypertension), or recent surgical procedures..."
              rows={4}
            />

            {/* Quick Presets */}
            <div>
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block mb-1.5">
                Quick Clinical Tags
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Penicillin Allergy',
                  'Latex Allergy',
                  'Type 2 Diabetes',
                  'Hypertension',
                  'Asthma',
                  'No Known Drug Allergies (NKDA)',
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAppendNote(tag)}
                    className="text-xs px-2.5 py-1 rounded-md bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] border border-[#CBD5E1] transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Institutional Compliance Notice */}
        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted with AES-256 and stored in compliance with HIPAA privacy standards.</span>
          </div>
          <span className="font-mono text-[11px] text-[#94A3B8]">Audit Logged</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(isEditMode ? `/patients/${id}` : '/patients')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {isEditMode ? 'Save Changes' : 'Register Patient'}
          </Button>
        </div>
      </form>
    </div>
  );
};
