import React from 'react';

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-sm animate-pulse flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-slate-200 rounded"></div>
            <div className="w-10 h-10 rounded-lg bg-slate-200"></div>
          </div>
          <div className="h-8 w-16 bg-slate-200 rounded mt-1"></div>
          <div className="h-3 w-32 bg-slate-100 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 5,
}) => {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm animate-pulse">
      <div className="p-4 border-b border-[#E2E8F0] bg-slate-50 flex items-center justify-between">
        <div className="h-5 w-32 bg-slate-200 rounded"></div>
        <div className="h-8 w-48 bg-slate-200 rounded"></div>
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-4 flex items-center justify-between gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={c}
                className="h-4 bg-slate-200 rounded"
                style={{ width: `${Math.max(12, Math.floor(80 / cols))}%` }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const DetailsSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm animate-pulse space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-200"></div>
        <div className="space-y-2">
          <div className="h-6 w-48 bg-slate-200 rounded"></div>
          <div className="h-4 w-32 bg-slate-100 rounded"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 bg-slate-100 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
};
