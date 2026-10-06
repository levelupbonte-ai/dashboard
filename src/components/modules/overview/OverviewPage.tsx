import React, { useState } from 'react';
import {
  Users2,
  CalendarCheck,
  TrendingUp,
  DollarSign,
  Activity,
  PlusCircle,
  Calendar,
  ExternalLink,
  Globe,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { Button } from '../../ui/Button';
import { useTenant } from '../../../context/TenantContext';
import { dataService } from '../../../services/dataService';
import { formatCompactNumber, formatCurrency, formatTimeAgo } from '../../../lib/utils';

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

  const totalVisitors = site ? site.visitors_30d : 12480;
  const recentLeads = leads.slice(0, 5);

  // SVG bar chart values (TanStack / Recharts style in Kiranism dashboard)
  const maxVisitors = Math.max(...trafficData.map((d) => d.visitors));

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Page Header (Kiranism Dashboard Header) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Real-time digital performance for <span className="text-zinc-200 font-semibold">{currentTenant.name}</span>.
          </p>
        </div>

        {/* Action Controls (Date picker + Request Change) */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-800 bg-[#0c0d12] text-xs font-mono text-zinc-300">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span>Oct 01, 2026 - Oct 07, 2026</span>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={onRequestChange}
            icon={<PlusCircle className="w-3.5 h-3.5" />}
          >
            Request a Change
          </Button>
        </div>
      </div>

      {/* 2. Tabs Bar (Overview, Analytics, Reports, Notifications) */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between overflow-x-auto pb-1 scrollbar-none">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {site && (
            <a
              href={site.preview_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 font-mono"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{site.domain}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-3">
          {/* 3. 4-Card Metric Row (Exact Kiranism shadcn/ui layout) */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Revenue / Pipeline */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-medium text-zinc-400 uppercase tracking-wider font-mono">
                  {hasEcommerce ? 'Total Revenue' : 'Pipeline Value'}
                </CardTitle>
                <DollarSign className="w-4 h-4 text-zinc-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
                  {hasEcommerce ? '$38,450.00' : '$19,450.00'}
                </div>
                <p className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>+20.1% from last month</span>
                </p>
              </CardContent>
            </Card>

            {/* Card 2: Inbound Leads */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-medium text-zinc-400 uppercase tracking-wider font-mono">
                  Inbound Leads
                </CardTitle>
                <Users2 className="w-4 h-4 text-zinc-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
                  +{leads.length}
                </div>
                <p className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>+180.1% from last month</span>
                </p>
              </CardContent>
            </Card>

            {/* Card 3: Bookings / Sales */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-medium text-zinc-400 uppercase tracking-wider font-mono">
                  {hasBookings ? 'Booked Services' : hasEcommerce ? 'Store Sales' : 'Monthly Traffic'}
                </CardTitle>
                {hasBookings ? (
                  <CalendarCheck className="w-4 h-4 text-zinc-400" />
                ) : (
                  <Activity className="w-4 h-4 text-zinc-400" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
                  {hasBookings
                    ? `+${bookings.length}`
                    : hasEcommerce
                    ? `+${storeOrders.length}`
                    : `+${formatCompactNumber(totalVisitors)}`}
                </div>
                <p className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>+19% from last month</span>
                </p>
              </CardContent>
            </Card>

            {/* Card 4: Core Web Vitals & Uptime */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-medium text-zinc-400 uppercase tracking-wider font-mono">
                  Vitals & Uptime
                </CardTitle>
                <Activity className="w-4 h-4 text-zinc-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
                  {site ? site.performance_score : 98}/100
                </div>
                <p className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>99.99% Edge Availability</span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 4. 2-Column Content Grid: Col 4 / Col 3 (Kiranism pattern) */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-7">
            {/* Left Card (4 of 7 cols): Overview Traffic Bar Chart */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Overview</CardTitle>
                    <CardDescription>
                      Daily unique visitors across global edge nodes
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigateTab('analytics')}
                  >
                    View Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Clean SVG Bar Chart with shadcn palette */}
                <div className="h-56 sm:h-64 w-full flex items-end gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-zinc-800/80">
                  {trafficData.map((d, idx) => {
                    const heightPercent = Math.round((d.visitors / maxVisitors) * 100);
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <div className="text-[10px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                          {d.visitors}
                        </div>
                        <div className="w-full bg-zinc-800 hover:bg-violet-600 rounded-t-sm transition-colors relative" style={{ height: `${heightPercent}%` }} />
                        <div className="text-[10px] font-mono text-zinc-400">{d.date.split(' ')[0]}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span>Average: <strong>540 visits/day</strong></span>
                  <span className="text-emerald-400">Core Web Vitals Pass Grade</span>
                </div>
              </CardContent>
            </Card>

            {/* Right Card (3 of 7 cols): Recent Leads (Kiranism Recent Sales pattern) */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Inbound Leads</CardTitle>
                    <CardDescription>
                      You received {leads.length} qualified inquiries this cycle.
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigateTab('leads')}
                  >
                    View All
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
                        className="flex items-center justify-between gap-3 p-1 rounded-md hover:bg-zinc-800/30 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-mono font-bold text-xs text-zinc-200 shrink-0">
                            {initials}
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <p className="text-xs font-medium text-white truncate leading-none">
                              {lead.name}
                            </p>
                            <p className="text-[11px] text-zinc-400 font-mono truncate">
                              {lead.email}
                            </p>
                          </div>
                        </div>

                        <div className="font-mono text-xs font-semibold text-emerald-400 tabular-nums shrink-0">
                          {lead.value ? `+${formatCurrency(lead.value)}` : 'Qualified'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 5. Cloudflare & Vercel Telemetry Status Strip */}
          <div className="p-3.5 rounded-lg border border-zinc-800 bg-[#0a0b10] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400 font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Multi-Tenant RLS Status: <strong className="text-emerald-400">ACTIVE & SECURED</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <span>Care Plan: <strong className="text-zinc-200 uppercase">{currentTenant.care_plan}</strong></span>
              <span className="text-zinc-700">|</span>
              <span>Next Audit: <strong className="text-zinc-200">Oct 12, 2026</strong></span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Deep Dive</CardTitle>
              <CardDescription>Comprehensive metrics, routes, and geographic telemetry</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => onNavigateTab('analytics')} variant="primary" size="sm">
                Open Full Analytics Module &rarr;
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Automated SLA Reports</CardTitle>
              <CardDescription>Monthly PDF exports and security validation digests</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => onNavigateTab('care')} variant="secondary" size="sm">
                View Website Care SLAs &rarr;
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Workspace Activity</CardTitle>
              <CardDescription>Code deployments, ticket updates, and client interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => onNavigateTab('requests')} variant="secondary" size="sm">
                View Request Queue &rarr;
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
