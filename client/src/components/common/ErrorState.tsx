import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error loading this data. Please try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-red-200 my-4">
      <div className="w-14 h-14 rounded-full bg-red-50 text-[#DC2626] flex items-center justify-center mb-4">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-[#1E293B] mb-1">{title}</h3>
      <p className="text-sm text-[#64748B] max-w-sm mb-6">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} leftIcon={<RotateCcw className="w-4 h-4" />}>
          Retry
        </Button>
      )}
    </div>
  );
};
