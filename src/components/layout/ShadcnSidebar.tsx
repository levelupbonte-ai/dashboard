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
  Layers,
  Server,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { OrgSwitcher } from '../shadcn/OrgSwitcher';
import { NavUser } from '../shadcn/NavUser';
import { cn } from '../../lib/utils';

interface ShadcnSidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  pendingRequestsCount: number;
  onOpenNotifications?: () => void;
}

export const ShadcnSidebar: React.FC<ShadcnSidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  pendingRequestsCount,
  onOpenNotifications,
}) => {
  const { hasBookings, hasEcommerce, hasSeo, hasCarePlan } = useTenant();
  const { isAdmin } = useAuth();

  // Navigation grouping inspired by next-shadcn-dashboard-starter / nav-config.ts
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
        { id: 'billing', title: 'Billing & Plans', icon: CreditCard },
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
        'hidden md:flex h-screen bg-card/60 border-r border-border flex-col transition-all duration-200 z-40 select-none shrink-0 sticky top-0',
        isCollapsed ? 'w-[68px]' : 'w-64'
      )}
    >
      {/* 1. Sidebar Header: Organization Switcher (OrgSwitcher) */}
      <div className="p-3 border-b border-border/80">
        <OrgSwitcher isCollapsed={isCollapsed} />
      </div>

      {/* 2. Sidebar Navigation Items */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 scrollbar-none">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-0.5">
            {!isCollapsed && (
              <div className="px-2.5 py-1 text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground">
                {group.label}
              </div>
            )}

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left relative group',
                      isActive
                        ? 'bg-accent text-accent-foreground font-semibold shadow-2xs'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                      isCollapsed && 'justify-center px-1.5'
                    )}
                    title={isCollapsed ? item.title : undefined}
                  >
                    <Icon
                      className={cn(
                        'size-4 shrink-0 transition-colors',
                        isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />

                    {!isCollapsed && (
                      <span className="truncate flex-1 tracking-tight">{item.title}</span>
                    )}

                    {!isCollapsed && item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-md bg-foreground text-background shrink-0">
                        {item.badge}
                      </span>
                    )}

                    {/* Tooltip on collapsed mode */}
                    {isCollapsed && (
                      <div className="fixed left-[72px] ml-1 hidden group-hover:flex items-center px-2 py-1 rounded bg-popover text-popover-foreground text-xs font-medium shadow-md border border-border z-50 pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-100">
                        {item.title}
                        {item.badge && (
                          <span className="ml-1.5 px-1 py-0.2 text-[9px] font-mono bg-muted rounded">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Collapse Toggle Button & User Profile Footer (NavUser) */}
      <div className="p-2 border-t border-border/80 space-y-1 bg-card/40">
        <NavUser
          isCollapsed={isCollapsed}
          onNavigateTab={onSelectTab}
          onOpenNotifications={onOpenNotifications}
        />

        {/* Collapsible toggle bar */}
        <button
          onClick={onToggleCollapse}
          className={cn(
            'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors border border-transparent hover:border-border/60',
            isCollapsed && 'justify-center'
          )}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="size-3.5" />
          ) : (
            <>
              <ChevronLeft className="size-3.5" />
              <span className="text-[11px] font-mono">Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
