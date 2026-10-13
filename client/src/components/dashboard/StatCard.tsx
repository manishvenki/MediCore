import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  indicator: string;
  isPositive?: boolean;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  secondaryMeta?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  indicator,
  isPositive = true,
  icon: Icon,
  iconBgColor = 'bg-blue-50',
  iconColor = 'text-[#2563EB]',
  secondaryMeta,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
            {title}
          </span>
          <div className="text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            {value}
          </div>
        </div>
        <div
          className={`w-11 h-11 rounded-xl ${iconBgColor} ${iconColor} flex items-center justify-center shrink-0 border border-slate-100 shadow-sm`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span
          className={`font-semibold ${
            isPositive ? 'text-emerald-700' : 'text-amber-700'
          } flex items-center gap-1.5`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isPositive ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
          {indicator}
        </span>
        {secondaryMeta && <span className="text-[#94A3B8] text-[11px] font-medium">{secondaryMeta}</span>}
      </div>
    </div>
  );
};
