import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, CalendarPlus, Stethoscope, ArrowUpRight, ShieldCheck, HeartHandshake } from 'lucide-react';

export const QuickActionCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-[#0F172A]">Clinical Quick Operations</h3>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
            Fast Track
          </span>
        </div>
        <p className="text-xs text-[#64748B] mb-5">
          Priority shortcuts for patient intake, scheduling, and staff dispatch
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          <button
            onClick={() => navigate('/patients/new')}
            className="group flex items-center justify-between p-3.5 rounded-xl border border-[#E2E8F0] hover:border-blue-300 hover:bg-blue-50/40 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-colors shadow-sm">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                  Register Patient Intake
                </div>
                <div className="text-xs text-[#64748B]">Create new clinical record</div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#2563EB] transition-colors" />
          </button>

          <button
            onClick={() => navigate('/appointments/new')}
            className="group flex items-center justify-between p-3.5 rounded-xl border border-[#E2E8F0] hover:border-teal-300 hover:bg-teal-50/40 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center shrink-0 group-hover:bg-[#0F766E] group-hover:text-white transition-colors shadow-sm">
                <CalendarPlus className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#0F172A] group-hover:text-[#0F766E] transition-colors">
                  Schedule Consultation
                </div>
                <div className="text-xs text-[#64748B]">Assign attending doctor</div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#0F766E] transition-colors" />
          </button>

          <button
            onClick={() => navigate('/doctors')}
            className="group flex items-center justify-between p-3.5 rounded-xl border border-[#E2E8F0] hover:border-slate-300 hover:bg-slate-50 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#334155] flex items-center justify-center shrink-0 group-hover:bg-[#334155] group-hover:text-white transition-colors shadow-sm">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#0F172A] group-hover:text-blue-700 transition-colors">
                  Doctor Roster &amp; Shifts
                </div>
                <div className="text-xs text-[#64748B]">Review clinical staff availability</div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#94A3B8] group-hover:text-blue-700 transition-colors" />
          </button>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#94A3B8]">
        <span className="flex items-center gap-1 font-medium text-slate-600">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          Audit logging enabled
        </span>
        <span>SLA 99.98%</span>
      </div>
    </div>
  );
};
