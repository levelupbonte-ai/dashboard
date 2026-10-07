import React, { useState, useEffect } from 'react';
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
  CalendarDays,
  Users2,
  Package,
  Boxes,
  LineChart,
  SearchCode,
  Gauge,
  FileCode2,
  CreditCard,
  ShieldCheck,
  UserCheck,
  LifeBuoy,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MessageSquare,
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { OrgSwitcher } from '../shadcn/OrgSwitcher';
import { NavUser } from '../shadcn/NavUser';
import { cn } from '../../lib/utils';
import { generateDashboardEngineConfig } from '../../lib/dashboardEngine';
import { dataService } from '../../services/dataService';
import { websiteDataService } from '../../services/websiteDataService';

interface ShadcnSidebarProps {
  activeTab: string;
  websiteSubTab?: string;
  onSelectTab: (tabId: string, subTab?: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  pendingRequestsCount: number;
  onOpenNotifications?: () => void;
}

export const ShadcnSidebar: React.FC<ShadcnSidebarProps> = ({
  activeTab,
  websiteSubTab = 'info',
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  onOpenNotifications,
}) => {
  const { currentTenant, activeWebsite, websites } = useTenant();
  const { orgRole } = useAuth();

  // Collapsible parent state (expanded by default when on website tab)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'website-control': true,
  });

  useEffect(() => {
    if (activeTab === 'website-control') {
      setExpandedSections((prev) => ({ ...prev, 'website-control': true }));
    }
  }, [activeTab]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

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

  return (
    <aside
      className={cn(
        'hidden md:flex h-screen bg-card/40 border-r border-border/50 flex-col transition-all duration-200 z-40 select-none shrink-0 sticky top-0',
        isCollapsed ? 'w-[68px]' : 'w-60'
      )}
    >
      {/* 1. Sidebar Header: Organization Switcher */}
      <div className="px-3 py-2.5 border-b border-border/40">
        <OrgSwitcher isCollapsed={isCollapsed} />
      </div>

      {/* 2. Sidebar Navigation Groups (Dynamically Generated from Engine) */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-none">
        {engine.navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-2.5 pb-1 text-[11px] font-medium text-muted-foreground/80 uppercase tracking-wider">
                {group.label}
              </div>
            )}

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = getIconComponent(item.icon);
                const isActive = activeTab === item.id;
                const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);
                const isExpanded = Boolean(expandedSections[item.id]);

                return (
                  <div key={item.id} className="space-y-0.5">
                    <button
                      onClick={() => {
                        if (hasSubItems && !isCollapsed && isActive) {
                          toggleSection(item.id);
                        } else if (hasSubItems && !isCollapsed && !isExpanded) {
                          setExpandedSections((prev) => ({ ...prev, [item.id]: true }));
                        }
                        onSelectTab(item.id);
                      }}
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

                      {!isCollapsed && item.badge !== undefined && (
                        <span
                          className={cn(
                            'text-[10px] font-mono px-1.5 py-0.2 rounded border',
                            item.badgeColor === 'amber'
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                              : item.badgeColor === 'rose'
                              ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                              : 'bg-muted text-muted-foreground border-border'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}

                      {!isCollapsed && hasSubItems && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSection(item.id);
                          }}
                          className="size-4 flex items-center justify-center text-muted-foreground hover:text-foreground transition-transform"
                        >
                          {isExpanded ? (
                            <ChevronDown className="size-3.5" />
                          ) : (
                            <ChevronRight className="size-3.5" />
                          )}
                        </span>
                      )}
                    </button>

                    {/* Nested Sub-Sections (Cloudflare-style tree line) */}
                    {!isCollapsed && hasSubItems && isExpanded && (
                      <div className="ml-4 pl-3.5 border-l border-border/60 space-y-0.5 my-1 animate-in fade-in slide-in-from-top-1 duration-150">
                        {item.subItems!.map((sub) => {
                          const isSubActive = isActive && websiteSubTab === sub.subTab;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => onSelectTab(item.id, sub.subTab)}
                              className={cn(
                                'w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[12px] leading-snug transition-colors text-left',
                                isSubActive
                                  ? 'bg-accent/70 text-accent-foreground font-semibold'
                                  : 'text-muted-foreground/80 hover:text-foreground hover:bg-accent/30 font-normal'
                              )}
                            >
                              <span className="truncate">{sub.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Bottom Controls: User profile + Collapse trigger */}
      <div className="p-3 border-t border-border/40 space-y-2">
        <NavUser isCollapsed={isCollapsed} onOpenNotifications={onOpenNotifications} />

        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <ChevronLeft className="size-4" />
              <span>Collapse Sidebar</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
