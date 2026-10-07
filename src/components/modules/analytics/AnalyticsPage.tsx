import React, { useState } from 'react';
import {
  Users2,
  Eye,
  Clock,
  Activity,
  Smartphone,
  Laptop,
  Tablet,
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';
import { dataService } from '../../../services/dataService';
import { MetricCard } from '../../shared/MetricCard';

export const AnalyticsPage: React.FC = () => {
  const { currentTenant, websites } = useTenant();

  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [activeMetric, setActiveMetric] = useState<'visitors' | 'pageViews' | 'leads'>('visitors');

  const trafficData = dataService.getTrafficData(currentTenant.id);
  const topPages = dataService.getTopPages(currentTenant.id);
  const trafficSources = dataService.getTrafficSources(currentTenant.id);
  const leads = dataService.getLeads(currentTenant.id);

  const site = websites[0];
  const totalVisitors = site ? site.visitors_30d : 12482;
  const totalPageViews = Math.round(totalVisitors * 3.1);

  const isMedical = currentTenant.slug === 'lumina-health';
  const enquiriesLabel = isMedical ? 'Patient enquiries' : 'New enquiries';

  // Chart computation
  const values = trafficData.map((d) => d[activeMetric]);
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const range = maxVal - minVal || 1;

  const points = trafficData
    .map((d, idx) => {
      const x = (idx / (trafficData.length - 1)) * 500;
      const y = 130 - ((d[activeMetric] - minVal) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  const devices = [
    { name: 'Mobile', share: 58, icon: <Smartphone className="w-4 h-4 text-muted-foreground" /> },
    { name: 'Desktop', share: 36, icon: <Laptop className="w-4 h-4 text-muted-foreground" /> },
    { name: 'Tablet', share: 6, icon: <Tablet className="w-4 h-4 text-muted-foreground" /> },
  ];

  const dateLabels: Record<'7d' | '30d' | '90d', string> = {
    '7d': 'Last 7 days',
    '30d': 'Last 30 days',
    '90d': 'Last 90 days',
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-border">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            Website traffic
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Overview for {currentTenant.name}
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-1 p-0.5 bg-card border border-border rounded-md self-start sm:self-auto">
          {(['7d', '30d', '90d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                dateRange === r
                  ? 'bg-accent text-accent-foreground font-semibold shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
              }`}
            >
              {dateLabels[r]}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          title="Website traffic"
          value={totalVisitors.toLocaleString()}
          subValue="visits this period"
          change="↑ 12.5% vs previous period"
          changeType="positive"
          icon={<Users2 className="w-4 h-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Page views"
          value={totalPageViews.toLocaleString()}
          subValue="views this period"
          change="↑ 16.4% vs previous period"
          changeType="positive"
          icon={<Eye className="w-4 h-4 text-muted-foreground" />}
        />
        <MetricCard
          title={enquiriesLabel}
          value={leads.length}
          subValue="received this period"
          change="↑ 18.2% vs previous period"
          changeType="positive"
          icon={<Activity className="w-4 h-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Conversion rate"
          value="4.8%"
          subValue="visits to enquiries"
          change="↑ 0.6% vs previous period"
          changeType="positive"
          icon={<Clock className="w-4 h-4 text-muted-foreground" />}
        />
      </div>

      {/* Main Chart Card */}
      <div className="bg-card border border-border rounded-lg p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-border/80">
          <div>
            <h2 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
              Website traffic
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Daily activity ({dateLabels[dateRange].toLowerCase()})
            </p>
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-muted/40 border border-border rounded-md">
            {(
              [
                { id: 'visitors', label: 'Website traffic' },
                { id: 'pageViews', label: 'Page views' },
                { id: 'leads', label: enquiriesLabel },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMetric(m.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  activeMetric === m.id
                    ? 'bg-accent text-accent-foreground font-semibold shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="mt-4 sm:mt-5">
          <div className="h-44 sm:h-52 w-full relative">
            <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <line x1="0" y1="30" x2="500" y2="30" stroke="currentColor" className="text-border" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="currentColor" className="text-border" strokeDasharray="3 3" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="currentColor" className="text-border" strokeDasharray="3 3" />
              <polyline
                fill="none"
                stroke="currentColor"
                className="text-foreground"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            </svg>
          </div>

          <div className="flex justify-between items-center text-xs text-muted-foreground mt-2.5 px-1">
            {trafficData.map((d, idx) => (
              <span key={idx}>{d.date}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 2-Column Section: Top Pages & Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Pages */}
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-xs">
          <div className="p-3.5 sm:p-4 border-b border-border bg-muted/30">
            <h2 className="text-xs sm:text-sm font-semibold text-foreground">
              Top pages
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground bg-muted/20">
                  <th className="py-2.5 px-4 font-medium">Page</th>
                  <th className="py-2.5 px-4 font-medium text-right">Page views</th>
                  <th className="py-2.5 px-4 font-medium text-right">Avg. time</th>
                  <th className="py-2.5 px-4 font-medium text-right">Bounce rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {topPages.map((page, idx) => (
                  <tr key={idx} className="hover:bg-accent/40 transition-colors">
                    <td className="py-2.5 px-4 text-foreground font-medium">{page.path}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-foreground">
                      {page.views.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-muted-foreground">
                      {page.avgTime}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-muted-foreground">
                      {page.bounceRate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-card border border-border rounded-lg p-4 sm:p-5 shadow-xs space-y-4">
          <div className="border-b border-border pb-3">
            <h2 className="text-xs sm:text-sm font-semibold text-foreground">
              Traffic sources
            </h2>
          </div>

          <div className="space-y-3.5">
            {trafficSources.map((source, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{source.channel}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {source.share}% ({source.visitors.toLocaleString()} visits)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-xs overflow-hidden">
                  <div
                    className="h-full bg-foreground rounded-xs"
                    style={{ width: `${source.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Devices */}
          <div className="pt-3 border-t border-border">
            <div className="text-xs font-medium text-muted-foreground mb-2.5">
              Devices
            </div>
            <div className="grid grid-cols-3 gap-2">
              {devices.map((dev, idx) => (
                <div key={idx} className="p-2.5 rounded bg-muted/40 border border-border text-center">
                  <div className="flex justify-center mb-1">{dev.icon}</div>
                  <div className="text-xs sm:text-sm font-bold text-foreground tabular-nums">{dev.share}%</div>
                  <div className="text-xs text-muted-foreground truncate mt-0.5">{dev.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
