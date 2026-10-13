import React, { TextareaHTMLAttributes, forwardRef } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, required, className = '', id, rows = 3, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-[#1E293B]">
            {label} {required && <span className="text-[#DC2626]">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          required={required}
          className={`w-full bg-white text-[#1E293B] placeholder-[#94A3B8] text-sm rounded-lg border transition-all p-3.5 ${
            error
              ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20'
              : 'border-[#E2E8F0] hover:border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20'
          } focus:outline-none disabled:bg-[#F8FAFC] disabled:text-[#94A3B8] disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-xs text-[#DC2626] font-medium mt-0.5">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#64748B] mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
