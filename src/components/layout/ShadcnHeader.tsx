import React, { useState } from 'react';
import {
  PanelLeft,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronRight,
  ShieldCheck,
  Check,
  SlidersHorizontal,
  LogOut,
  Sparkles,
  Command,
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface ShadcnHeaderProps {
  activeTab: string;
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  onNavigateTab: (tabId: string) => void;
}

export const ShadcnHeader: React.FC<ShadcnHeaderProps> = ({
  activeTab,
  onToggleSidebar,
  onOpenSearch,
  onOpenNotifications,
  unreadCount,
  onNavigateTab,
}) => {
  const { currentTenant } = useTenant();
  const { user, role, setRole } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'overview':
        return 'Overview';
      case 'websites':
        return 'My Websites';
      case 'performance':
        return 'Performance';
      case 'requests':
        return 'Requests';
      case 'leads':
        return 'Leads';
      case 'bookings':
        return 'Bookings';
      case 'store':
        return 'Store & Orders';
      case 'analytics':
        return 'Analytics';
      case 'traffic':
        return 'Traffic';
      case 'seo':
        return 'Search Visibility';
      case 'billing':
        return 'Billing';
      case 'care':
        return 'Website Care';
      case 'support':
        return 'Support';
      case 'settings':
        return 'Settings';
      case 'admin-overview':
      case 'admin-clients':
      case 'admin-requests':
      case 'admin-audit':
        return 'Agency Admin';
      default:
        return 'Overview';
    }
  };

  return (
    <header className="h-13 sm:h-14 border-b border-zinc-800 bg-[#08090d]/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-30">
      {/* Left: Sidebar trigger + Breadcrumb Trail (Kiranism pattern) */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center shrink-0"
          title="Toggle Sidebar"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        {/* Clean Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-zinc-400 min-w-0">
          <span className="hidden sm:inline font-medium text-zinc-400">Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600 hidden sm:inline shrink-0" />
          <span className="truncate max-w-[120px] sm:max-w-[160px] font-medium text-zinc-400">
            {currentTenant.name}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
          <span className="font-semibold text-white tracking-tight truncate">
            {getTabTitle(activeTab)}
          </span>
        </nav>
      </div>

      {/* Right: Search, Role Switcher, Notification, Theme, User */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Command Search Trigger (Kiranism input style) */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#0f1016] border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors text-xs min-h-[34px]"
        >
          <Search className="w-3.5 h-3.5 text-zinc-400" />
          <span className="hidden md:inline text-zinc-400 font-sans">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[10px] font-mono text-zinc-400 bg-zinc-800/80 border border-zinc-700 rounded">
            <span>⌘</span>K
          </kbd>
        </button>

        {/* Role Switcher Pill */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#0f1016] border border-zinc-800 text-[10px] font-mono text-violet-300 hover:border-zinc-700 transition-colors"
          >
            <ShieldCheck className="w-3 h-3 text-violet-400" />
            <span className="uppercase font-semibold">{role}</span>
          </button>

          {roleMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setRoleMenuOpen(false)}
              />
              <div className="absolute right-0 mt-1.5 w-44 rounded-md bg-[#0e0f16] border border-zinc-800 shadow-2xl p-1 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
                <div className="px-2 py-1 text-[10px] font-mono uppercase text-zinc-400 border-b border-zinc-800/80 mb-0.5">
                  Authorization Role
                </div>
                {(['client', 'admin', 'super_admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left font-mono ${
                      role === r
                        ? 'bg-zinc-800 text-white font-semibold'
                        : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-white'
                    }`}
                  >
                    <span className="capitalize">{r.replace('_', ' ')}</span>
                    {role === r && <Check className="w-3 h-3 text-violet-400" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors min-h-[34px] min-w-[34px] flex items-center justify-center"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-500" />
          )}
        </button>

        {/* User Avatar Menu */}
        <div className="relative">
          <button
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            className="flex items-center gap-1.5 p-1 rounded-md hover:bg-zinc-800/60 transition-colors"
          >
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white text-[11px] font-mono font-bold shadow-xs">
              {user.full_name.charAt(0)}
            </div>
          </button>

          {accountMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setAccountMenuOpen(false)}
              />
              <div className="absolute right-0 mt-1.5 w-56 rounded-md bg-[#0e0f16] border border-zinc-800 shadow-2xl p-1.5 z-50 text-xs">
                <div className="px-2 py-1.5 border-b border-zinc-800/80 mb-1">
                  <div className="font-semibold text-white truncate">{user.full_name}</div>
                  <div className="text-[10px] text-zinc-400 font-mono truncate">{user.email}</div>
                </div>
                <button
                  onClick={() => {
                    onNavigateTab('settings');
                    setAccountMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-zinc-300 hover:text-white hover:bg-zinc-800/60 text-left"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                  Settings
                </button>
                <button
                  onClick={() => {
                    onNavigateTab('support');
                    setAccountMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-zinc-300 hover:text-white hover:bg-zinc-800/60 text-left"
                >
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  Support Desk
                </button>
                <div className="pt-1 mt-1 border-t border-zinc-800/80">
                  <button
                    onClick={() => setAccountMenuOpen(false)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20 text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
