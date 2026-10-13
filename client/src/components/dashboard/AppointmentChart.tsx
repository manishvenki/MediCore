import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { AppointmentStatistic } from '../../types';
import { Activity } from 'lucide-react';

interface AppointmentChartProps {
  data: AppointmentStatistic[];
  isLoading?: boolean;
}

export const AppointmentChart: React.FC<AppointmentChartProps> = ({ data }) => {
  const formattedData = data.map((d) => ({
    ...d,
    shortDay: d.day.slice(0, 3),
  }));

  const totalThisWeek = data.reduce((acc, curr) => acc + curr.appointments, 0);
  const completedThisWeek = data.reduce((acc, curr) => acc + curr.completed, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3.5 rounded-xl shadow-dropdown border border-[#E2E8F0] text-xs space-y-1.5 min-w-[150px]">
          <p className="font-bold text-[#0F172A] border-b border-slate-100 pb-1">{label}</p>
          <div className="flex items-center justify-between gap-4 text-blue-700">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-[#2563EB]" />
              Scheduled:
            </span>
            <span className="font-bold">{payload[0].value}</span>
          </div>
          {payload[1] && (
            <div className="flex items-center justify-between gap-4 text-emerald-700">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-[#16A34A]" />
                Completed:
              </span>
              <span className="font-bold">{payload[1].value}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#0F172A]">Weekly Consultation Volume</h3>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-[#475569]">
              Mon - Sun
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Aggregated scheduled appointments vs. finished patient discharges
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5 text-[#0F172A]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#2563EB]" />
            <span>Scheduled ({totalThisWeek})</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#16A34A]" />
            <span>Completed ({completedThisWeek})</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="shortDay"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="appointments" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="completed" fill="#16A34A" radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B]">
        <span className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-blue-600" />
          Average weekly capacity utilization: 76.4%
        </span>
        <span className="font-semibold text-emerald-700">All shifts staffed</span>
      </div>
    </div>
  );
};
