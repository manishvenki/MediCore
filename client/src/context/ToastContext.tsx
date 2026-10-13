import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          let bgClass = 'bg-white border-l-4 border-[#16A34A] text-[#1E293B]';
          let icon = <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />;

          if (toast.type === 'error') {
            bgClass = 'bg-white border-l-4 border-[#DC2626] text-[#1E293B]';
            icon = <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0" />;
          } else if (toast.type === 'warning') {
            bgClass = 'bg-white border-l-4 border-[#F59E0B] text-[#1E293B]';
            icon = <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0" />;
          } else if (toast.type === 'info') {
            bgClass = 'bg-white border-l-4 border-[#2563EB] text-[#1E293B]';
            icon = <Info className="w-5 h-5 text-[#2563EB] shrink-0" />;
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-lg border border-[#E2E8F0] transition-all transform animate-in fade-in slide-in-from-right-4 duration-200 ${bgClass}`}
            >
              {icon}
              <div className="flex-1 text-sm font-medium leading-5">{toast.message}</div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-[#64748B] hover:text-[#1E293B] transition-colors p-0.5 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
