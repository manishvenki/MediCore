import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useToast } from '../hooks/useToast';
import {
  Settings,
  Shield,
  Bell,
  Database,
  Lock,
  Building,
  Layers,
  CheckCircle,
  FileText,
  Key,
  Server,
  Globe,
  Radio,
  Sliders,
  RefreshCw,
  Save,
} from 'lucide-react';

export const SettingsComingSoon: React.FC = () => {
  const { showToast } = useToast();

  // Interactive demo configuration switches
  const [config, setConfig] = useState({
    smsReminders: true,
    emailConfirmations: true,
    twoFactorEnforced: true,
    hipaaAuditLogging: true,
    fhirEndpointEnabled: false,
    autoSlotOverbookingProtection: true,
  });

  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'integrations'>('general');

  const handleToggle = (key: keyof typeof config) => {
    setConfig((prev) => {
      const nextVal = !prev[key];
      const updated = { ...prev, [key]: nextVal };
      showToast(`Configuration updated: ${key} is now ${nextVal ? 'ENABLED' : 'DISABLED'}`, 'info');
      return updated;
    });
  };

  const handleSaveFacility = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Facility governance settings updated successfully.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">System Settings & Governance</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              COMING SOON
            </span>
          </div>
          <p className="text-sm text-[#64748B] mt-1">
            Hospital organizational profile, HIPAA compliance controls, and clinical telemetry integrations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => showToast('Configuration sync verified with cluster.', 'success')}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Sync Config
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => showToast('Governance policies saved.', 'success')}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Hospital Telemetry Overview Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#64748B]">Hospital Facility</p>
              <p className="font-semibold text-[#0F172A] text-sm mt-0.5">MediCore Central Hospital</p>
              <span className="text-[10px] text-[#64748B] font-mono">ID: MC-FACILITY-001</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#64748B]">Compliance Standard</p>
              <p className="font-semibold text-[#0F172A] text-sm mt-0.5">HIPAA Security Rule</p>
              <span className="text-[10px] text-emerald-600 font-medium">AES-256 Bit Encrypted</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#64748B]">Database Cluster</p>
              <p className="font-semibold text-[#0F172A] text-sm mt-0.5">MongoDB Connected</p>
              <span className="text-[10px] text-[#64748B] font-mono">Port 27017 / medicore</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#64748B]">Access Protocol</p>
              <p className="font-semibold text-[#0F172A] text-sm mt-0.5">RBAC Tier 1 (Admin)</p>
              <span className="text-[10px] text-[#64748B]">JWT Session Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'general'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
          }`}
        >
          General Facility Settings
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'security'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
          }`}
        >
          Security & HIPAA Policies
        </button>

        <button
          onClick={() => setActiveTab('integrations')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'integrations'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
          }`}
        >
          FHIR & Interoperability
        </button>
      </div>

      {/* Tab 1: General Facility */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card
              title="Hospital Profile & Licensing"
              subtitle="Institutional branding, address, and primary contact hotline"
            >
              <form onSubmit={handleSaveFacility} className="space-y-4 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#475569] mb-1">
                      Hospital Legal Name
                    </label>
                    <input
                      type="text"
                      defaultValue="MediCore Central Hospital"
                      className="w-full px-3.5 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#475569] mb-1">
                      Facility Accreditation ID
                    </label>
                    <input
                      type="text"
                      defaultValue="JCAHO-8849201"
                      className="w-full px-3.5 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#475569] mb-1">
                      Emergency Department Contact
                    </label>
                    <input
                      type="text"
                      defaultValue="+1 (800) 555-0911"
                      className="w-full px-3.5 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#475569] mb-1">
                      Practice Management Timezone
                    </label>
                    <select
                      defaultValue="America/New_York"
                      className="w-full px-3.5 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                    >
                      <option value="America/New_York">Eastern Time (US & Canada)</option>
                      <option value="America/Chicago">Central Time (US & Canada)</option>
                      <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                      <option value="Asia/Kolkata">India Standard Time (IST)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" variant="primary" size="sm">
                    Save Profile
                  </Button>
                </div>
              </form>
            </Card>

            {/* Operational Preferences */}
            <Card
              title="Automated Patient Notification Rules"
              subtitle="Appointment reminders and intake confirmation triggers"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">Automated SMS Reminders</p>
                    <p className="text-xs text-[#64748B]">
                      Dispatch SMS alerts to patients 24 hours prior to scheduled consultation.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('smsReminders')}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      config.smsReminders ? 'bg-[#2563EB]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        config.smsReminders ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">Email Intake Confirmations</p>
                    <p className="text-xs text-[#64748B]">
                      Send encrypted electronic intake summaries to patient email addresses.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('emailConfirmations')}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      config.emailConfirmations ? 'bg-[#2563EB]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        config.emailConfirmations ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">Overbooking Protection</p>
                    <p className="text-xs text-[#64748B]">
                      Block double-scheduling for identical time slots and attending physicians.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('autoSlotOverbookingProtection')}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      config.autoSlotOverbookingProtection ? 'bg-[#2563EB]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        config.autoSlotOverbookingProtection ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Organization summary */}
          <div className="space-y-6">
            <Card title="Active Clinical Departments" subtitle="5 Operational Units">
              <div className="space-y-3 text-xs">
                {[
                  { name: 'Cardiology', staff: '2 Attending Physicians', beds: '24 Beds' },
                  { name: 'Pediatrics', staff: '1 Specialist', beds: '18 Beds' },
                  { name: 'Neurology', staff: '1 Specialist', beds: '12 Beds' },
                  { name: 'Orthopedics', staff: '1 Attending Surgeon', beds: '16 Beds' },
                  { name: 'General Medicine', staff: '3 Primary Care Doctors', beds: '30 Beds' },
                ].map((dept, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-[#0F172A] block">{dept.name}</span>
                      <span className="text-[#64748B] text-[11px]">{dept.staff}</span>
                    </div>
                    <span className="font-mono text-[11px] text-[#475569] bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                      {dept.beds}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Security & HIPAA */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card
            title="HIPAA Audit & Data Integrity"
            subtitle="Access logging and data encryption compliance"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">Enforce Audit Logging</p>
                  <p className="text-xs text-[#64748B]">
                    Record all patient record read/write operations to immutable compliance audit ledger.
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('hipaaAuditLogging')}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    config.hipaaAuditLogging ? 'bg-[#2563EB]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      config.hipaaAuditLogging ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">Two-Factor Authentication (2FA)</p>
                  <p className="text-xs text-[#64748B]">
                    Require secondary authentication code for all clinical staff logins.
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('twoFactorEnforced')}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    config.twoFactorEnforced ? 'bg-[#2563EB]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      config.twoFactorEnforced ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                <span className="font-bold block mb-1">Security Certification Status</span>
                System audit verified. Last pen-test audit passed with zero high-severity findings. Encryption at rest utilizes AES-256 standard.
              </div>
            </div>
          </Card>

          <Card
            title="Active Administrator Session"
            subtitle="Current authenticated token & security footprint"
          >
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex justify-between">
                <span className="text-[#64748B]">Current User</span>
                <span className="font-semibold text-[#0F172A]">admin@medicore.com</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex justify-between">
                <span className="text-[#64748B]">Authorization Role</span>
                <span className="font-semibold text-[#0F172A]">Hospital System Administrator</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex justify-between">
                <span className="text-[#64748B]">Token Expiry</span>
                <span className="font-mono text-[#0F172A]">7 Days (Rolling Refresh)</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex justify-between">
                <span className="text-[#64748B]">Transport Protocol</span>
                <span className="font-semibold text-emerald-600">TLS 1.3 / HTTPS</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Integrations & FHIR */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <Card
            title="Electronic Health Record (EHR) Interoperability"
            subtitle="HL7, FHIR v4.0, and external diagnostic data bridges"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-[#0F172A]">HL7 FHIR v4.0</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      REST API
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Standardized JSON resource schema for Patient, Encounter, and Observation endpoints.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#64748B]">/api/fhir/v4</span>
                  <span className="text-xs font-semibold text-emerald-600">Active</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-[#0F172A]">PACS Radiology Sync</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      PHASE 2
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    DICOM imaging bridge for MRI, CT scan, and X-ray radiograph streaming.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#64748B]">DICOMweb</span>
                  <span className="text-xs font-semibold text-amber-600">Roadmap</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-[#0F172A]">Insurance Clearinghouse</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      PHASE 2
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Automated EDI 837 health claim filing and EDI 835 remittance status.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#64748B]">ANSI X12</span>
                  <span className="text-xs font-semibold text-amber-600">Roadmap</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
