import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalRecords,
  limit,
  onPageChange,
}) => {
  if (totalRecords === 0) return null;

  const startRecord = (currentPage - 1) * limit + 1;
  const endRecord = Math.min(currentPage * limit, totalRecords);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-[#E2E8F0] bg-white">
      <div className="text-sm text-[#64748B]">
        Showing <span className="font-semibold text-[#1E293B]">{startRecord}</span> to{' '}
        <span className="font-semibold text-[#1E293B]">{endRecord}</span> of{' '}
        <span className="font-semibold text-[#1E293B]">{totalRecords}</span> entries
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex items-center justify-center p-2 rounded-lg text-sm font-medium border border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNum = idx + 1;
          // Render only nearby pages to keep pagination tidy
          if (
            totalPages > 7 &&
            pageNum !== 1 &&
            pageNum !== totalPages &&
            Math.abs(pageNum - currentPage) > 1
          ) {
            if (pageNum === 2 || pageNum === totalPages - 1) {
              return (
                <span key={pageNum} className="px-2 text-xs text-[#94A3B8]">
                  ...
                </span>
              );
            }
            return null;
          }

          const isActive = currentPage === pageNum;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-[#1E293B] hover:bg-[#F1F5F9] border border-transparent'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center justify-center p-2 rounded-lg text-sm font-medium border border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
