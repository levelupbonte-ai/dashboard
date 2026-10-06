import React, { useState } from 'react';
import {
  LayoutDashboard,
  Globe,
  Gauge,
  FileCode2,
  Users2,
  CalendarDays,
  ShoppingBag,
  LineChart,
  Activity,
  SearchCode,
  CreditCard,
  ShieldCheck,
  LifeBuoy,
  Settings,
  ShieldAlert,
  Server,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ChevronsUpDown,
  Building2,
  Check,
  LogOut,
  User,
  SlidersHorizontal,
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

interface ShadcnSidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  pendingRequestsCount: number;
}

export const ShadcnSidebar: React.FC<ShadcnSidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  pendingRequestsCount,
}) => {
  const { currentTenant, tenants, switchTenant, hasBookings, hasEcommerce, hasSeo, hasCarePlan } =
    useTenant();
  const { user, role, isAdmin, setRole } = useAuth();
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Grouped navigation (Kiranism / shadcn pattern)
  const navGroups = [
    {
      label: 'Platform',
      items: [
        { id: 'overview', title: 'Overview', icon: LayoutDashboard },
        { id: 'websites', title: 'My Websites', icon: Globe },
        { id: 'performance', title: 'Performance', icon: Gauge },
        {
          id: 'requests',
          title: 'Requests',
          icon: FileCode2,
          badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : undefined,
        },
      ],
    },
    {
      label: 'Business',
      items: [
        { id: 'leads', title: 'Leads', icon: Users2 },
        ...(hasBookings ? [{ id: 'bookings', title: 'Bookings', icon: CalendarDays }] : []),
        ...(hasEcommerce ? [{ id: 'store', title: 'Store & Orders', icon: ShoppingBag }] : []),
      ],
    },
    {
      label: 'Telemetry',
      items: [
        { id: 'analytics', title: 'Analytics', icon: LineChart },
        { id: 'traffic', title: 'Traffic', icon: Activity },
        ...(hasSeo ? [{ id: 'seo', title: 'Search Visibility', icon: SearchCode }] : []),
      ],
    },
    {
      label: 'Finance & Care',
      items: [
        { id: 'billing', title: 'Billing & Invoices', icon: CreditCard },
        ...(hasCarePlan ? [{ id: 'care', title: 'Website Care', icon: ShieldCheck }] : []),
      ],
    },
    {
      label: 'Help & Config',
      items: [
        { id: 'support', title: 'Support Desk', icon: LifeBuoy },
        { id: 'settings', title: 'Settings', icon: Settings },
      ],
    },
    ...(isAdmin
      ? [
          {
            label: 'Agency Master',
            items: [
              { id: 'admin-overview', title: 'Agency Portal', icon: Layers },
              { id: 'admin-clients', title: 'Client Roster & Flags', icon: Users2 },
              { id: 'admin-requests', title: 'Cross-Tenant Queue', icon: FileCode2 },
              { id: 'admin-audit', title: 'Security Audit Log', icon: Server },
            ],
          },
        ]
      : []),
  ];

  return (
    <aside
      className={cn(
        'hidden lg:flex h-screen bg-[#090a0f] border-r border-zinc-800 flex-col transition-all duration-200 z-40 select-none shrink-0 sticky top-0',
        isCollapsed ? 'w-[68px]' : 'w-64'
      )}
    >
      {/* 1. Sidebar Header: TeamSwitcher / Workspace Switcher (Kiranism pattern) */}
      <div className="p-3 border-b border-zinc-800 relative">
        <button
          onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
          className={cn(
            'w-full flex items-center gap-2.5 p-2 rounded-lg text-left transition-colors hover:bg-zinc-800/60 border border-zinc-800/80 bg-[#0f1016]',
            isCollapsed && 'justify-center p-1.5'
          )}
          title="Switch workspace"
        >
          <div className="w-8 h-8 rounded-md bg-violet-600 flex items-center justify-center text-white font-mono font-bold text-sm shrink-0 shadow-xs">
            {currentTenant.name.charAt(0)}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 pr-1">
              <div className="text-xs font-semibold text-white truncate tracking-tight">
                {currentTenant.name}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-1.5">
                <span className="capitalize">{currentTenant.care_plan} Care</span>
                <span>·</span>
                <span className="text-emerald-400">RLS</span>
              </div>
            </div>
          )}
          {!isCollapsed && <ChevronsUpDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
        </button>

        {/* Workspace Dropdown */}
        {workspaceMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setWorkspaceMenuOpen(false)}
            />
            <div className="absolute left-3 top-16 w-64 rounded-lg bg-[#0e0f16] border border-zinc-800 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2.5 py-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center justify-between border-b border-zinc-800/80 mb-1">
                <span>Client Workspaces</span>
                <span className="text-violet-400">ISOLATED</span>
              </div>
              <div className="space-y-0.5">
                {tenants.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      switchTenant(t.id);
                      setWorkspaceMenuOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between p-2 rounded-md text-xs transition-colors text-left',
                      t.id === currentTenant.id
                        ? 'bg-zinc-800 text-white font-semibold'
                        : 'text-zinc-300 hover:bg-zinc-800/40 hover:text-white'
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-5 h-5 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center text-[10px] font-mono font-bold text-zinc-200">
                        {t.name.charAt(0)}
                      </div>
                      <span className="truncate">{t.name}</span>
                    </div>
                    {t.id === currentTenant.id && <Check className="w-3.5 h-3.5 text-violet-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 2. Sidebar Content: Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-0.5">
            {!isCollapsed && (
              <div className="px-2 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
                {group.label}
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors text-left group min-h-[34px]',
                    isActive
                      ? 'bg-zinc-800 text-white font-semibold shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 shrink-0 transition-colors',
                      isActive ? 'text-violet-400' : 'text-zinc-400 group-hover:text-zinc-200'
                    )}
                  />
                  {!isCollapsed && <span className="truncate tracking-tight flex-1">{item.title}</span>}
                  {item.badge && !isCollapsed && (
                    <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-violet-600 text-white rounded">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* 3. Sidebar Footer: NavUser (Kiranism / shadcn pattern) */}
      <div className="p-2.5 border-t border-zinc-800 relative bg-[#07080b]">
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={cn(
              'flex-1 flex items-center gap-2 p-1.5 rounded-lg text-left hover:bg-zinc-800/60 transition-colors min-w-0',
              isCollapsed && 'justify-center p-1'
            )}
            title="User Profile Menu"
          >
            <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white font-mono font-bold text-xs shrink-0 shadow-xs">
              {user.full_name.charAt(0)}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 pr-1">
                <div className="text-xs font-semibold text-white truncate tracking-tight">
                  {user.full_name}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono truncate">
                  {user.email}
                </div>
              </div>
            )}
            {!isCollapsed && <ChevronsUpDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
          </button>

          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {isCollapsed && (
          <div className="flex justify-center pt-1">
            <button
              onClick={onToggleCollapse}
              className="p-1 text-zinc-400 hover:text-white"
              title="Expand sidebar"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* User Popover Menu */}
        {userMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setUserMenuOpen(false)}
            />
            <div className="absolute left-2.5 bottom-14 w-60 rounded-lg bg-[#0e0f16] border border-zinc-800 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2.5 py-2 border-b border-zinc-800/80 mb-1">
                <div className="text-xs font-semibold text-white truncate">{user.full_name}</div>
                <div className="text-[10px] text-zinc-400 font-mono truncate">{user.email}</div>
                <div className="mt-1 text-[10px] font-mono text-violet-400">
                  Role: {role.toUpperCase()}
                </div>
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    onSelectTab('settings');
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/60 text-left"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                  Account Settings
                </button>
                <button
                  onClick={() => {
                    onSelectTab('support');
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/60 text-left"
                >
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  LevelUp Support
                </button>
              </div>
              <div className="pt-1 mt-1 border-t border-zinc-800/80">
                <button
                  onClick={() => setUserMenuOpen(false)}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20 text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
