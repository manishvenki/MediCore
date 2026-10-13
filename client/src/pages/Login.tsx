import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Building2,
  CheckCircle2,
  HeartPulse,
  LockKeyhole,
  Info,
} from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errs.email = 'Work email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid clinical email address.';
    }
    if (!password) {
      errs.password = 'Security password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await login({ email, password });
      showToast('Authenticated successfully. Welcome to MediCore Clinical Operations.', 'success');
      navigate(from, { replace: true });
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Authentication failed. Please verify credentials.';
      setErrors({ general: message });
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC]">
      {/* Left Panel: Realistic Professional Healthcare Hero with Natural Photo */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0F172A] overflow-hidden select-none">
        {/* Real High-Resolution Hospital Architecture & Doctor Image */}
        <img
          src="/images/login_hero.jpg"
          alt="MediCore Clinical Facility Corridor"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-45 mix-blend-luminosity scale-105"
        />

        {/* Soft Matte Gradient Overlay for Maximum Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/75 to-[#0F172A]/40" />

        {/* Content Container */}
        <div className="relative z-10 w-full flex flex-col justify-between p-12 lg:p-16 text-white">
          {/* Top Clinical Accreditation Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center backdrop-blur-md">
                <HeartPulse className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-blue-300 block">
                  MediCore Clinical OS
                </span>
                <span className="text-xs text-slate-400">Hospital Administration & Triage</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-medium text-emerald-300 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Clinical Network Active
            </div>
          </div>

          {/* Center Quote & Operational Impact */}
          <div className="max-w-lg space-y-6 my-auto py-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-md bg-white/10 text-slate-200 border border-white/15 backdrop-blur-sm">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              Enterprise Health Architecture
            </div>

            <h2 className="text-3xl xl:text-4xl font-bold tracking-tight text-white leading-tight">
              Unified intelligence for modern medical centers and hospital networks.
            </h2>

            <blockquote className="border-l-2 border-blue-500 pl-4 py-1 text-slate-300 text-sm leading-relaxed">
              &ldquo;MediCore eliminates coordination friction between reception, attending
              physicians, and acute triage, delivering verified visibility across every patient
              encounter.&rdquo;
            </blockquote>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700/60">
              <div>
                <div className="text-2xl font-bold text-white tracking-tight">99.98%</div>
                <div className="text-xs text-slate-400 font-medium">System Uptime SLA</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white tracking-tight">140+</div>
                <div className="text-xs text-slate-400 font-medium">Hospital Facilities</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white tracking-tight">4.2M</div>
                <div className="text-xs text-slate-400 font-medium">Encounters Managed</div>
              </div>
            </div>
          </div>

          {/* Bottom Security Compliance Strip */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                HIPAA Security Verified
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                HL7 / FHIR Interoperable
              </span>
            </div>
            <span className="text-slate-500">ISO 27001 Certified</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Clean, High-Contrast Enterprise Login Console */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-16 overflow-y-auto">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Logo size="md" showTagline={false} />
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-lg shadow-sm">
            <LockKeyhole className="w-3.5 h-3.5 text-blue-600" />
            <span>256-Bit TLS Secured Portal</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto my-auto space-y-7">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
              Clinical Access Gateway
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Sign in to your account
            </h1>
            <p className="text-sm text-[#64748B] mt-1.5">
              Enter authorized hospital staff credentials to access records.
            </p>
          </div>

          {errors.general && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-[#DC2626] flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Staff Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@medicore.com"
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
              required
              autoComplete="email"
            />

            <Input
              label="Security Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 rounded-md text-[#64748B] hover:text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-[#64748B]" />
                  ) : (
                    <Eye className="w-4 h-4 text-[#64748B]" />
                  )}
                </button>
              }
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-[#1E293B] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]"
                />
                <span>Remember session</span>
              </label>
              <button
                type="button"
                onClick={() =>
                  showToast(
                    'Administrative password resets are managed through Department IT security.',
                    'info'
                  )
                }
                className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2 font-semibold shadow-sm"
            >
              Sign In to MediCore
            </Button>
          </form>
        </div>

        {/* Footer Help & Support */}
        <div className="pt-8 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            <span>Hospital Operations Helpdesk: ext. 4400</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#0F172A] cursor-pointer">System Status</span>
            <span>&bull;</span>
            <span className="hover:text-[#0F172A] cursor-pointer">Security Protocol</span>
          </div>
        </div>
      </div>
    </div>
  );
};
