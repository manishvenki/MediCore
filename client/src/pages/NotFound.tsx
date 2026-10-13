import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Logo } from '../components/common/Logo';
import { AlertCircle, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-6 text-center">
      <Logo size="md" showTagline={false} className="mb-8" />

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-lg p-10 max-w-md w-full flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>

        <h1 className="text-4xl font-extrabold text-[#0F172A] tracking-tight mb-2">404</h1>
        <h2 className="text-lg font-semibold text-[#1E293B] mb-2">Page not found</h2>
        <p className="text-sm text-[#64748B] mb-8 leading-relaxed">
          The healthcare resource or screen you requested could not be located in MediCore.
        </p>

        <Button
          onClick={() => navigate('/dashboard')}
          leftIcon={<Home className="w-4 h-4" />}
          className="w-full"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};
