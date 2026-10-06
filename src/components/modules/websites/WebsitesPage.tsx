import React from 'react';
import {
  Globe,
  ExternalLink,
  PlusCircle,
  Gauge,
  Users2,
  Clock,
  ShieldCheck,
  Server,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';
import { Button } from '../../ui/Button';
import { StatusBadge } from '../../ui/StatusBadge';
import { formatCompactNumber, formatDateTime, formatTimeAgo } from '../../../lib/utils';
import { Website } from '../../../types';

interface WebsitesPageProps {
  onNavigateTab: (tabId: string) => void;
  onRequestChangeForSite: (site: Website) => void;
}

export const WebsitesPage: React.FC<WebsitesPageProps> = ({
  onNavigateTab,
  onRequestChangeForSite,
}) => {
  const { currentTenant, websites } = useTenant();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">My Websites</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Production domains, edge routing, and Core Web Vitals health managed by LevelUp.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigateTab('requests')}
            icon={<PlusCircle className="w-3.5 h-3.5" />}
          >
            Request New Feature / Page
          </Button>
        </div>
      </div>

      {/* Website Cards Grid (1 col on mobile, 1 or 2 cols on tablet/desktop) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {websites.map((site) => (
          <div
            key={site.id}
            className="bg-[#0b0c10] border border-zinc-800 rounded-lg overflow-hidden shadow-xs flex flex-col justify-between transition-colors hover:border-zinc-700"
          >
            {/* Top Bar of Website Card */}
            <div className="p-4 sm:p-5 border-b border-zinc-800/80 bg-[#0f1015]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                      {site.name}
                    </h2>
                    <StatusBadge status={site.status} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1 font-mono">
                    <Globe className="w-3 h-3 text-violet-400 shrink-0" />
                    <span className="text-violet-300 font-medium truncate">{site.domain}</span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-zinc-400 text-[11px]">{site.framework}</span>
                  </div>
                </div>

                <a
                  href={site.preview_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors shrink-0 min-h-[32px] min-w-[32px] flex items-center justify-center"
                  title="Open live website in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Simulated Live Viewport Card Banner */}
            <div className="p-3.5 sm:p-5 bg-[#090a0e] border-b border-zinc-800/80">
              <div className="rounded-md border border-zinc-800 bg-[#0d0e14] p-3 sm:p-4 flex flex-col justify-between min-h-[100px] shadow-xs">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-zinc-700" />
                    <div className="w-2 h-2 rounded-full bg-zinc-700" />
                    <div className="w-2 h-2 rounded-full bg-zinc-700" />
                    <span className="text-[10px] font-mono text-zinc-400 ml-1 truncate max-w-[150px] sm:max-w-none">
                      https://{site.domain}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-zinc-900 text-emerald-400 border border-zinc-800 rounded">
                    HTTP/3 TLS 1.3
                  </span>
                </div>

                <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-300 gap-1.5">
                  <div>
                    <div className="text-[10px] text-zinc-400 uppercase font-mono">Routing</div>
                    <div className="font-semibold text-white font-mono text-xs">Vercel Edge Global Anycast</div>
                  </div>
                  {site.staging_domain && (
                    <div className="sm:text-right">
                      <div className="text-[10px] text-zinc-400 uppercase font-mono">Staging Sandbox</div>
                      <div className="font-mono text-violet-300 text-[11px] truncate max-w-[200px]">
                        {site.staging_domain}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Performance, Visitors & Care SLA Grid */}
            <div className="p-3.5 sm:p-4 grid grid-cols-3 gap-2 sm:gap-4 border-b border-zinc-800/80 text-center">
              <div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono flex items-center justify-center gap-1">
                  <Gauge className="w-3 h-3 text-emerald-400" />
                  <span>Vitals</span>
                </div>
                <div className="text-base sm:text-xl font-bold text-white font-mono mt-0.5 tabular-nums">
                  {site.performance_score}/100
                </div>
                <div className="text-[9px] sm:text-[10px] text-emerald-400 font-mono">Pass Grade</div>
              </div>

              <div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono flex items-center justify-center gap-1">
                  <Users2 className="w-3 h-3 text-sky-400" />
                  <span>Visitors</span>
                </div>
                <div className="text-base sm:text-xl font-bold text-white font-mono mt-0.5 tabular-nums">
                  {formatCompactNumber(site.visitors_30d)}
                </div>
                <div className="text-[9px] sm:text-[10px] text-sky-400 font-mono">+18% growth</div>
              </div>

              <div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-violet-400" />
                  <span>Care SLA</span>
                </div>
                <div className="text-base sm:text-xl font-bold text-violet-300 font-mono mt-0.5 uppercase">
                  {site.care_plan}
                </div>
                <div className="text-[9px] sm:text-[10px] text-zinc-400 font-mono">Active SLA</div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-3.5 sm:p-4 bg-[#090a0e] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-[11px] text-zinc-400 font-mono">
                Deployed <strong className="text-zinc-300">{formatTimeAgo(site.last_deployed_at)}</strong>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onNavigateTab('analytics')}
                >
                  Analytics
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onRequestChangeForSite(site)}
                  icon={<PlusCircle className="w-3.5 h-3.5" />}
                >
                  Request Changes
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cloudflare Edge Architecture Note */}
      <div className="p-3.5 rounded-lg border border-zinc-800 bg-[#0b0c10] text-xs text-zinc-400 flex items-start gap-2.5">
        <Server className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-semibold text-zinc-300">Edge Network Infrastructure</div>
          <p className="leading-relaxed text-[11px]">
            Websites are distributed across Cloudflare & Vercel edge networks with automated Brotli compression, AVIF image optimization, and DNSSEC encryption.
          </p>
        </div>
      </div>
    </div>
  );
};
