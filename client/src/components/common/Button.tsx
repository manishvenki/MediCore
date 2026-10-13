import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#2563EB] text-white hover:bg-[#1D4ED8] focus:ring-[#2563EB] shadow-sm active:bg-[#1E40AF]',
    secondary:
      'bg-white text-[#1E293B] border border-[#E2E8F0] hover:bg-[#F8FAFC] focus:ring-[#64748B] shadow-sm',
    danger:
      'bg-[#DC2626] text-white hover:bg-[#B91C1C] focus:ring-[#DC2626] shadow-sm',
    ghost:
      'bg-transparent text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] focus:ring-[#64748B]',
    outline:
      'bg-transparent border border-[#2563EB] text-[#2563EB] hover:bg-[#EFF6FF] focus:ring-[#2563EB]',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
