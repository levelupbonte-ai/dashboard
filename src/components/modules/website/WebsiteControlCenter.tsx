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
  Maximize2,
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

interface WebsiteControlCenterProps {
  initialSubTab?: string;
  onRequestChange: () => void;
  onNavigateTab: (tabId: string, subTab?: string) => void;
}

export const WebsiteControlCenter: React.FC<WebsiteControlCenterProps> = ({
  initialSubTab = 'homepage',
  onRequestChange,
}) => {
  const { currentTenant, websites, activeWebsite, setActiveWebsite } = useTenant();
  const { orgRole } = useAuth();
  const isReadOnly = orgRole === 'VIEWER';

  const site = activeWebsite || websites[0];
  const type = determineWebsiteType(currentTenant, site);

  const [activeSubTab, setActiveSubTab] = useState<string>(initialSubTab || 'homepage');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);

  // Sync sub tab if initialSubTab prop changes
  React.useEffect(() => {
    if (initialSubTab && initialSubTab !== 'preview') {
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

  // Clean sub-navigation tabs for website content management
  const tabs = [
    { id: 'homepage', label: 'Pages & Content', icon: Layout },
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
    { id: 'info', label: 'Business Details', icon: Info },
    { id: 'navigation', label: 'Navigation Menu', icon: MenuIcon },
    { id: 'audit', label: 'Audit History', icon: History },
  ];

  const renderActiveTabContent = () => {
    switch (activeSubTab) {
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
      case 'info':
        return <WebsiteInfoEditor website={site} isReadOnly={isReadOnly} />;
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
        return <HomepageHeroEditor website={site} isReadOnly={isReadOnly} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Website Header with Compact Embedded Preview Screen ("Petit Écran de Preview") */}
      <div className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Site Info, Metrics & Actions */}
        <div className="space-y-3 flex-1 min-w-0">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* If tenant has multiple websites, offer a clean selector */}
              {websites.length > 1 ? (
                <select
                  value={site.id}
                  onChange={(e) => {
                    const target = websites.find((w) => w.id === e.target.value);
                    if (target) setActiveWebsite(target);
                  }}
                  className="font-bold text-base sm:text-xl bg-transparent text-foreground border-b border-border/60 pb-0.5 focus:outline-hidden cursor-pointer"
                >
                  {websites.map((w) => (
                    <option key={w.id} value={w.id} className="bg-card text-foreground">
                      {w.name}
                    </option>
                  ))}
                </select>
              ) : (
                <h2 className="font-bold text-base sm:text-xl text-foreground tracking-tight truncate">
                  {site.name}
                </h2>
              )}

              <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border shrink-0">
                {site.domain}
              </span>
            </div>

            <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-2 pt-0.5">
              <span>Framework: <strong className="text-foreground font-medium">Next.js 16 + Tailwind</strong></span>
              <span>·</span>
              <span>Core Vitals: <strong className="text-emerald-500 font-mono font-semibold">{site.performance_score}/100</strong></span>
              <span>·</span>
              <span>SEO Index: <strong className="text-foreground font-mono font-semibold">{site.seo_score}/100</strong></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={onRequestChange}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs"
            >
              <Sparkles className="size-3.5 text-primary" />
              <span>Request Code Change</span>
            </button>

            <a
              href={site.preview_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-border bg-card text-foreground hover:bg-muted text-xs font-medium transition-colors"
              title="Open site in new tab"
            >
              <span>Visit</span>
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>

        {/* Right: Le Petit Écran de Preview Embed (Compact Live Interactive Frame) */}
        <div
          onClick={() => setIsPreviewModalOpen(true)}
          className="relative w-full sm:w-72 md:w-80 aspect-[16/10] bg-[#07080c] border border-border/80 rounded-lg overflow-hidden shadow-md cursor-pointer group shrink-0 hover:border-foreground/40 transition-all"
          title="Click to expand Live Preview"
        >
          {/* Mini browser top bar with macOS dots */}
          <div className="h-6 bg-muted/60 border-b border-border/60 px-2.5 flex items-center justify-between text-[10px] text-muted-foreground select-none">
            <div className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-rose-500/80" />
              <span className="size-1.5 rounded-full bg-amber-500/80" />
              <span className="size-1.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="font-mono text-[9px] text-muted-foreground/80 truncate max-w-[130px]">
              {site.domain}
            </span>
            <ExternalLink className="size-2.5 opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Scaled Live iFrame Rendering */}
          <div className="w-[1280px] h-[800px] origin-top-left transform scale-[0.23] sm:scale-[0.24] md:scale-[0.25] pointer-events-none select-none bg-background">
            <iframe
              src={site.preview_url}
              title={`${site.name} Preview`}
              className="w-full h-full border-0 bg-background"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              loading="lazy"
            />
          </div>

          {/* Subtle Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 backdrop-blur-2xs">
            <div className="px-2.5 py-1 rounded-md bg-background/90 text-foreground text-[11px] font-medium border border-border/80 flex items-center gap-1 shadow-md">
              <Maximize2 className="size-3 text-primary" />
              <span>Expand Preview</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub Navigation Bar (Content Sections) */}
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

      {/* 3. Main Content Editor Panel */}
      <div className="animate-in fade-in duration-150">
        {renderActiveTabContent()}
      </div>

      {/* 4. Fullscreen Interactive Preview Modal */}
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
