import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
  ShieldAlert,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/patients?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left side: Hamburger on mobile + Global Search */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] rounded-lg"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full hidden sm:block">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patients, appointments..."
            className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] hover:bg-white text-[#1E293B] placeholder-[#94A3B8] text-sm rounded-lg border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 focus:outline-none transition-all"
          />
        </form>
      </div>

      {/* Right side: Notifications + Admin profile */}
      <div className="flex items-center gap-3">
        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] rounded-lg transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2563EB]" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#E2E8F0] p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-3">
                <span className="text-sm font-semibold text-[#1E293B]">Notifications</span>
                <span className="text-[11px] font-medium text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full">
                  2 New
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-7 h-7 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1E293B]">New patient intake</p>
                    <p className="text-[#64748B]">John Doe registered for cardiology follow-up.</p>
                    <span className="text-[10px] text-[#94A3B8] mt-1 block">10 mins ago</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-7 h-7 rounded-full bg-amber-50 text-[#F59E0B] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1E293B]">Pending appointment review</p>
                    <p className="text-[#64748B]">Sarah Wilson requested slot at 10:30 AM.</p>
                    <span className="text-[10px] text-[#94A3B8] mt-1 block">45 mins ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Avatar & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-[#F8FAFC] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-xs font-bold ring-2 ring-[#2563EB]/20">
              AD
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-semibold text-[#1E293B] leading-tight">Admin</span>
              <span className="text-[11px] text-[#64748B] leading-tight">Master Operator</span>
            </div>
            <ChevronDown className="w-4 h-4 text-[#64748B]" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-[#E2E8F0] p-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-[#E2E8F0] mb-1">
                <p className="text-xs font-semibold text-[#1E293B]">{user?.name || 'Administrator'}</p>
                <p className="text-[11px] text-[#64748B] truncate">{user?.email || 'admin@medicore.com'}</p>
              </div>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#1E293B] hover:bg-[#F8FAFC] rounded-lg transition-colors"
              >
                <User className="w-4 h-4 text-[#64748B]" />
                Account Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 text-[#DC2626]" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
