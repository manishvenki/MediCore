import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="absolute left-3.5 text-[#64748B] pointer-events-none">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2 bg-white text-[#1E293B] placeholder-[#94A3B8] text-sm rounded-lg border border-[#E2E8F0] hover:border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:outline-none transition-all shadow-sm"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 text-[#94A3B8] hover:text-[#1E293B] p-0.5 rounded transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
