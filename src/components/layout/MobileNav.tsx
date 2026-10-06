import React from 'react';
import {
  LayoutDashboard,
  Globe,
  FileCode2,
  Users2,
  Menu,
  X,
  CreditCard,
  ShieldCheck,
  LifeBuoy,
  Settings,
  CalendarDays,
  ShoppingBag,
  LineChart,
  SearchCode,
  Layers,
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { OrgSwitcher } from '../shadcn/OrgSwitcher';
import { ThemeSelector } from '../shadcn/ThemeSelector';
import { ThemeModeToggle } from '../shadcn/ThemeModeToggle';
import { cn } from '../../lib/utils';

interface MobileNavProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  pendingRequestsCount: number;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onSelectTab,
  pendingRequestsCount,
  isOpen,
  onClose,
  onOpen,
}) => {
  const { currentTenant, hasBookings, hasEcommerce, hasSeo, hasCarePlan } = useTenant();
  const { isAdmin } = useAuth();

  const primaryTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'websites', label: 'Websites', icon: Globe },
    {
      id: 'requests',
      label: 'Requests',
      icon: FileCode2,
      badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : undefined,
    },
    { id: 'leads', label: 'Leads', icon: Users2 },
  ];

  const sections = [
    {
      title: 'PLATFORM',
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'websites', label: 'My Websites', icon: Globe },
        {
          id: 'requests',
          label: 'Website Requests',
          icon: FileCode2,
          badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : undefined,
        },
      ],
    },
    {
      title: 'BUSINESS & ENGAGEMENT',
      items: [
        { id: 'leads', label: 'Leads & Inquiries', icon: Users2 },
        ...(hasBookings
          ? [{ id: 'bookings', label: 'Bookings & Appointments', icon: CalendarDays }]
          : []),
        ...(hasEcommerce
          ? [{ id: 'store', label: 'Store & Orders', icon: ShoppingBag }]
          : []),
      ],
    },
    {
      title: 'TELEMETRY & FINANCE',
      items: [
        { id: 'analytics', label: 'Analytics & Traffic', icon: LineChart },
        ...(hasSeo
          ? [{ id: 'seo', label: 'Search Visibility (SEO)', icon: SearchCode }]
          : []),
        { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
        ...(hasCarePlan
          ? [{ id: 'care', label: 'Website Care Plans', icon: ShieldCheck }]
          : []),
      ],
    },
    {
      title: 'PREFERENCES',
      items: [
        { id: 'support', label: 'Support Desk', icon: LifeBuoy },
        { id: 'settings', label: 'Settings & Security', icon: Settings },
      ],
    },
    ...(isAdmin
      ? [
          {
            title: 'AGENCY MASTER',
            items: [
              { id: 'admin-overview', label: 'Agency Master Portal', icon: Layers },
              { id: 'admin-clients', label: 'Client Accounts & Flags', icon: Users2 },
              { id: 'admin-requests', label: 'Cross-Tenant Queue', icon: FileCode2 },
            ],
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Vercel/Cloudflare Clean Bottom App Bar on Mobile */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 h-14 bg-background/95 backdrop-blur-md border-t border-border px-1 flex items-center justify-around z-40 select-none pb-safe">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full min-h-[44px] transition-colors relative',
                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isActive && (
                <div className="absolute top-0 inset-x-3 h-[2px] bg-primary rounded-full" />
              )}
              <div className="relative">
                <Icon className="size-4" />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 px-1 text-[9px] font-mono font-bold bg-primary text-primary-foreground rounded">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium tracking-tight mt-1 truncate">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* More Drawer Trigger */}
        <button
          onClick={onOpen}
          className="flex flex-col items-center justify-center flex-1 h-full min-h-[44px] text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Open full menu"
        >
          <Menu className="size-4" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Menu</span>
        </button>
      </nav>

      {/* Full Mobile Slide-Out Drawer Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-card border-l border-border p-4 flex flex-col z-10 shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border/80">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-mono font-bold text-xs">
                  {currentTenant.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground truncate max-w-[150px]">
                    {currentTenant.name}
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground">
                    LevelUp Dashboard
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 flex items-center justify-center"
                aria-label="Close menu"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Quick Controls in Drawer */}
            <div className="py-2.5 border-b border-border/60 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Appearance</span>
              <div className="flex items-center gap-1.5">
                <ThemeModeToggle />
                <ThemeSelector />
              </div>
            </div>

            {/* Organization Switcher inside mobile drawer */}
            <div className="py-2 border-b border-border/60">
              <OrgSwitcher isCollapsed={false} />
            </div>

            {/* Navigation Groups */}
            <div className="flex-1 overflow-y-auto py-3 space-y-4 scrollbar-none">
              {sections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-0.5">
                  <div className="px-2 py-1 text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground">
                    {section.title}
                  </div>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectTab(item.id);
                          onClose();
                        }}
                        className={cn(
                          'w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-left transition-colors min-h-[40px]',
                          isActive
                            ? 'bg-accent text-accent-foreground font-semibold'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
                        )}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={cn('size-4', isActive ? 'text-foreground' : 'text-muted-foreground')} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-primary text-primary-foreground rounded">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-border text-[11px] text-muted-foreground flex items-center justify-between font-mono">
              <span>{currentTenant.slug}</span>
              <span className="text-emerald-500 uppercase font-bold text-[10px]">Active</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
