import React, { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';
import { DashboardStats, Appointment, AppointmentStatistic } from '../types';
import { StatCard } from '../components/dashboard/StatCard';
import { AppointmentTable } from '../components/dashboard/AppointmentTable';
import { AppointmentChart } from '../components/dashboard/AppointmentChart';
import { QuickActionCard } from '../components/dashboard/QuickActionCard';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { Users, Calendar, Stethoscope, Clock3, Activity, ShieldCheck, Building2, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [chartData, setChartData] = useState<AppointmentStatistic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsData, appointmentsData, chartStats] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getTodayAppointments(),
        dashboardService.getAppointmentStatistics(),
      ]);
      setStats(statsData);
      setTodayAppointments(appointmentsData);
      setChartData(chartStats);
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setError(err.response?.data?.message || 'Unable to load dashboard data from server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (error && !stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
            Clinical Operations Dashboard
          </h1>
          <p className="text-sm text-[#64748B] mt-1">Real-time hospital operations overview.</p>
        </div>
        <ErrorState message={error} onRetry={fetchDashboardData} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Executive Header (No Emojis) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Hospital Administration Overview
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Hospital Telemetry
            </span>
          </div>
          <p className="text-sm text-[#64748B] mt-1 flex flex-wrap items-center gap-2">
            <span>Welcome back, {user?.name || 'Administrator'}</span>
            <span>&bull;</span>
            <span className="text-blue-700 font-medium">Facility ID: MC-METRO-01</span>
            <span>&bull;</span>
            <span>All 5 Clinical Services Active</span>
          </p>
        </div>

        {/* Date & Facility Status Chip */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="text-xs text-[#0F172A] bg-white px-3.5 py-2 rounded-xl border border-[#E2E8F0] shadow-card font-medium flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Statistics KPI Cards */}
      {isLoading ? (
        <CardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Registered Patients"
            value={stats?.totalPatients ?? 0}
            indicator="+12% annual increase"
            isPositive={true}
            icon={Users}
            iconBgColor="bg-blue-50"
            iconColor="text-[#2563EB]"
            secondaryMeta="Active EHR Records"
          />
          <StatCard
            title="Today's Consultations"
            value={stats?.todaysAppointments ?? 0}
            indicator="Scheduled & triage queue"
            isPositive={true}
            icon={Calendar}
            iconBgColor="bg-emerald-50"
            iconColor="text-[#16A34A]"
            secondaryMeta="Average wait 12 min"
          />
          <StatCard
            title="Active Medical Staff"
            value={stats?.totalDoctors ?? 0}
            indicator="100% on-duty coverage"
            isPositive={true}
            icon={Stethoscope}
            iconBgColor="bg-teal-50"
            iconColor="text-[#0F766E]"
            secondaryMeta="Across 5 departments"
          />
          <StatCard
            title="Pending Triage Reviews"
            value={stats?.pendingAppointments ?? 0}
            indicator="Requires staff assignment"
            isPositive={false}
            icon={Clock3}
            iconBgColor="bg-amber-50"
            iconColor="text-[#D97706]"
            secondaryMeta="Action recommended"
          />
        </div>
      )}

      {/* Quick Actions & Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <QuickActionCard />
        </div>
        <div className="lg:col-span-2">
          <AppointmentChart data={chartData} isLoading={isLoading} />
        </div>
      </div>

      {/* Today's Appointments Agenda Table */}
      <div>
        <AppointmentTable appointments={todayAppointments} isLoading={isLoading} />
      </div>
    </div>
  );
};
