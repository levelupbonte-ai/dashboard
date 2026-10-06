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
  Sparkles,
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
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
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'websites', label: 'Sites', icon: <Globe className="w-4 h-4" /> },
    {
      id: 'requests',
      label: 'Requests',
      icon: <FileCode2 className="w-4 h-4" />,
      badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : undefined,
    },
    { id: 'leads', label: 'Leads', icon: <Users2 className="w-4 h-4" /> },
  ];

  const sections = [
    {
      title: 'PRIMARY',
      items: [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'websites', label: 'My Websites', icon: <Globe className="w-4 h-4" /> },
        {
          id: 'requests',
          label: 'Website Requests',
          icon: <FileCode2 className="w-4 h-4" />,
          badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : undefined,
        },
      ],
    },
    {
      title: 'BUSINESS & ENGAGEMENT',
      items: [
        { id: 'leads', label: 'Leads & Inquiries', icon: <Users2 className="w-4 h-4" /> },
        ...(hasBookings
          ? [{ id: 'bookings', label: 'Bookings & Appointments', icon: <CalendarDays className="w-4 h-4" /> }]
          : []),
        ...(hasEcommerce
          ? [{ id: 'store', label: 'Store & Orders', icon: <ShoppingBag className="w-4 h-4" /> }]
          : []),
      ],
    },
    {
      title: 'METRICS & REVENUE',
      items: [
        { id: 'analytics', label: 'Analytics & Traffic', icon: <LineChart className="w-4 h-4" /> },
        ...(hasSeo
          ? [{ id: 'seo', label: 'Search Visibility (SEO)', icon: <SearchCode className="w-4 h-4" /> }]
          : []),
        { id: 'billing', label: 'Billing & Invoices', icon: <CreditCard className="w-4 h-4" /> },
        ...(hasCarePlan
          ? [{ id: 'care', label: 'Website Care Plans', icon: <ShieldCheck className="w-4 h-4" /> }]
          : []),
      ],
    },
    {
      title: 'PREFERENCES',
      items: [
        { id: 'support', label: 'Support Desk', icon: <LifeBuoy className="w-4 h-4" /> },
        { id: 'settings', label: 'Settings & Security', icon: <Settings className="w-4 h-4" /> },
      ],
    },
    ...(isAdmin
      ? [
          {
            title: 'LEVELUP AGENCY',
            items: [
              { id: 'admin-overview', label: 'Agency Master Portal', icon: <Layers className="w-4 h-4 text-violet-400" /> },
              { id: 'admin-clients', label: 'Client Accounts & Flags', icon: <Users2 className="w-4 h-4 text-violet-400" /> },
              { id: 'admin-requests', label: 'Cross-Tenant Queue', icon: <FileCode2 className="w-4 h-4 text-violet-400" /> },
            ],
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Vercel/Cloudflare Clean Bottom App Bar on Mobile/Tablet */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 h-14 bg-[#08090d]/95 backdrop-blur-md border-t border-zinc-800 px-1 flex items-center justify-around z-40 select-none">
        {primaryTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full min-h-[44px] transition-colors relative',
                isActive
                  ? 'text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              )}
            >
              {/* Active top line highlight */}
              {isActive && (
                <div className="absolute top-0 inset-x-3 h-[2px] bg-violet-500 shadow-xs shadow-violet-500" />
              )}
              <div className="relative">
                {tab.icon}
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 px-1 text-[9px] font-mono font-bold bg-violet-600 text-white rounded">
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

        {/* More Trigger */}
        <button
          onClick={onOpen}
          className="flex flex-col items-center justify-center flex-1 h-full min-h-[44px] text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <Menu className="w-4 h-4" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Menu</span>
        </button>
      </nav>

      {/* Full Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 right-0 w-80 bg-[#0a0b10] border-l border-zinc-800 p-5 flex flex-col z-10 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-300 font-mono font-bold text-xs">
                  {currentTenant.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white truncate max-w-[170px]">
                    {currentTenant.name}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 uppercase">
                    LevelUp Dashboard
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/60 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-4">
              {sections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-0.5">
                  <div className="px-2 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
                    {section.title}
                  </div>
                  {section.items.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectTab(item.id);
                          onClose();
                        }}
                        className={cn(
                          'w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium text-left transition-colors min-h-[40px]',
                          isActive
                            ? 'bg-violet-950/40 text-violet-200 border border-violet-800/40 font-semibold'
                            : 'text-zinc-300 hover:text-white hover:bg-zinc-900/60'
                        )}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className={isActive ? 'text-violet-400' : 'text-zinc-400'}>
                            {item.icon}
                          </span>
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
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

            <div className="pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between font-mono">
              <span>{currentTenant.slug}</span>
              <span className="text-emerald-400 uppercase">RLS OK</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
