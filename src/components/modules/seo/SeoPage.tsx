import React from 'react';
import { SearchCode, TrendingUp, ArrowUp, ArrowDown, Minus, Globe } from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';
import { dataService } from '../../../services/dataService';
import { MetricCard } from '../../shared/MetricCard';

export const SeoPage: React.FC = () => {
  const { currentTenant } = useTenant();
  const keywords = dataService.getSeoKeywords(currentTenant.id);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="pb-3 sm:pb-4 border-b border-border">
        <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
          Search visibility
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Google search rankings and indexed pages for {currentTenant.name}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <MetricCard
          title="Indexed pages"
          value="100%"
          subValue="all pages indexed"
          change="Live"
          changeType="positive"
          icon={<Globe className="w-4 h-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Top 3 rankings"
          value={keywords.filter((k) => k.position <= 3).length || 14}
          subValue="keywords in top 3"
          change="↑ 4 vs last month"
          changeType="positive"
          icon={<SearchCode className="w-4 h-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Search traffic"
          value="6,490"
          subValue="visits from Google this month"
          change="↑ 14.8% vs last month"
          changeType="positive"
          icon={<TrendingUp className="w-4 h-4 text-muted-foreground" />}
        />
      </div>

      {/* Search Keywords Container */}
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-xs">
        <div className="p-3.5 sm:p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-semibold text-foreground">
            Search keywords
          </h2>
          <span className="text-xs text-muted-foreground">
            Last 30 days
          </span>
        </div>

        {/* Mobile View */}
        <div className="sm:hidden divide-y divide-border/60">
          {keywords.map((kw, idx) => (
            <div key={idx} className="p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">{kw.keyword}</span>
                <div className="flex items-center gap-1 text-xs font-bold text-foreground tabular-nums">
                  <span>#{kw.position}</span>
                  {kw.change > 0 && <span className="text-xs text-emerald-500">↑ {kw.change}</span>}
                  {kw.change < 0 && <span className="text-xs text-rose-500">↓ {Math.abs(kw.change)}</span>}
                </div>
              </div>
              <div className="text-xs text-muted-foreground truncate">{kw.url}</div>
              <div className="text-xs text-muted-foreground tabular-nums">
                {kw.volume.toLocaleString()} monthly searches
              </div>
            </div>
          ))}
        </div>

        {/* Tablet & Desktop View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground bg-muted/20">
                <th className="py-2.5 px-4 font-medium">Keyword</th>
                <th className="py-2.5 px-4 font-medium">Position</th>
                <th className="py-2.5 px-4 font-medium">Monthly searches</th>
                <th className="py-2.5 px-4 font-medium">Page</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {keywords.map((kw, idx) => (
                <tr key={idx} className="hover:bg-accent/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">{kw.keyword}</td>
                  <td className="py-3 px-4 font-bold tabular-nums">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-foreground">#{kw.position}</span>
                      {kw.change > 0 && (
                        <span className="inline-flex items-center text-xs text-emerald-500">
                          <ArrowUp className="w-3 h-3" />
                          {kw.change}
                        </span>
                      )}
                      {kw.change < 0 && (
                        <span className="inline-flex items-center text-xs text-rose-500">
                          <ArrowDown className="w-3 h-3" />
                          {Math.abs(kw.change)}
                        </span>
                      )}
                      {kw.change === 0 && (
                        <span className="inline-flex items-center text-xs text-muted-foreground">
                          <Minus className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-foreground tabular-nums">
                    {kw.volume.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {kw.url}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
