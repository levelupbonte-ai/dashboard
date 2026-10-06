import React, { useState } from 'react';
import {
  LineChart,
  Users2,
  Eye,
  Clock,
  Activity,
  Globe2,
  Smartphone,
  Laptop,
  Tablet,
  TrendingUp,
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';
import { dataService } from '../../../services/dataService';
import { MetricCard } from '../../shared/MetricCard';
import { formatCompactNumber } from '../../../lib/utils';

export const AnalyticsPage: React.FC = () => {
  const { currentTenant, websites } = useTenant();

  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [activeMetric, setActiveMetric] = useState<'visitors' | 'pageViews' | 'leads'>('visitors');

  const trafficData = dataService.getTrafficData(currentTenant.id);
  const topPages = dataService.getTopPages(currentTenant.id);
  const trafficSources = dataService.getTrafficSources(currentTenant.id);

  const site = websites[0];
  const totalVisitors = site ? site.visitors_30d : 14280;

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
    { name: 'Mobile Devices', share: 58, icon: <Smartphone className="w-4 h-4 text-violet-400" /> },
    { name: 'Desktop & Workstations', share: 36, icon: <Laptop className="w-4 h-4 text-sky-400" /> },
    { name: 'Tablets & iPads', share: 6, icon: <Tablet className="w-4 h-4 text-emerald-400" /> },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-border">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">Analytics & Telemetry</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Traffic distribution, page impressions, and bounce metrics.
          </p>
        </div>

        {/* Date Filter: Vercel style */}
        <div className="flex items-center gap-1 p-0.5 bg-card border border-border rounded-md self-start sm:self-auto">
          {(['7d', '30d', '90d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded transition-colors ${
                dateRange === r
                  ? 'bg-accent text-accent-foreground font-semibold shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards (2 cols mobile, 3 cols tablet, 6 cols desktop) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
        <MetricCard
          title="Visitors"
          value={formatCompactNumber(totalVisitors)}
          change="+18.4%"
          changeType="positive"
          icon={<Users2 className="w-3.5 h-3.5 text-foreground" />}
        />
        <MetricCard
          title="Sessions"
          value={formatCompactNumber(Math.round(totalVisitors * 1.34))}
          change="+14.2%"
          changeType="positive"
          icon={<Activity className="w-3.5 h-3.5 text-sky-500" />}
        />
        <MetricCard
          title="Page Views"
          value={formatCompactNumber(Math.round(totalVisitors * 3.1))}
          change="+22.0%"
          changeType="positive"
          icon={<Eye className="w-3.5 h-3.5 text-emerald-500" />}
        />
        <MetricCard
          title="Bounce Rate"
          value="29.4%"
          change="-3.2%"
          changeType="positive"
          icon={<TrendingUp className="w-3.5 h-3.5 text-amber-500" />}
        />
        <MetricCard
          title="Avg Time"
          value="2m 44s"
          change="+18s"
          changeType="positive"
          icon={<Clock className="w-3.5 h-3.5 text-foreground" />}
        />
        <MetricCard
          title="Conversion"
          value="4.8%"
          change="+0.6%"
          changeType="positive"
          icon={<Activity className="w-3.5 h-3.5 text-emerald-500" />}
        />
      </div>

      {/* Main Interactive Chart Card: Cloudflare style */}
      <div className="bg-card border border-border rounded-lg p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-border/80">
          <div>
            <h2 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">Traffic Over Time</h2>
            <p className="text-[11px] text-muted-foreground font-mono mt-0.5">Granular progression per day</p>
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-muted/40 border border-border rounded-md">
            {(
              [
                { id: 'visitors', label: 'Visitors' },
                { id: 'pageViews', label: 'Page Views' },
                { id: 'leads', label: 'Inquiries' },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMetric(m.id)}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
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

          <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground mt-2.5 px-1">
            {trafficData.map((d, idx) => (
              <span key={idx}>{d.date}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 2-Column Section: Top Pages & Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Pages */}
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-xs">
          <div className="p-3.5 sm:p-4 border-b border-border bg-muted/40">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
              Top Visited Routes
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-mono uppercase text-[10px] bg-muted/30">
                  <th className="py-2.5 px-4 font-medium">Route</th>
                  <th className="py-2.5 px-4 font-medium text-right">Views</th>
                  <th className="py-2.5 px-4 font-medium text-right">Avg Time</th>
                  <th className="py-2.5 px-4 font-medium text-right">Bounce</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {topPages.map((page, idx) => (
                  <tr key={idx} className="hover:bg-accent/40 transition-colors">
                    <td className="py-2.5 px-4 font-mono text-foreground font-medium">{page.path}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-foreground">
                      {page.views.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-muted-foreground">
                      {page.avgTime}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-muted-foreground">
                      {page.bounceRate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Traffic Channels */}
        <div className="bg-card border border-border rounded-lg p-4 sm:p-5 shadow-xs space-y-4">
          <div className="border-b border-border pb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
              Traffic Acquisition
            </h2>
          </div>

          <div className="space-y-3.5">
            {trafficSources.map((source, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{source.channel}</span>
                  <span className="font-mono text-muted-foreground tabular-nums text-[11px]">
                    {source.share}% ({source.visitors.toLocaleString()})
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

          {/* Device Breakdown */}
          <div className="pt-3 border-t border-border">
            <div className="text-[10px] font-semibold uppercase font-mono text-muted-foreground mb-2.5">
              Device Platforms
            </div>
            <div className="grid grid-cols-3 gap-2">
              {devices.map((dev, idx) => (
                <div key={idx} className="p-2.5 rounded bg-muted/40 border border-border text-center">
                  <div className="flex justify-center mb-0.5">{dev.icon}</div>
                  <div className="text-xs sm:text-sm font-bold text-foreground font-mono">{dev.share}%</div>
                  <div className="text-[9px] text-muted-foreground truncate mt-0.5">{dev.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
