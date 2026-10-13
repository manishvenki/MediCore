import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  Settings,
  LogOut,
  X,
  ShieldCheck,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      label: 'Overview',
      path: '/dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: 'Patients',
      path: '/patients',
      icon: Users,
      badge: null,
    },
    {
      label: 'Appointments',
      path: '/appointments',
      icon: Calendar,
      badge: null,
    },
    {
      label: 'Doctors',
      path: '/doctors',
      icon: Stethoscope,
      badge: 'Coming Soon',
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: Settings,
      badge: 'Coming Soon',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-[#E2E8F0] flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Logo */}
        <div>
          <div className="flex items-center justify-between h-16 px-6 border-b border-[#E2E8F0]">
            <Logo size="sm" showTagline={false} />
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-[#64748B] hover:text-[#1E293B] rounded-lg"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#2563EB] text-white shadow-sm'
                        : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#64748B]'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-[#F1F5F9] text-[#64748B]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile and Logout Section */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-3 p-2 rounded-lg mb-2">
            <div className="w-9 h-9 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs shrink-0">
              AD
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-sm font-semibold text-[#1E293B] truncate flex items-center gap-1">
                {user?.name || 'Administrator'}
                <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
              </div>
              <div className="text-xs text-[#64748B] truncate">
                {user?.email || 'admin@medicore.com'}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-[#DC2626] bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
