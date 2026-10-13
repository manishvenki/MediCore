import React from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showTagline = false,
  size = 'md',
  variant = 'dark',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Precision Geometric Brand Emblem */}
      <div
        className={`${iconSizes[size]} shrink-0 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] p-1.5 shadow-sm flex items-center justify-center`}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white"
        >
          {/* Subtle pulse grid background hint */}
          <circle cx="18" cy="18" r="16" stroke="white" strokeOpacity="0.15" strokeWidth="1.5" />
          {/* Stylized M with embedded ECG heartbeat pulse */}
          <path
            d="M7 25V11L13 22L16 15L18.5 20.5L20 18L23 25L29 11V25"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Subtle ECG pulse indicator dot */}
          <circle cx="18.5" cy="20.5" r="1.5" fill="#38BDF8" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className={`font-bold tracking-tight leading-none ${textSizes[size]}`}>
          <span className={variant === 'dark' ? 'text-[#0F172A]' : 'text-white'}>Medi</span>
          <span className="text-[#2563EB]">Core</span>
        </div>
        {showTagline && (
          <span className="text-[11px] font-medium text-[#64748B] tracking-normal mt-0.5">
            Healthcare Management, Simplified.
          </span>
        )}
      </div>
    </div>
  );
};
