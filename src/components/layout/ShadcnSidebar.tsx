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
  SearchCode,
  CreditCard,
  ShieldCheck,
  LifeBuoy,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserCheck,
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
  const { currentTenant, hasBookings, hasEcommerce, hasSeo, hasCarePlan } = useTenant();
  const { can } = useAuth();

  const canViewBilling = can('billing.view');
  const isMedical = currentTenant.slug === 'lumina-health';
  const isHospitality = currentTenant.slug === 'velvet-vine';

  const enquiriesLabel = isMedical ? 'Patient enquiries' : 'New enquiries';
  const bookingsLabel = isHospitality ? 'Reservations' : 'Appointments';

  // Client-Only Organization Navigation Structure
  const navGroups = [
    {
      label: 'Overview',
      items: [{ id: 'overview', title: 'Overview', icon: LayoutDashboard }],
    },
    {
      label: 'Website',
      items: [
        { id: 'websites', title: 'My websites', icon: Globe },
        {
          id: 'requests',
          title: 'Open requests',
          icon: FileCode2,
        },
      ],
    },
    {
      label: 'Business',
      items: [
        { id: 'leads', title: enquiriesLabel, icon: Users2 },
        ...(hasBookings ? [{ id: 'bookings', title: bookingsLabel, icon: CalendarDays }] : []),
        ...(hasEcommerce ? [{ id: 'store', title: 'Orders', icon: ShoppingBag }] : []),
      ],
    },
    {
      label: 'Performance',
      items: [
        { id: 'analytics', title: 'Website traffic', icon: LineChart },
        ...(hasSeo ? [{ id: 'seo', title: 'Search visibility', icon: SearchCode }] : []),
        { id: 'performance', title: 'Website performance', icon: Gauge },
      ],
    },
    ...(canViewBilling
      ? [
          {
            label: 'Billing',
            items: [
              { id: 'billing', title: 'Billing', icon: CreditCard },
              ...(hasCarePlan ? [{ id: 'care', title: 'Subscription', icon: ShieldCheck }] : []),
            ],
          },
        ]
      : []),
    {
      label: 'Team',
      items: [{ id: 'team', title: 'Team', icon: UserCheck }],
    },
    {
      label: 'Account',
      items: [
        { id: 'support', title: 'Support', icon: LifeBuoy },
        { id: 'settings', title: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        'hidden md:flex h-screen bg-card/40 border-r border-border/50 flex-col transition-all duration-200 z-40 select-none shrink-0 sticky top-0',
        isCollapsed ? 'w-[68px]' : 'w-60'
      )}
    >
      {/* 1. Sidebar Header: Organization Switcher (OrgSwitcher) */}
      <div className="px-3 py-2.5 border-b border-border/40">
        <OrgSwitcher isCollapsed={isCollapsed} />
      </div>

      {/* 2. Sidebar Navigation Items */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 scrollbar-none">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-2.5 pb-1 text-[11px] font-medium text-muted-foreground/80">
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
                      'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] leading-none transition-colors text-left relative group',
                      isActive
                        ? 'bg-accent/80 text-accent-foreground font-medium'
                        : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground font-normal',
                      isCollapsed && 'justify-center px-1.5'
                    )}
                    title={isCollapsed ? item.title : undefined}
                  >
                    <Icon
                      className={cn(
                        'size-4 shrink-0 transition-colors',
                        isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />

                    {!isCollapsed && (
                      <span className="truncate flex-1">{item.title}</span>
                    )}

                    {/* Tooltip on collapsed mode */}
                    {isCollapsed && (
                      <div className="fixed left-[72px] ml-1 hidden group-hover:flex items-center px-2.5 py-1.5 rounded-md bg-popover text-popover-foreground text-xs font-medium shadow-md border border-border/60 z-50 pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-100">
                        {item.title}
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
      <div className="p-2.5 border-t border-border/40 space-y-1">
        <NavUser
          isCollapsed={isCollapsed}
          onNavigateTab={onSelectTab}
          onOpenNotifications={onOpenNotifications}
        />

        {/* Collapsible toggle bar */}
        <button
          onClick={onToggleCollapse}
          className={cn(
            'w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors',
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
              <span className="text-xs">Collapse sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
