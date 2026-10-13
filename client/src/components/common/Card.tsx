import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  footer,
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-[#E2E8F0] shadow-sm transition-all duration-150 overflow-hidden ${className}`}
    >
      {(title || subtitle || action) && (
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-[#1E293B] leading-6">{title}</h3>
            )}
            {subtitle && (
              <p className="text-xs text-[#64748B] mt-0.5 leading-4">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0]">{footer}</div>
      )}
    </div>
  );
};
