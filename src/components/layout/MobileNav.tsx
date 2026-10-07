import React from 'react';
import {
  LayoutDashboard,
  Globe,
  FileText,
  Image as ImageIcon,
  Utensils,
  Briefcase,
  ShoppingBag,
  Users,
  Camera,
  Megaphone,
  BookOpen,
  Menu,
  X,
  CreditCard,
  ShieldCheck,
  LifeBuoy,
  Settings,
  CalendarDays,
  LineChart,
  SearchCode,
  UserCheck,
  Package,
  Boxes,
  MessageSquare,
  Users2,
  Gauge,
  FileCode2,
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { OrgSwitcher } from '../shadcn/OrgSwitcher';
import { LevelUpLogo } from '../shadcn/LevelUpLogo';
import { ThemeSelector } from '../shadcn/ThemeSelector';
import { ThemeModeToggle } from '../shadcn/ThemeModeToggle';
import { cn } from '../../lib/utils';
import { generateDashboardEngineConfig } from '../../lib/dashboardEngine';
import { dataService } from '../../services/dataService';
import { websiteDataService } from '../../services/websiteDataService';

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
  isOpen,
  onClose,
  onOpen,
}) => {
  const { currentTenant, activeWebsite, websites } = useTenant();
  const { orgRole } = useAuth();

  const site = activeWebsite || websites[0];
  const bookings = dataService.getBookings(currentTenant.id);
  const leads = dataService.getLeads(currentTenant.id);
  const requests = dataService.getRequests(currentTenant.id);
  const orders = dataService.getStoreOrders(currentTenant.id);

  const products = site ? websiteDataService.getProducts(site.id) : [];
  const lowStock = products.filter((p) => p.inventory_count <= p.low_stock_threshold);
  const announcements = site ? websiteDataService.getAnnouncements(site.id) : [];
  const draftAnnouncements = announcements.filter((a) => a.status === 'draft');

  const engine = generateDashboardEngineConfig(currentTenant, site, orgRole, {
    pendingBookingsCount: bookings.filter((b) => b.status === 'pending').length,
    upcomingBookingsCount: bookings.filter((b) => b.status !== 'cancelled').length,
    openRequestsCount: requests.filter((r) => r.status !== 'completed').length,
    newLeadsCount: leads.filter((l) => l.status === 'new').length,
    storeOrdersCount: orders.length,
    lowStockItemsCount: lowStock.length,
    draftAnnouncementsCount: draftAnnouncements.length,
    totalVisitors: site ? site.visitors_30d : 12480,
  });

  const getIconComponent = (name: string) => {
    switch (name) {
      case 'LayoutDashboard':
        return LayoutDashboard;
      case 'Globe':
        return Globe;
      case 'FileText':
        return FileText;
      case 'Image':
        return ImageIcon;
      case 'Utensils':
        return Utensils;
      case 'Briefcase':
        return Briefcase;
      case 'ShoppingBag':
        return ShoppingBag;
      case 'Users':
        return Users;
      case 'Camera':
        return Camera;
      case 'Megaphone':
        return Megaphone;
      case 'BookOpen':
        return BookOpen;
      case 'CalendarDays':
        return CalendarDays;
      case 'Users2':
        return Users2;
      case 'Package':
        return Package;
      case 'Boxes':
        return Boxes;
      case 'MessageSquare':
        return MessageSquare;
      case 'LineChart':
        return LineChart;
      case 'SearchCode':
        return SearchCode;
      case 'Gauge':
        return Gauge;
      case 'FileCode2':
        return FileCode2;
      case 'CreditCard':
        return CreditCard;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'UserCheck':
        return UserCheck;
      case 'LifeBuoy':
        return LifeBuoy;
      case 'Settings':
      default:
        return Settings;
    }
  };

  const primaryTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'website-control', label: 'Website', icon: Globe },
    { id: 'requests', label: 'Requests', icon: FileCode2 },
    { id: 'team', label: 'Team', icon: UserCheck },
  ];

  return (
    <>
      {/* Clean Bottom App Bar on Mobile */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 h-14 bg-background/95 backdrop-blur-md border-t border-border px-1 flex items-center justify-around z-40 select-none pb-safe">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            activeTab === tab.id ||
            (tab.id === 'website-control' && activeTab.startsWith('website-'));
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
              <div className="flex items-center gap-2.5">
                <LevelUpLogo className="size-7 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-foreground truncate max-w-[150px]">
                    {currentTenant.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground capitalize">
                    {engine.businessCategoryName}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="size-8 rounded-lg text-muted-foreground hover:text-foreground flex items-center justify-center"
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

            {/* Dynamic Navigation Groups from Engine */}
            <div className="flex-1 overflow-y-auto py-3 space-y-4 scrollbar-none">
              {engine.navGroups.map((section, sIdx) => (
                <div key={sIdx} className="space-y-0.5">
                  <div className="px-2 py-1 text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground">
                    {section.label}
                  </div>
                  {section.items.map((item) => {
                    const Icon = getIconComponent(item.icon);
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
                          <Icon
                            className={cn(
                              'size-4',
                              isActive ? 'text-foreground' : 'text-muted-foreground'
                            )}
                          />
                          <span className="truncate">{item.title}</span>
                        </div>

                        {item.badge !== undefined && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border">
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
            <div className="pt-3 border-t border-border text-xs text-muted-foreground flex items-center justify-between">
              <span>{currentTenant.name}</span>
              <span className="text-emerald-500 font-medium text-xs">Website Live</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
