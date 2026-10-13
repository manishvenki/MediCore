import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center text-xs text-[#64748B] mb-4" aria-label="Breadcrumb">
      <Link
        to="/dashboard"
        className="flex items-center hover:text-[#2563EB] transition-colors"
      >
        <Home className="w-3.5 h-3.5 mr-1" />
        Dashboard
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3.5 h-3.5 mx-2 text-[#94A3B8]" />
          {item.path ? (
            <Link
              to={item.path}
              className="hover:text-[#2563EB] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-[#1E293B]">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
