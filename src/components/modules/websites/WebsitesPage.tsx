import React from 'react';
import {
  Globe,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';
import { Button } from '../../ui/Button';
import { StatusBadge } from '../../ui/StatusBadge';
import { formatTimeAgo } from '../../../lib/utils';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-border">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">My websites</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Websites and domains for {currentTenant.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigateTab('requests')}
            icon={<PlusCircle className="w-3.5 h-3.5" />}
          >
            Request a change
          </Button>
        </div>
      </div>

      {/* Website Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {websites.map((site) => (
          <div
            key={site.id}
            className="bg-card border border-border rounded-lg overflow-hidden shadow-xs flex flex-col justify-between transition-colors hover:border-border/80"
          >
            {/* Top Bar of Website Card */}
            <div className="p-4 sm:p-5 border-b border-border/80 bg-muted/30">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-sm sm:text-base font-bold text-foreground tracking-tight truncate">
                      {site.name}
                    </h2>
                    <StatusBadge status={site.status} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-foreground font-medium truncate">{site.domain}</span>
                  </div>
                </div>

                <a
                  href={site.preview_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-md bg-card border border-border text-xs font-medium text-foreground hover:bg-accent/50 transition-colors shrink-0 inline-flex items-center gap-1.5"
                >
                  <span>View website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Domain & Staging Info */}
            <div className="p-4 sm:p-5 bg-card border-b border-border/80">
              <div className="rounded-md border border-border bg-muted/20 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="text-muted-foreground">Primary domain</div>
                  <div className="font-medium text-foreground mt-0.5">https://{site.domain}</div>
                </div>
                {site.staging_domain && (
                  <div className="sm:text-right">
                    <div className="text-muted-foreground">Preview domain</div>
                    <div className="text-foreground mt-0.5 truncate max-w-[220px]">
                      {site.staging_domain}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Website performance, Website traffic & Subscription */}
            <div className="p-4 grid grid-cols-3 gap-3 border-b border-border/80 bg-card">
              <div>
                <div className="text-xs text-muted-foreground">Website performance</div>
                <div className="text-lg font-bold text-foreground mt-1 tabular-nums">
                  {site.performance_score} / 100
                </div>
                <div className="text-xs text-emerald-500 mt-0.5">Excellent</div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground">Website traffic</div>
                <div className="text-lg font-bold text-foreground mt-1 tabular-nums">
                  {site.visitors_30d.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">last 30 days</div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground">Subscription</div>
                <div className="text-lg font-bold text-foreground mt-1 capitalize">
                  {site.care_plan}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">Active</div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-3.5 sm:p-4 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                Last updated <strong className="text-foreground">{formatTimeAgo(site.last_deployed_at)}</strong>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onNavigateTab('analytics')}
                >
                  View analytics
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onRequestChangeForSite(site)}
                  icon={<PlusCircle className="w-3.5 h-3.5" />}
                >
                  Request a change
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
