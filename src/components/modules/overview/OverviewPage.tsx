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
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { Button } from '../../ui/Button';
import { useTenant } from '../../../context/TenantContext';
import { dataService } from '../../../services/dataService';
import { formatCurrency, formatTimeAgo } from '../../../lib/utils';

interface OverviewPageProps {
  onNavigateTab: (tabId: string) => void;
  onRequestChange: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onNavigateTab,
  onRequestChange,
}) => {
  const { currentTenant, websites, activeWebsite, hasBookings, hasEcommerce } = useTenant();
  const [activeTab, setActiveTab] = useState('overview');

  const site = activeWebsite || websites[0];
  const leads = dataService.getLeads(currentTenant.id);
  const bookings = hasBookings ? dataService.getBookings(currentTenant.id) : [];
  const trafficData = dataService.getTrafficData(currentTenant.id);
  const storeOrders = hasEcommerce ? dataService.getStoreOrders(currentTenant.id) : [];
  const activities = dataService.getOrganizationActivity(currentTenant.id);

  const totalVisitors = site ? site.visitors_30d : 12482;
  const recentLeads = leads.slice(0, 5);
  const totalLeadValue = leads.reduce((sum, l) => sum + (l.value || 0), 0);

  // Adapt terminology to client business
  const isMedical = currentTenant.slug === 'lumina-health';
  const isHospitality = currentTenant.slug === 'velvet-vine';

  const enquiriesLabel = isMedical ? 'Patient enquiries' : 'New enquiries';
  const bookingsLabel = isHospitality ? 'Reservations' : 'Appointments';

  const maxVisitors = Math.max(...trafficData.map((d) => d.visitors));

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {currentTenant.name} website overview
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-card text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Last 30 days</span>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={onRequestChange}
            icon={<PlusCircle className="w-3.5 h-3.5" />}
          >
            Request a change
          </Button>
        </div>
      </div>

      {/* 2. Tabs Bar */}
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
              <span>View website ({site.domain})</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-3">
          {/* 3. 4-Card Metric Row (LABEL / VALUE / COMPARISON & CONTEXT) */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Website traffic */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Website traffic
                </CardTitle>
                <Activity className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                  {totalVisitors.toLocaleString()}
                </div>
                <div className="mt-1.5 space-y-0.5 text-xs">
                  <div className="text-muted-foreground">visits this period</div>
                  <div className="text-emerald-500 font-medium">↑ 12.5% vs previous period</div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: New enquiries / Patient enquiries */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  {enquiriesLabel}
                </CardTitle>
                <Users2 className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                  {leads.length}
                </div>
                <div className="mt-1.5 space-y-0.5 text-xs">
                  <div className="text-muted-foreground">received this period</div>
                  <div className="text-emerald-500 font-medium">↑ 18.2% vs previous period</div>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Appointments / Reservations / Orders / Lead value */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  {hasBookings
                    ? bookingsLabel
                    : hasEcommerce
                    ? 'Orders'
                    : 'Lead value'}
                </CardTitle>
                {hasBookings ? (
                  <CalendarCheck className="w-4 h-4 text-muted-foreground" />
                ) : hasEcommerce ? (
                  <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Activity className="w-4 h-4 text-muted-foreground" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                  {hasBookings
                    ? bookings.length
                    : hasEcommerce
                    ? storeOrders.length
                    : formatCurrency(totalLeadValue)}
                </div>
                <div className="mt-1.5 space-y-0.5 text-xs">
                  <div className="text-muted-foreground">
                    {hasBookings
                      ? 'booked this period'
                      : hasEcommerce
                      ? 'placed this period'
                      : 'estimated this period'}
                  </div>
                  <div className="text-emerald-500 font-medium">↑ 9.4% vs previous period</div>
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Website performance */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Website performance
                </CardTitle>
                <Globe className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                  {site ? site.performance_score : 98} / 100
                </div>
                <div className="mt-1.5 space-y-0.5 text-xs">
                  <div className="text-emerald-500 font-medium">Excellent</div>
                  <div className="text-muted-foreground">99.99% uptime</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 4. 2-Column Content Grid */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-7">
            {/* Left Card (4 of 7 cols): Website traffic */}
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

            {/* Right Card (3 of 7 cols): New enquiries */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{enquiriesLabel}</CardTitle>
                    <CardDescription>
                      {leads.length} received this period
                    </CardDescription>
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
                <div className="space-y-4">
                  {recentLeads.map((lead) => {
                    const initials = lead.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2);

                    return (
                      <div
                        key={lead.id}
                        onClick={() => onNavigateTab('leads')}
                        className="flex items-center justify-between gap-3 p-1.5 rounded-md hover:bg-accent/40 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="size-9 rounded-full bg-muted border border-border flex items-center justify-center font-semibold text-xs text-foreground shrink-0">
                            {initials}
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <p className="text-xs font-medium text-foreground truncate leading-none">
                              {lead.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {lead.source}
                            </p>
                          </div>
                        </div>

                        <div className="text-xs font-medium text-foreground tabular-nums shrink-0">
                          {lead.value ? formatCurrency(lead.value) : formatTimeAgo(lead.created_at)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-3">
          <Card>
            <CardHeader>
              <CardTitle>Website traffic & top pages</CardTitle>
              <CardDescription>
                View visitor numbers, top pages, and traffic sources for {currentTenant.name}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => onNavigateTab('analytics')} variant="primary" size="sm">
                View analytics
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent activity</CardTitle>
                  <CardDescription>
                    Recent actions by your team on {currentTenant.name}
                  </CardDescription>
                </div>
                <Button onClick={() => onNavigateTab('team')} variant="ghost" size="sm">
                  View team
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border/60">
                {activities.map((act) => (
                  <div key={act.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-semibold text-foreground">{act.actor_name}</span>{' '}
                      <span className="text-muted-foreground">{act.action}</span>{' '}
                      <span className="font-medium text-foreground">{act.target}</span>
                    </div>
                    <span className="text-muted-foreground shrink-0">
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
