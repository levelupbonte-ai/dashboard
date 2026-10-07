import React, { useState } from 'react';
import {
  Globe,
  ExternalLink,
  Sparkles,
  Info,
  Layout,
  Image,
  Utensils,
  Briefcase,
  ShoppingBag,
  Users,
  Camera,
  Megaphone,
  BookOpen,
  HelpCircle,
  Menu as MenuIcon,
  History,
  Monitor,
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';
import { useAuth } from '../../../context/AuthContext';
import { determineWebsiteType } from '../../../lib/dashboardEngine';
import { websiteDataService } from '../../../services/websiteDataService';
import { WebsiteInfoEditor } from './WebsiteInfoEditor';
import { HomepageHeroEditor } from './HomepageHeroEditor';
import { MediaManager } from './MediaManager';
import { ServicesManager } from './ServicesManager';
import { MenuManager } from './MenuManager';
import { ProductsManager } from './ProductsManager';
import { TeamManager } from './TeamManager';
import { GalleryManager } from './GalleryManager';
import { AnnouncementsManager } from './AnnouncementsManager';
import { BlogManager } from './BlogManager';
import { FaqManager } from './FaqManager';
import { NavigationManager } from './NavigationManager';
import { LiveWebsitePreviewModal } from './LiveWebsitePreviewModal';
import { StatusBadge } from '../../ui/StatusBadge';

interface WebsiteControlCenterProps {
  initialSubTab?: string;
  onRequestChange: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const WebsiteControlCenter: React.FC<WebsiteControlCenterProps> = ({
  initialSubTab = 'info',
  onRequestChange,
}) => {
  const { currentTenant, websites, activeWebsite, setActiveWebsite } = useTenant();
  const { orgRole } = useAuth();
  const isReadOnly = orgRole === 'VIEWER';

  const site = activeWebsite || websites[0];
  const type = determineWebsiteType(currentTenant, site);

  const [activeSubTab, setActiveSubTab] = useState<string>(initialSubTab);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);

  // Sync sub tab if initialSubTab prop changes
  React.useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  if (!site) {
    return (
      <div className="p-8 text-center text-muted-foreground text-xs">
        No active website found for this organization.
      </div>
    );
  }

  const auditLogs = websiteDataService.getAuditLogs(currentTenant.id);

  // Sub-navigation definition adapted dynamically to website type
  const tabs = [
    { id: 'info', label: 'Business Info', icon: Info },
    { id: 'homepage', label: 'Homepage & Hero', icon: Layout },
    { id: 'media', label: 'Media Library', icon: Image },
    ...(type === 'restaurant'
      ? [{ id: 'menu', label: 'Food & Wine Menu', icon: Utensils }]
      : []),
    ...(type === 'clinic' || type === 'corporate'
      ? [{ id: 'services', label: 'Services', icon: Briefcase }]
      : []),
    ...(type === 'ecommerce'
      ? [{ id: 'products', label: 'Products & Store', icon: ShoppingBag }]
      : []),
    ...(type === 'clinic' || type === 'corporate'
      ? [{ id: 'team', label: 'Team & Staff', icon: Users }]
      : []),
    ...(type === 'restaurant' || type === 'clinic' || type === 'portfolio'
      ? [{ id: 'gallery', label: 'Photo Gallery', icon: Camera }]
      : []),
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    ...(type === 'clinic' || type === 'corporate'
      ? [{ id: 'blog', label: 'Editorial Journal', icon: BookOpen }]
      : []),
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'navigation', label: 'Navigation Menu', icon: MenuIcon },
    { id: 'audit', label: 'Audit History', icon: History },
  ];

  const renderActiveTabContent = () => {
    switch (activeSubTab) {
      case 'info':
        return <WebsiteInfoEditor website={site} isReadOnly={isReadOnly} />;
      case 'homepage':
        return <HomepageHeroEditor website={site} isReadOnly={isReadOnly} />;
      case 'media':
        return (
          <MediaManager
            website={site}
            tenantId={currentTenant.id}
            isReadOnly={isReadOnly}
          />
        );
      case 'menu':
        return (
          <MenuManager
            website={site}
            tenantId={currentTenant.id}
            isReadOnly={isReadOnly}
          />
        );
      case 'services':
        return (
          <ServicesManager
            website={site}
            tenantId={currentTenant.id}
            isReadOnly={isReadOnly}
          />
        );
      case 'products':
        return (
          <ProductsManager
            website={site}
            tenantId={currentTenant.id}
            isReadOnly={isReadOnly}
          />
        );
      case 'team':
        return (
          <TeamManager
            website={site}
            tenantId={currentTenant.id}
            isReadOnly={isReadOnly}
          />
        );
      case 'gallery':
        return (
          <GalleryManager
            website={site}
            tenantId={currentTenant.id}
            isReadOnly={isReadOnly}
          />
        );
      case 'announcements':
        return (
          <AnnouncementsManager
            website={site}
            tenantId={currentTenant.id}
            isReadOnly={isReadOnly}
          />
        );
      case 'blog':
        return (
          <BlogManager
            website={site}
            tenantId={currentTenant.id}
            isReadOnly={isReadOnly}
          />
        );
      case 'faqs':
        return (
          <FaqManager
            website={site}
            tenantId={currentTenant.id}
            isReadOnly={isReadOnly}
          />
        );
      case 'navigation':
        return (
          <NavigationManager
            website={site}
            tenantId={currentTenant.id}
            isReadOnly={isReadOnly}
          />
        );
      case 'audit':
        return (
          <div className="bg-card border border-border rounded-lg p-5 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Audit Log & Publication History</h3>
              <p className="text-xs text-muted-foreground">
                Immutable chronological log of all content updates published to your website.
              </p>
            </div>

            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-md bg-muted/20 border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-foreground">{log.action}</div>
                    <div className="text-[11px] text-muted-foreground">
                      Target: <span className="text-foreground">{log.target}</span> · By {log.actor_name} ({log.actor_role})
                    </div>
                  </div>

                  <div className="text-[10px] text-muted-foreground font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <WebsiteInfoEditor website={site} isReadOnly={isReadOnly} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Website Header Bar */}
      <div className="bg-card border border-border rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <Globe className="size-4" />
            </div>

            {/* If tenant has multiple websites, offer a clean selector */}
            {websites.length > 1 ? (
              <select
                value={site.id}
                onChange={(e) => {
                  const target = websites.find((w) => w.id === e.target.value);
                  if (target) setActiveWebsite(target);
                }}
                className="font-bold text-base sm:text-lg bg-transparent text-foreground border-b border-border/60 pb-0.5 focus:outline-hidden cursor-pointer"
              >
                {websites.map((w) => (
                  <option key={w.id} value={w.id} className="bg-card text-foreground">
                    {w.name}
                  </option>
                ))}
              </select>
            ) : (
              <h2 className="font-bold text-base sm:text-lg text-foreground tracking-tight">
                {site.name}
              </h2>
            )}

            <StatusBadge status={site.status} />

            <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
              {site.domain}
            </span>
          </div>

          <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-3">
            <span>Production Architecture: <strong className="text-foreground">{site.framework}</strong></span>
            <span>·</span>
            <span>Performance Score: <strong className="text-emerald-500">{site.performance_score}/100</strong></span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Live Interactive Preview */}
          <button
            type="button"
            onClick={() => setIsPreviewModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs"
          >
            <Monitor className="size-3.5" />
            <span>Interactive Preview</span>
          </button>

          {/* Request Structural Change */}
          <button
            type="button"
            onClick={onRequestChange}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-card text-foreground hover:bg-muted text-xs font-medium transition-colors"
          >
            <Sparkles className="size-3.5 text-primary" />
            <span>Request Code Change</span>
          </button>

          {/* Visit Live Site */}
          <a
            href={site.preview_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-muted-foreground hover:text-foreground text-xs transition-colors"
            title="Open Live Website"
          >
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>

      {/* 2. Sub Navigation Bar */}
      <div className="border-b border-border/80 flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-t-md text-xs whitespace-nowrap transition-colors border-b-2 font-medium ${
                isActive
                  ? 'border-primary text-foreground bg-accent/40 font-semibold'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/20'
              }`}
            >
              <Icon className="size-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Main Content Panel */}
      <div className="animate-in fade-in duration-150">
        {renderActiveTabContent()}
      </div>

      {/* 4. Live Interactive Website Preview Modal */}
      <LiveWebsitePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        website={site}
        tenant={currentTenant}
        onRequestChange={onRequestChange}
      />
    </div>
  );
};
