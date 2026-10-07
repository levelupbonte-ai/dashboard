import React, { useState } from 'react';
import {
  Users2,
  CalendarCheck,
  Activity,
  PlusCircle,
  Calendar,
  ExternalLink,
  Globe,
  ShoppingBag,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Utensils,
  Briefcase,
  Megaphone,
  Clock,
  Package,
  Boxes,
  UserCheck,
  BookOpen,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { Button } from '../../ui/Button';
import { useTenant } from '../../../context/TenantContext';
import { useAuth } from '../../../context/AuthContext';
import { dataService } from '../../../services/dataService';
import { websiteDataService } from '../../../services/websiteDataService';
import { generateDashboardEngineConfig } from '../../../lib/dashboardEngine';
import { formatCurrency, formatTimeAgo } from '../../../lib/utils';
import { StatusBadge } from '../../ui/StatusBadge';

interface OverviewPageProps {
  onNavigateTab: (tabId: string, subTab?: string) => void;
  onRequestChange: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onNavigateTab,
  onRequestChange,
}) => {
  const { currentTenant, websites, activeWebsite, hasBookings, hasEcommerce } = useTenant();
  const { orgRole } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const site = activeWebsite || websites[0];
  const leads = dataService.getLeads(currentTenant.id);
  const bookings = hasBookings ? dataService.getBookings(currentTenant.id) : [];
  const trafficData = dataService.getTrafficData(currentTenant.id);
  const storeOrders = hasEcommerce ? dataService.getStoreOrders(currentTenant.id) : [];
  const activities = dataService.getOrganizationActivity(currentTenant.id);
  const requests = dataService.getRequests(currentTenant.id);

  // Content counts from CMS
  const products = site ? websiteDataService.getProducts(site.id) : [];
  const lowStockItems = products.filter((p) => p.inventory_count <= p.low_stock_threshold);
  const announcements = site ? websiteDataService.getAnnouncements(site.id) : [];
  const draftAnnouncements = announcements.filter((a) => a.status === 'draft');

  // Compute live engine config
  const engineConfig = generateDashboardEngineConfig(currentTenant, site, orgRole, {
    pendingBookingsCount: bookings.filter((b) => b.status === 'pending').length,
    upcomingBookingsCount: bookings.filter((b) => b.status !== 'cancelled').length,
    openRequestsCount: requests.filter((r) => r.status !== 'completed').length,
    newLeadsCount: leads.filter((l) => l.status === 'new').length,
    storeOrdersCount: storeOrders.length,
    lowStockItemsCount: lowStockItems.length,
    draftAnnouncementsCount: draftAnnouncements.length,
    totalVisitors: site ? site.visitors_30d : 12480,
    revenueTotal: storeOrders.reduce((acc, o) => acc + o.total, 0),
  });

  const totalVisitors = site ? site.visitors_30d : 12482;
  const recentLeads = leads.slice(0, 5);
  const maxVisitors = Math.max(...trafficData.map((d) => d.visitors));

  const renderQuickActionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Utensils':
        return <Utensils className="size-3.5" />;
      case 'Briefcase':
        return <Briefcase className="size-3.5" />;
      case 'CalendarDays':
        return <CalendarCheck className="size-3.5" />;
      case 'Megaphone':
        return <Megaphone className="size-3.5" />;
      case 'Clock':
        return <Clock className="size-3.5" />;
      case 'Package':
        return <Package className="size-3.5" />;
      case 'Boxes':
        return <Boxes className="size-3.5" />;
      case 'Users':
      case 'Users2':
        return <UserCheck className="size-3.5" />;
      case 'BookOpen':
        return <BookOpen className="size-3.5" />;
      case 'Sparkles':
      default:
        return <Sparkles className="size-3.5" />;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Dashboard
            </h1>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-muted/80 border border-border text-foreground">
              {engineConfig.businessCategoryName}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Website Control Center & Operational Data for {currentTenant.name}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateTab('website-control')}
            icon={<Globe className="w-3.5 h-3.5 text-primary" />}
          >
            Manage Website
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onRequestChange}
            icon={<PlusCircle className="w-3.5 h-3.5" />}
          >
            Request Code Change
          </Button>
        </div>
      </div>

      {/* 2. Intelligent Prioritization Attention Banners (Section 21) */}
      {engineConfig.priorities.length > 0 && (
        <div className="space-y-2">
          {engineConfig.priorities.map((item) => (
            <div
              key={item.id}
              className={`p-3 sm:p-3.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-150 ${
                item.type === 'urgent'
                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  : item.type === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  : 'bg-primary/10 border-primary/20 text-primary'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-foreground">{item.title}</div>
                  <div className="text-[11px] text-muted-foreground">{item.message}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab(item.action_tab, item.sub_tab)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-background/80 hover:bg-background text-foreground text-xs font-medium border border-border shrink-0 self-start sm:self-auto transition-colors"
              >
                <span>{item.action_label}</span>
                <ArrowRight className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 3. Contextual Quick Actions (Section 22) */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Quick Actions ({engineConfig.websiteType})
          </span>
          <span className="text-[11px] text-muted-foreground">
            Directly update your live website content
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {engineConfig.quickActions.map((qa) => (
            <button
              key={qa.id}
              type="button"
              onClick={() => {
                if (qa.action_tab === 'requests') {
                  onRequestChange();
                } else {
                  onNavigateTab(qa.action_tab, qa.sub_tab);
                }
              }}
              className="p-3 rounded-md bg-muted/20 border border-border/60 hover:bg-muted/40 hover:border-foreground/30 text-left transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                <span>{qa.label}</span>
                <span className="p-1 rounded bg-background border border-border text-primary group-hover:scale-110 transition-transform">
                  {renderQuickActionIcon(qa.icon)}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug">
                {qa.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Tabs Bar */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between overflow-x-auto pb-1 scrollbar-none">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Website traffic</TabsTrigger>
            <TabsTrigger value="activity">Recent activity</TabsTrigger>
          </TabsList>

          {site && (
            <a
              href={site.preview_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>View live website ({site.domain})</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-3">
          {/* Dynamic 4-Metric Grid Adapted to Business Model */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {engineConfig.overviewMetrics.map((m) => (
              <Card key={m.key}>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    {m.label}
                  </CardTitle>
                  <Activity className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                    {m.value}
                  </div>
                  <div className="mt-1.5 space-y-0.5 text-xs">
                    {m.change && (
                      <div className={m.isPositive ? 'text-emerald-500 font-medium' : 'text-rose-400 font-medium'}>
                        {m.change}
                      </div>
                    )}
                    {m.subtext && <div className="text-muted-foreground">{m.subtext}</div>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 2-Column Content Grid */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-7">
            {/* Left Card: Website traffic chart */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Website traffic</CardTitle>
                    <CardDescription>Daily visits over the last 7 days</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigateTab('analytics')}
                  >
                    View analytics
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-56 sm:h-64 w-full flex items-end gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-border/80">
                  {trafficData.map((d, idx) => {
                    const heightPercent = Math.round((d.visitors / maxVisitors) * 100);
                    return (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                      >
                        <div className="text-[11px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                          {d.visitors}
                        </div>
                        <div
                          className="w-full bg-muted hover:bg-primary rounded-t-sm transition-colors relative"
                          style={{ height: `${heightPercent}%` }}
                        />
                        <div className="text-[11px] text-muted-foreground">
                          {d.date}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Average: <strong className="text-foreground">540 visits / day</strong>
                  </span>
                  <span>Last 7 days</span>
                </div>
              </CardContent>
            </Card>

            {/* Right Card: New enquiries / bookings */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Inquiries & Requests</CardTitle>
                    <CardDescription>Latest client interactions</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigateTab('leads')}
                  >
                    View all
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentLeads.length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted-foreground">
                    No new enquiries yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="flex items-start justify-between gap-3 pb-3 border-b border-border/60 last:border-0 last:pb-0 text-xs"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="font-semibold text-foreground truncate">{lead.name}</div>
                          <div className="text-[11px] text-muted-foreground truncate">{lead.email}</div>
                          <div className="text-[10px] text-muted-foreground">{lead.source}</div>
                        </div>

                        <StatusBadge status={lead.status} />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic & Acquisition Overview</CardTitle>
              <CardDescription>Audience volume and sources for {site?.domain}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-md bg-muted/20 border border-border">
                    <span className="text-[11px] text-muted-foreground">Total Visits (30d)</span>
                    <div className="text-xl font-bold text-foreground mt-0.5">{totalVisitors.toLocaleString()}</div>
                  </div>
                  <div className="p-3 rounded-md bg-muted/20 border border-border">
                    <span className="text-[11px] text-muted-foreground">Avg. Time on Site</span>
                    <div className="text-xl font-bold text-foreground mt-0.5">2m 45s</div>
                  </div>
                  <div className="p-3 rounded-md bg-muted/20 border border-border">
                    <span className="text-[11px] text-muted-foreground">Mobile Ratio</span>
                    <div className="text-xl font-bold text-foreground mt-0.5">68.4%</div>
                  </div>
                </div>

                <Button variant="outline" size="sm" onClick={() => onNavigateTab('analytics')}>
                  Open Full Analytics Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Organization Activities</CardTitle>
              <CardDescription>Chronological events logged across LevelUp platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.slice(0, 8).map((act) => (
                  <div
                    key={act.id}
                    className="flex items-center justify-between gap-3 pb-3 border-b border-border/60 last:border-0 last:pb-0 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-foreground">{act.actor_name}</span>{' '}
                      <span className="text-muted-foreground">{act.action}</span>{' '}
                      <strong className="text-foreground">{act.target}</strong>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                      {formatTimeAgo(act.created_at)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
