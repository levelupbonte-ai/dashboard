import React, { useState } from 'react';
import {
  Globe,
  ExternalLink,
  GitBranch,
  GitCommit,
  Clock,
  RotateCw,
  Maximize2,
  Monitor,
  Tablet,
  Smartphone,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Website, Tenant } from '../../../types';
import { formatTimeAgo } from '../../../lib/utils';
import { Button } from '../../ui/Button';

interface VercelDeploymentCardProps {
  site: Website;
  tenant: Tenant;
  onNavigateTab: (tabId: string, subTab?: string) => void;
  onRequestChangeForSite: (site: Website) => void;
  onOpenFullPreviewModal?: (site: Website) => void;
}

export const VercelDeploymentCard: React.FC<VercelDeploymentCardProps> = ({
  site,
  tenant,
  onNavigateTab,
  onRequestChangeForSite,
  onOpenFullPreviewModal,
}) => {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [iframeFailed, setIframeFailed] = useState<boolean>(false);

  const handleReload = () => {
    setIsLoading(true);
    setIframeFailed(false);
    setIframeKey((prev) => prev + 1);
  };

  const viewportWidths = {
    desktop: 'w-full',
    tablet: 'w-[420px]',
    mobile: 'w-[280px]',
  };

  return (
    <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-xs hover:border-border transition-colors">
      {/* Top Header */}
      <div className="px-5 py-3.5 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-muted/20">
        <div className="flex items-center gap-2.5">
          <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
            <span>Production Deployment</span>
            <span className="font-mono text-[11px] font-normal text-muted-foreground px-2 py-0.5 rounded bg-muted border border-border/60">
              {site.name}
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <a
            href={site.preview_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-border/60"
          >
            <span>Visit domain</span>
            <ArrowUpRight className="size-3" />
          </a>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateTab('website-control')}
          >
            Manage Content
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onRequestChangeForSite(site)}
            icon={<Sparkles className="size-3" />}
          >
            Request Change
          </Button>
        </div>
      </div>

      {/* Main Grid: Left iFrame / Preview - Right Deployment Specs (Vercel Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border/60">
        {/* Left Column: Interactive Browser Frame with iFrame */}
        <div className="lg:col-span-7 p-4 sm:p-5 flex flex-col justify-between bg-muted/10">
          {/* Browser Chrome Bar */}
          <div className="rounded-t-lg bg-card border border-border border-b-0 px-3.5 py-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
            {/* macOS-style subtle window dots */}
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-rose-500/80" />
              <span className="size-2.5 rounded-full bg-amber-500/80" />
              <span className="size-2.5 rounded-full bg-emerald-500/80" />
            </div>

            {/* Address Bar */}
            <div className="flex-1 max-w-sm mx-auto flex items-center justify-center gap-1.5 px-3 py-1 rounded bg-muted/60 border border-border/50 text-[11px] font-mono text-foreground truncate select-all">
              <Globe className="size-3 text-emerald-500 shrink-0" />
              <span className="truncate">https://{site.domain}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
              {/* Viewport Toggles */}
              <div className="hidden sm:flex items-center gap-0.5 p-0.5 rounded bg-muted border border-border/60">
                <button
                  type="button"
                  onClick={() => setViewport('desktop')}
                  className={`p-1 rounded transition-colors ${
                    viewport === 'desktop'
                      ? 'bg-background text-foreground shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="size-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewport('tablet')}
                  className={`p-1 rounded transition-colors ${
                    viewport === 'tablet'
                      ? 'bg-background text-foreground shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title="Tablet View"
                >
                  <Tablet className="size-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewport('mobile')}
                  className={`p-1 rounded transition-colors ${
                    viewport === 'mobile'
                      ? 'bg-background text-foreground shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="size-3" />
                </button>
              </div>

              {/* Refresh button */}
              <button
                type="button"
                onClick={handleReload}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Reload iFrame"
              >
                <RotateCw className="size-3" />
              </button>

              {/* Fullscreen modal toggle */}
              {onOpenFullPreviewModal && (
                <button
                  type="button"
                  onClick={() => onOpenFullPreviewModal(site)}
                  className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Expand to Fullscreen Preview"
                >
                  <Maximize2 className="size-3" />
                </button>
              )}
            </div>
          </div>

          {/* Browser Viewport with Live iFrame */}
          <div className="relative rounded-b-lg border border-border bg-[#0a0a0c] h-72 sm:h-84 overflow-hidden flex items-center justify-center">
            {/* Viewport Container */}
            <div
              className={`h-full transition-all duration-300 relative flex items-center justify-center ${viewportWidths[viewport]}`}
            >
              {/* Live iframe */}
              <iframe
                key={iframeKey}
                src={site.preview_url}
                title={`${site.name} Live Preview`}
                className="w-full h-full border-0 bg-background"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                loading="lazy"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setIframeFailed(true);
                }}
              />

              {/* Graceful fallback if embed is restricted by CSP or X-Frame-Options */}
              {iframeFailed && (
                <div className="absolute inset-0 bg-background/95 p-6 flex flex-col items-center justify-center text-center">
                  <Globe className="size-8 text-primary mb-2" />
                  <div className="text-xs font-semibold text-foreground">Interactive Preview Ready</div>
                  <p className="text-[11px] text-muted-foreground max-w-xs mt-1">
                    Direct iframe security headers are active on {site.domain}. Open the high-fidelity preview modal or visit the live domain.
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onOpenFullPreviewModal?.(site)}
                    >
                      Open Full Preview
                    </Button>
                    <a
                      href={site.preview_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-md border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors inline-flex items-center gap-1"
                    >
                      <span>Visit Site</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* Loading Shimmer */}
              {isLoading && !iframeFailed && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-2xs flex flex-col items-center justify-center gap-2 pointer-events-none">
                  <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-[11px] text-muted-foreground font-mono">Loading live website...</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Footer hint */}
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="size-3 text-emerald-500" />
              <span>Edge CDN synced · SSL active</span>
            </span>
            <span>Click inside preview to interact</span>
          </div>
        </div>

        {/* Right Column: Vercel Deployment Specifications */}
        <div className="lg:col-span-5 p-5 space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
            Deployment Specifications
          </div>

          <div className="space-y-4 text-xs">
            {/* Created By */}
            <div className="space-y-1">
              <span className="text-muted-foreground text-[11px] font-medium">Created</span>
              <div className="flex items-center gap-2.5">
                <div className="size-6 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                  {tenant.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex items-baseline gap-1.5 truncate">
                  <span className="font-semibold text-foreground truncate">
                    {tenant.company_email.split('@')[0]}
                  </span>
                  <span className="text-muted-foreground text-[11px] shrink-0">
                    {formatTimeAgo(site.last_deployed_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-1">
              <span className="text-muted-foreground text-[11px] font-medium">Build Duration</span>
              <div className="flex items-center gap-2 text-foreground font-mono">
                <Clock className="size-3.5 text-muted-foreground" />
                <span className="font-semibold">24s</span>
                <span className="text-muted-foreground text-[11px]">
                  ({formatTimeAgo(site.last_deployed_at)})
                </span>
              </div>
            </div>

            {/* Domains */}
            <div className="space-y-1.5">
              <span className="text-muted-foreground text-[11px] font-medium">Domains</span>
              <div className="space-y-1.5">
                {/* Production domain */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/60">
                  <div className="flex items-center gap-2 truncate">
                    <GitBranch className="size-3.5 text-emerald-500 shrink-0" />
                    <a
                      href={`https://${site.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-foreground hover:underline truncate"
                    >
                      {site.domain}
                    </a>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">
                    Production
                  </span>
                </div>

                {/* Staging preview domain if available */}
                {site.staging_domain && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/20 border border-border/40">
                    <div className="flex items-center gap-2 truncate">
                      <GitCommit className="size-3.5 text-muted-foreground shrink-0" />
                      <a
                        href={`https://${site.staging_domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground hover:underline truncate"
                      >
                        {site.staging_domain}
                      </a>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border/60 shrink-0">
                      Staging
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Source / Git Commit */}
            <div className="space-y-1">
              <span className="text-muted-foreground text-[11px] font-medium">Source</span>
              <div className="flex items-center gap-2 text-muted-foreground font-mono">
                <GitBranch className="size-3.5 text-foreground shrink-0" />
                <span className="font-semibold text-foreground">main</span>
                <span>·</span>
                <GitCommit className="size-3.5 shrink-0" />
                <span className="text-foreground">97a1c45</span>
                <span className="truncate text-muted-foreground hidden sm:inline">
                  feat: deploy real-time ecosystem control center
                </span>
              </div>
            </div>

            {/* Environment & Architecture */}
            <div className="pt-2 border-t border-border/60 grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-muted-foreground">Framework</span>
                <div className="font-semibold text-foreground mt-0.5">{site.framework}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Performance Score</span>
                <div className="font-semibold text-emerald-500 mt-0.5 flex items-center gap-1">
                  <Zap className="size-3" />
                  <span>{site.performance_score} / 100</span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">SEO Indexing</span>
                <div className="font-semibold text-foreground mt-0.5">{site.seo_score} / 100</div>
              </div>
              <div>
                <span className="text-muted-foreground">LevelUp SLA</span>
                <div className="font-semibold text-foreground mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="size-3 text-emerald-500" />
                  <span className="capitalize">{site.care_plan} Plan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
