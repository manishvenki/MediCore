import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'teal';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
}) => {
  const variantStyles = {
    success: 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]',
    warning: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
    danger: 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]',
    info: 'bg-[#DBEAFE] text-[#1E40AF] border-[#BFDBFE]',
    teal: 'bg-[#CCFBF1] text-[#115E59] border-[#99F6E4]',
    neutral: 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantStyles[variant]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {children}
    </span>
  );
};
