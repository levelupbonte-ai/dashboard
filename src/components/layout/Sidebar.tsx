import React from 'react';
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
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  pendingRequestsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  pendingRequestsCount,
}) => {
  const { currentTenant, hasBookings, hasEcommerce, hasSeo, hasCarePlan } = useTenant();
  const { isAdmin } = useAuth();

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
      ],
    },
    {
      title: 'WEBSITE',
      items: [
        { id: 'websites', label: 'My Websites', icon: <Globe className="w-4 h-4" /> },
        { id: 'performance', label: 'Performance', icon: <Gauge className="w-4 h-4" /> },
        {
          id: 'requests',
          label: 'Requests',
          icon: <FileCode2 className="w-4 h-4" />,
          badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : undefined,
        },
      ],
    },
    {
      title: 'BUSINESS',
      items: [
        { id: 'leads', label: 'Leads', icon: <Users2 className="w-4 h-4" /> },
        ...(hasBookings
          ? [{ id: 'bookings', label: 'Bookings', icon: <CalendarDays className="w-4 h-4" /> }]
          : []),
        ...(hasEcommerce
          ? [{ id: 'store', label: 'Store & Orders', icon: <ShoppingBag className="w-4 h-4" /> }]
          : []),
      ],
    },
    {
      title: 'ANALYTICS',
      items: [
        { id: 'analytics', label: 'Analytics', icon: <LineChart className="w-4 h-4" /> },
        { id: 'traffic', label: 'Traffic', icon: <Activity className="w-4 h-4" /> },
        ...(hasSeo
          ? [{ id: 'seo', label: 'Search Visibility', icon: <SearchCode className="w-4 h-4" /> }]
          : []),
      ],
    },
    {
      title: 'BILLING',
      items: [
        { id: 'billing', label: 'Billing & Invoices', icon: <CreditCard className="w-4 h-4" /> },
        ...(hasCarePlan
          ? [{ id: 'care', label: 'Website Care', icon: <ShieldCheck className="w-4 h-4" /> }]
          : []),
      ],
    },
    {
      title: 'SUPPORT',
      items: [
        { id: 'support', label: 'Support & Tickets', icon: <LifeBuoy className="w-4 h-4" /> },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ];

  const adminSection = {
    title: 'LEVELUP AGENCY',
    items: [
      { id: 'admin-overview', label: 'Agency Portal', icon: <Layers className="w-4 h-4 text-violet-400" /> },
      { id: 'admin-clients', label: 'Client Accounts & Flags', icon: <Users2 className="w-4 h-4 text-violet-400" /> },
      { id: 'admin-requests', label: 'Cross-Tenant Queue', icon: <FileCode2 className="w-4 h-4 text-violet-400" /> },
      { id: 'admin-audit', label: 'Security & Audit Logs', icon: <Server className="w-4 h-4 text-violet-400" /> },
    ],
  };

  return (
    <aside
      className={cn(
        'hidden lg:flex h-screen bg-[#08090d] border-r border-zinc-800 flex-col transition-all duration-150 z-40 select-none shrink-0 sticky top-0',
        isCollapsed ? 'w-15' : 'w-56'
      )}
    >
      {/* Brand Header */}
      <div className="h-13 sm:h-14 border-b border-zinc-800 px-3.5 flex items-center justify-between">
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-violet-600 flex items-center justify-center shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wider text-white uppercase font-mono">
                LEVELUP
              </div>
              <div className="text-[9px] font-mono tracking-widest text-violet-400 uppercase leading-none">
                ECOSYSTEM
              </div>
            </div>
          </div>
        ) : (
          <div className="w-6 h-6 mx-auto rounded bg-violet-600 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-2 py-2.5 space-y-4">
        {navSections.map((section, sIdx) => {
          if (section.items.length === 0) return null;
          return (
            <div key={`sec-${sIdx}`} className="space-y-0.5">
              {!isCollapsed && (
                <div className="px-2 py-1 text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={cn(
                      'w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors text-left group min-h-[32px]',
                      isActive
                        ? 'bg-zinc-800/80 text-white font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span
                      className={cn(
                        'shrink-0 transition-colors',
                        isActive ? 'text-violet-400' : 'text-zinc-400 group-hover:text-zinc-200'
                      )}
                    >
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="truncate flex-1 tracking-tight">{item.label}</span>
                    )}
                    {item.badge && !isCollapsed && (
                      <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-violet-600 text-white rounded">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}

        {/* Agency Admin Section */}
        {isAdmin && (
          <div className="pt-2 border-t border-zinc-800/80 space-y-0.5">
            {!isCollapsed && (
              <div className="px-2 py-1 text-[10px] font-mono font-semibold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-3 h-3" />
                <span>{adminSection.title}</span>
              </div>
            )}
            {adminSection.items.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors text-left group min-h-[32px]',
                    isActive
                      ? 'bg-violet-950/40 text-violet-200 border border-violet-800/40 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="truncate tracking-tight">{item.label}</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Info */}
      {!isCollapsed ? (
        <div className="p-2.5 border-t border-zinc-800 bg-[#06070a] text-[10px] text-zinc-400">
          <div className="flex items-center justify-between font-mono">
            <span>ISOLATION</span>
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              POSTGRES RLS
            </span>
          </div>
          <div className="text-[10px] text-zinc-400 truncate font-mono mt-0.5">
            {currentTenant.slug}
          </div>
        </div>
      ) : (
        <div className="p-2 border-t border-zinc-800 flex justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="RLS Enforced" />
        </div>
      )}
    </aside>
  );
};
