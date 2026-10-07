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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
            My websites
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
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

      {/* Website Cards */}
      <div className="space-y-5">
        {websites.map((site) => (
          <div
            key={site.id}
            className="bg-card border border-border/60 rounded-xl p-5 sm:p-6 shadow-2xs space-y-6"
          >
            {/* Top grid: Preview Box on Left, Aligned Metadata on Right (Vercel style) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              {/* Left Website Preview Card */}
              <div className="lg:col-span-5 rounded-lg border border-border/50 bg-muted/30 p-5 flex flex-col justify-between h-52 sm:h-56">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Globe className="w-3.5 h-3.5" />
                    <span className="font-medium text-foreground">{site.domain}</span>
                  </div>
                  <StatusBadge status={site.status} />
                </div>

                <div className="space-y-1">
                  <div className="text-base font-semibold text-foreground tracking-tight">
                    {site.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    https://{site.domain}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/40 text-xs">
                  <span className="text-muted-foreground">
                    Updated {formatTimeAgo(site.last_deployed_at)}
                  </span>
                  <a
                    href={site.preview_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-foreground hover:underline"
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Right Aligned Metadata Columns */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Last updated</div>
                  <div className="text-sm font-medium text-foreground">
                    {formatTimeAgo(site.last_deployed_at)}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-1">Status</div>
                  <div>
                    <StatusBadge status={site.status} />
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-1">Website performance</div>
                  <div className="text-sm font-medium text-foreground tabular-nums">
                    {site.performance_score} / 100 · <span className="text-emerald-500">99.99% uptime</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-1">Subscription</div>
                  <div className="text-sm font-medium text-foreground capitalize">
                    {site.care_plan} plan
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <div className="text-xs text-muted-foreground">Domains</div>
                  <div className="text-sm font-medium text-foreground">
                    https://{site.domain}
                  </div>
                  {site.staging_domain && (
                    <div className="text-xs text-muted-foreground">
                      https://{site.staging_domain}
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2 pt-2 flex flex-wrap items-center gap-2.5">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onNavigateTab('analytics')}
                  >
                    Website traffic ({site.visitors_30d.toLocaleString()} visits)
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
          </div>
        ))}
      </div>
    </div>
  );
};
