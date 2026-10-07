import React, { useState } from 'react';
import {
  Globe,
  PlusCircle,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';
import { Button } from '../../ui/Button';
import { Website } from '../../../types';
import { VercelDeploymentCard } from './VercelDeploymentCard';
import { LiveWebsitePreviewModal } from '../website/LiveWebsitePreviewModal';

interface WebsitesPageProps {
  onNavigateTab: (tabId: string, subTab?: string) => void;
  onRequestChangeForSite: (site: Website) => void;
}

export const WebsitesPage: React.FC<WebsitesPageProps> = ({
  onNavigateTab,
  onRequestChangeForSite,
}) => {
  const { currentTenant, websites } = useTenant();
  const [selectedPreviewSite, setSelectedPreviewSite] = useState<Website | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <span>Website Deployments & Live Preview</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Real-time web infrastructure, active domains, and live interactive rendering for {currentTenant.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateTab('website-control')}
            icon={<Globe className="size-3.5 text-primary" />}
          >
            Website Control Center
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigateTab('requests')}
            icon={<PlusCircle className="size-3.5" />}
          >
            Request Code Change
          </Button>
        </div>
      </div>

      {/* Website Cards with Vercel-Style Live iframe & Deployment Specs */}
      <div className="space-y-6">
        {websites.map((site) => (
          <VercelDeploymentCard
            key={site.id}
            site={site}
            tenant={currentTenant}
            onNavigateTab={onNavigateTab}
            onRequestChangeForSite={onRequestChangeForSite}
            onOpenFullPreviewModal={(s) => setSelectedPreviewSite(s)}
          />
        ))}
      </div>

      {/* Fullscreen High-Fidelity Preview Modal */}
      {selectedPreviewSite && (
        <LiveWebsitePreviewModal
          isOpen={Boolean(selectedPreviewSite)}
          onClose={() => setSelectedPreviewSite(null)}
          website={selectedPreviewSite}
          tenant={currentTenant}
          onRequestChange={() => {
            const siteToRequest = selectedPreviewSite;
            setSelectedPreviewSite(null);
            onRequestChangeForSite(siteToRequest);
          }}
        />
      )}
    </div>
  );
};
