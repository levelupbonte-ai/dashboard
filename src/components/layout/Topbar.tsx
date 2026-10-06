import React, { useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Building2,
  Globe,
  ShieldCheck,
  User,
  SlidersHorizontal,
  LogOut,
  Sparkles,
  Menu,
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface TopbarProps {
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  onNavigateTab: (tabId: string) => void;
  onToggleMobileDrawer?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenSearch,
  onOpenNotifications,
  unreadCount,
  onNavigateTab,
  onToggleMobileDrawer,
}) => {
  const { currentTenant, tenants, switchTenant, websites, activeWebsite, setActiveWebsite } =
    useTenant();
  const { user, role, setRole, isAdmin } = useAuth();
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  return (
    <header className="h-13 sm:h-14 border-b border-zinc-800 bg-[#08090d]/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-30">
      {/* Left zone: Brand indicator + Workspace Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile menu trigger */}
        {onToggleMobileDrawer && (
          <button
            onClick={onToggleMobileDrawer}
            className="lg:hidden p-2 -ml-1 text-zinc-400 hover:text-white rounded-md min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Workspace Dropdown (Vercel project switcher style) */}
        <div className="relative">
          <button
            onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
            className="flex items-center gap-2 px-2 sm:px-2.5 py-1.5 rounded-md hover:bg-zinc-800/60 transition-colors text-left border border-zinc-800 bg-[#0f1015] min-h-[36px]"
            aria-label="Switch workspace"
          >
            <div className="w-5 h-5 rounded bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-300 font-mono font-bold text-[11px] shrink-0">
              {currentTenant.name.charAt(0)}
            </div>
            <div className="min-w-0 pr-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-white truncate max-w-[110px] sm:max-w-[160px]">
                  {currentTenant.name}
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-1 py-0.2 bg-zinc-900 text-zinc-400 border border-zinc-800 rounded">
                  {currentTenant.care_plan}
                </span>
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-zinc-400 shrink-0" />
          </button>

          {/* Tenant Switcher Dropdown */}
          {workspaceDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setWorkspaceDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-1.5 w-72 rounded-lg bg-[#0c0d12] border border-zinc-800 shadow-2xl p-1.5 z-50 animate-in fade-in duration-100">
                <div className="px-2.5 py-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center justify-between border-b border-zinc-800/80 mb-1">
                  <span>Workspaces</span>
                  <span className="text-violet-400">RLS ISOLATED</span>
                </div>
                <div className="space-y-0.5">
                  {tenants.map((tenant) => (
                    <button
                      key={tenant.id}
                      onClick={() => {
                        switchTenant(tenant.id);
                        setWorkspaceDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-md text-left text-xs transition-colors ${
                        tenant.id === currentTenant.id
                          ? 'bg-violet-950/40 text-violet-200 border border-violet-800/50 font-medium'
                          : 'hover:bg-zinc-800/50 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Building2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="truncate">{tenant.name}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 uppercase font-mono">
                        {tenant.care_plan}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Multi-website selector if tenant has multiple sites */}
        {websites.length > 1 && (
          <div className="hidden md:flex items-center gap-1.5 pl-2.5 border-l border-zinc-800 text-xs text-zinc-400">
            <Globe className="w-3 h-3 text-zinc-400 shrink-0" />
            <select
              value={activeWebsite?.id || ''}
              onChange={(e) => {
                const site = websites.find((s) => s.id === e.target.value);
                if (site) setActiveWebsite(site);
              }}
              className="bg-transparent text-xs text-zinc-300 font-mono font-medium focus:outline-none cursor-pointer pr-3 max-w-[180px] truncate"
            >
              {websites.map((site) => (
                <option key={site.id} value={site.id} className="bg-[#0c0d12] text-zinc-200">
                  {site.domain}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right zone: Search, Notifications, Role Switcher, Account */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Search trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#0f1015] border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors text-xs min-h-[36px]"
          aria-label="Search workspace"
        >
          <Search className="w-3.5 h-3.5 text-zinc-400" />
          <span className="hidden md:inline text-zinc-400 font-sans">Search...</span>
          <kbd className="hidden sm:inline-block px-1 py-0.2 text-[10px] font-mono text-zinc-400 bg-zinc-800/80 border border-zinc-700 rounded">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-500" />
          )}
        </button>

        {/* Role Switcher (Compact, clean Cloudflare technical switch) */}
        <div className="hidden lg:flex items-center gap-1 pl-2 border-l border-zinc-800">
          <span className="text-[10px] text-zinc-400 font-mono">Role:</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="text-[10px] font-mono font-medium px-2 py-1 rounded bg-[#0f1015] text-violet-300 border border-violet-800/40 focus:outline-none cursor-pointer"
            title="Switch authorization role"
          >
            <option value="client" className="bg-[#0c0d12] text-zinc-200">Client</option>
            <option value="admin" className="bg-[#0c0d12] text-zinc-200">Admin</option>
            <option value="super_admin" className="bg-[#0c0d12] text-zinc-200">SuperAdmin</option>
          </select>
        </div>

        {/* User Avatar & Menu */}
        <div className="relative">
          <button
            onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
            className="flex items-center gap-1.5 p-1 rounded-md hover:bg-zinc-800/60 transition-colors min-h-[36px]"
            aria-label="Account menu"
          >
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white text-[11px] font-mono font-bold shadow-xs">
              {user.full_name.charAt(0)}
            </div>
            <ChevronDown className="w-3 h-3 text-zinc-400 hidden sm:block" />
          </button>

          {accountDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setAccountDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-1.5 w-60 rounded-lg bg-[#0c0d12] border border-zinc-800 shadow-2xl p-2 z-50">
                <div className="px-2.5 py-2 border-b border-zinc-800/80">
                  <div className="text-xs font-semibold text-white truncate">{user.full_name}</div>
                  <div className="text-[11px] text-zinc-400 truncate mt-0.5 font-mono">{user.email}</div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-violet-400 font-mono">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Role: {role.toUpperCase()}</span>
                  </div>
                </div>

                <div className="py-1">
                  {/* Mobile Role Switch inside account menu */}
                  <div className="lg:hidden px-2.5 py-1.5 flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800/60">
                    <span className="font-mono text-[10px]">Role:</span>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="text-[10px] font-mono bg-zinc-900 text-violet-300 border border-zinc-800 rounded px-1.5 py-0.5"
                    >
                      <option value="client">Client</option>
                      <option value="admin">LevelUp Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      onNavigateTab('settings');
                      setAccountDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-md text-left"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                    Settings & Security
                  </button>
                  <button
                    onClick={() => {
                      onNavigateTab('support');
                      setAccountDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-md text-left"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                    Support Desk
                  </button>
                </div>

                <div className="pt-1 border-t border-zinc-800/80">
                  <button
                    onClick={() => setAccountDropdownOpen(false)}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-md text-left"
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
