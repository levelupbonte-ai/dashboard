import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Tablet,
  Monitor,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Website, Tenant } from '../../../types';
import { websiteDataService } from '../../../services/websiteDataService';

interface LiveWebsitePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  website: Website;
  tenant: Tenant;
  onRequestChange: () => void;
}

export const LiveWebsitePreviewModal: React.FC<LiveWebsitePreviewModalProps> = ({
  isOpen,
  onClose,
  website,
  tenant,
  onRequestChange,
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!isOpen) return null;

  const info = websiteDataService.getInformation(website.id);
  const hero = websiteDataService.getHomepage(website.id);
  const services = websiteDataService.getServices(website.id).filter((s) => s.status === 'published');
  const menuItems = websiteDataService.getMenuItems(website.id).filter((m) => m.status === 'published');
  const products = websiteDataService.getProducts(website.id).filter((p) => p.status === 'published');
  const announcements = websiteDataService.getAnnouncements(website.id).filter((a) => a.status === 'published');
  const navItems = websiteDataService.getNavItems(website.id).filter((n) => n.status === 'published');

  const activeAnnouncement = announcements[0];

  const getContainerWidth = () => {
    switch (device) {
      case 'mobile':
        return 'max-w-[390px]';
      case 'tablet':
        return 'max-w-[768px]';
      case 'desktop':
      default:
        return 'max-w-5xl';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-md animate-in fade-in duration-150">
      {/* Top Preview Bar */}
      <div className="h-14 border-b border-border bg-card px-4 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">{website.name}</span>
            <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
              {website.domain}
            </span>
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          {/* Device Toggles */}
          <div className="hidden sm:flex items-center gap-1 bg-muted/60 p-1 rounded-md border border-border">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded transition-colors ${
                device === 'desktop'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Desktop preview"
            >
              <Monitor className="size-3.5" />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-1.5 rounded transition-colors ${
                device === 'tablet'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Tablet preview"
            >
              <Tablet className="size-3.5" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded transition-colors ${
                device === 'mobile'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Mobile preview"
            >
              <Smartphone className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onClose();
              onRequestChange();
            }}
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border text-xs text-foreground hover:bg-accent transition-colors"
          >
            <Sparkles className="size-3.5 text-primary" />
            <span>Request Structural Change</span>
          </button>

          <a
            href={website.preview_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted text-foreground hover:bg-accent text-xs font-medium border border-border transition-colors"
          >
            <span>Visit Live URL</span>
            <ExternalLink className="size-3" />
          </a>

          <button
            onClick={onClose}
            className="size-8 rounded-md text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
            aria-label="Close Preview"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Preview Viewport Frame */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center bg-muted/20">
        <div
          className={`w-full ${getContainerWidth()} bg-background border border-border rounded-lg shadow-2xl flex flex-col overflow-hidden transition-all duration-300 min-h-[680px] h-fit mb-12`}
        >
          {/* Announcement Banner if active */}
          {hero?.announcement_banner_active && (hero?.announcement_banner_text || activeAnnouncement) && (
            <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 text-center text-xs font-medium text-primary">
              {hero.announcement_banner_text || activeAnnouncement?.message}
            </div>
          )}

          {/* Website Header */}
          <header className="px-6 py-4 border-b border-border/60 flex items-center justify-between gap-4 bg-background/80 backdrop-blur-xs sticky top-0 z-20">
            <div className="flex items-center gap-3">
              {info?.logo_url ? (
                <img
                  src={info.logo_url}
                  alt={info.business_name}
                  className="size-7 rounded object-cover border border-border"
                />
              ) : null}
              <div>
                <span className="font-bold text-sm tracking-tight text-foreground block">
                  {info?.business_name || tenant.name}
                </span>
                {info?.tagline && (
                  <span className="text-[10px] text-muted-foreground hidden sm:block">
                    {info.tagline}
                  </span>
                )}
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-4 text-xs font-medium text-muted-foreground">
              {navItems.map((item) => (
                <span key={item.id} className="hover:text-foreground transition-colors cursor-pointer">
                  {item.label}
                </span>
              ))}
            </nav>

            {hero?.primary_cta_label && (
              <button className="px-3 py-1.5 rounded-md bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity">
                {hero.primary_cta_label}
              </button>
            )}
          </header>

          {/* Website Hero Section */}
          <section className="px-6 py-12 sm:py-16 text-center max-w-3xl mx-auto space-y-4">
            {hero?.hero_badge && (
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-muted border border-border text-foreground">
                {hero.hero_badge}
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              {hero?.hero_headline || 'Elevating Your Digital Experience'}
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {hero?.hero_description || info?.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              {hero?.primary_cta_label && (
                <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs">
                  {hero.primary_cta_label}
                </button>
              )}
              {hero?.secondary_cta_label && (
                <button className="px-4 py-2 rounded-md border border-border text-foreground hover:bg-muted text-xs font-medium transition-colors">
                  {hero.secondary_cta_label}
                </button>
              )}
            </div>

            {hero?.hero_image_url && (
              <div className="pt-6">
                <img
                  src={hero.hero_image_url}
                  alt="Hero Preview"
                  className="rounded-lg border border-border w-full max-h-72 object-cover shadow-md"
                />
              </div>
            )}
          </section>

          {/* Dynamic Content Preview Section based on website features */}
          {/* 1. Services for Clinic/Corporate */}
          {services.length > 0 && (
            <section className="px-6 py-8 border-t border-border/60 bg-muted/20">
              <div className="text-center mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Featured Services
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-3.5 rounded-md bg-card border border-border flex items-start justify-between gap-3 shadow-xs"
                  >
                    <div>
                      <div className="text-xs font-semibold text-foreground">{srv.name}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                        {srv.description}
                      </div>
                      <div className="mt-2 text-[10px] text-muted-foreground">
                        {srv.duration_minutes} min consultation
                      </div>
                    </div>
                    <div className="text-xs font-bold text-foreground shrink-0">
                      ${srv.price}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 2. Menu for Restaurants */}
          {menuItems.length > 0 && (
            <section className="px-6 py-8 border-t border-border/60 bg-muted/20">
              <div className="text-center mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Evening Tasting & Hearth Menu
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-md bg-card border border-border flex items-start justify-between gap-3 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-foreground">{item.name}</span>
                        {item.dietary?.includes('chef_special') && (
                          <span className="text-[9px] px-1 py-0.2 bg-amber-500/10 text-amber-500 rounded border border-amber-500/20">
                            Chef Special
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {item.description}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-foreground shrink-0">
                      ${item.price}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 3. Products for E-Commerce */}
          {products.length > 0 && (
            <section className="px-6 py-8 border-t border-border/60 bg-muted/20">
              <div className="text-center mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Featured Products & Capsule
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3 rounded-md bg-card border border-border flex items-center gap-3 shadow-xs"
                  >
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      className="size-14 rounded object-cover border border-border shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-foreground truncate">{prod.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{prod.sku}</div>
                      <div className="text-xs font-bold text-foreground mt-1">${prod.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Website Footer Info */}
          <footer className="mt-auto px-6 py-6 border-t border-border bg-card/60 text-xs text-muted-foreground space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="font-semibold text-foreground">{info?.business_name || tenant.name}</span>
                <p className="text-[11px] mt-0.5">{info?.tagline}</p>
              </div>

              <div className="flex flex-wrap gap-4 text-[11px]">
                {info?.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="size-3 text-primary" />
                    <span>{info.phone}</span>
                  </div>
                )}
                {info?.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="size-3 text-primary" />
                    <span>{info.email}</span>
                  </div>
                )}
                {info?.address && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-3 text-primary" />
                    <span>{info.address}, {info.city}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-border/40 text-[10px] text-center text-muted-foreground/80 flex items-center justify-between">
              <span>© {new Date().getFullYear()} {info?.business_name}. All rights reserved.</span>
              <span>LevelUp Digital Operations Portal</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
