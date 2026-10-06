import React from 'react';
import { SearchCode, TrendingUp, ArrowUp, ArrowDown, Minus, CheckCircle, Globe } from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';
import { dataService } from '../../../services/dataService';
import { MetricCard } from '../../shared/MetricCard';

export const SeoPage: React.FC = () => {
  const { currentTenant } = useTenant();
  const keywords = dataService.getSeoKeywords(currentTenant.id);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="pb-3 sm:pb-4 border-b border-zinc-800">
        <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">Search Visibility & SEO</h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Google organic rankings, Core Web Vitals schema optimization, and keyword progression.
        </p>
      </div>

      {/* KPI Cards (3 cols tablet/desktop, 1 col mobile) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <MetricCard
          title="Google Index Health"
          value="100%"
          subValue="All routes indexed"
          change="Optimal"
          changeType="positive"
          icon={<Globe className="w-3.5 h-3.5 text-emerald-400" />}
        />
        <MetricCard
          title="Top 3 Rankings"
          value="14 Keywords"
          subValue="High buyer intent"
          change="+4 this month"
          changeType="positive"
          icon={<SearchCode className="w-3.5 h-3.5 text-violet-400" />}
        />
        <MetricCard
          title="Organic Velocity"
          value="+42.8%"
          subValue="6-month progression"
          change="Trending"
          changeType="positive"
          icon={<TrendingUp className="w-3.5 h-3.5 text-sky-400" />}
        />
      </div>

      {/* Tracked Keywords Container (Card list on mobile, Table on tablet/desktop) */}
      <div className="bg-[#0b0c10] border border-zinc-800 rounded-lg overflow-hidden shadow-xs">
        <div className="p-3.5 sm:p-4 border-b border-zinc-800 bg-[#0e0f14] flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 font-mono">
            Tracked Search Queries
          </h2>
          <span className="text-[10px] font-mono text-emerald-400">
            GSC Live Telemetry
          </span>
        </div>

        {/* Mobile View */}
        <div className="sm:hidden divide-y divide-zinc-800/60">
          {keywords.map((kw, idx) => (
            <div key={idx} className="p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">{kw.keyword}</span>
                <div className="flex items-center gap-1 font-mono text-xs font-bold text-white">
                  <span>#{kw.position}</span>
                  {kw.change > 0 && <span className="text-[10px] text-emerald-400">+{kw.change}</span>}
                  {kw.change < 0 && <span className="text-[10px] text-rose-400">{kw.change}</span>}
                </div>
              </div>
              <div className="text-[11px] font-mono text-violet-300 truncate">{kw.url}</div>
              <div className="text-[10px] text-zinc-400 font-mono">
                {kw.volume.toLocaleString()} searches/mo
              </div>
            </div>
          ))}
        </div>

        {/* Tablet & Desktop View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-mono uppercase text-[10px]">
                <th className="py-2.5 px-4 font-medium">Search Keyword</th>
                <th className="py-2.5 px-4 font-medium">Rank</th>
                <th className="py-2.5 px-4 font-medium">Monthly Volume</th>
                <th className="py-2.5 px-4 font-medium">Target URL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {keywords.map((kw, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">{kw.keyword}</td>
                  <td className="py-3 px-4 font-mono font-bold">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-white">#{kw.position}</span>
                      {kw.change > 0 && (
                        <span className="inline-flex items-center text-[10px] text-emerald-400">
                          <ArrowUp className="w-2.5 h-2.5" />+{kw.change}
                        </span>
                      )}
                      {kw.change < 0 && (
                        <span className="inline-flex items-center text-[10px] text-rose-400">
                          <ArrowDown className="w-2.5 h-2.5" />
                          {kw.change}
                        </span>
                      )}
                      {kw.change === 0 && (
                        <span className="inline-flex items-center text-[10px] text-zinc-500">
                          <Minus className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-zinc-300 font-mono tabular-nums">
                    {kw.volume.toLocaleString()} searches
                  </td>
                  <td className="py-3 px-4 text-violet-300 font-mono text-[11px]">
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
