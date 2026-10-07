import React, { useState } from 'react';
import {
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Layout,
  Megaphone,
  CheckSquare,
} from 'lucide-react';
import { Website, HomepageContent } from '../../../types';
import { websiteDataService } from '../../../services/websiteDataService';
import { AiAssistModal } from '../../shared/AiAssistModal';
import { AiEnhanceRequest } from '../../../services/aiService';

interface HomepageHeroEditorProps {
  website: Website;
  isReadOnly?: boolean;
}

export const HomepageHeroEditor: React.FC<HomepageHeroEditorProps> = ({
  website,
  isReadOnly = false,
}) => {
  const initialData = websiteDataService.getHomepage(website.id);

  const [formData, setFormData] = useState<HomepageContent>(() => {
    return (
      initialData || {
        website_id: website.id,
        hero_badge: 'Welcome to our platform',
        hero_headline: 'Elevate Your Digital Experience',
        hero_description: 'Discover exceptional quality and personalized service.',
        primary_cta_label: 'Get Started',
        primary_cta_link: '/contact',
        secondary_cta_label: 'Learn More',
        secondary_cta_link: '/about',
        hero_image_url: '',
        announcement_banner_active: false,
        announcement_banner_text: '',
        featured_services_enabled: true,
        featured_products_enabled: false,
        testimonials_enabled: true,
        gallery_preview_enabled: true,
        faq_section_enabled: true,
        updated_at: new Date().toISOString(),
        updated_by: 'Antoine Mercier',
      }
    );
  });

  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [aiModal, setAiModal] = useState<{
    isOpen: boolean;
    field: 'hero_headline' | 'hero_description' | 'announcement_banner_text';
    title: string;
    request: AiEnhanceRequest;
  }>({
    isOpen: false,
    field: 'hero_headline',
    title: '',
    request: { action: 'improve_description' },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    try {
      websiteDataService.updateHomepage(website.id, formData);
      setStatusMessage({
        type: 'success',
        text: 'Homepage content saved and updated on public site.',
      });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Unable to save homepage changes.',
      });
    }
  };

  const openAiHelper = (
    field: 'hero_headline' | 'hero_description' | 'announcement_banner_text',
    title: string,
    action: AiEnhanceRequest['action']
  ) => {
    setAiModal({
      isOpen: true,
      field,
      title,
      request: {
        action,
        currentText: formData[field] || '',
        context: {
          businessName: website.name,
          businessType: website.config?.website_type,
        },
      },
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {statusMessage && (
        <div
          className={`p-3 rounded-md text-xs font-medium flex items-center gap-2 border animate-in fade-in duration-150 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="size-4 shrink-0" />
          ) : (
            <AlertCircle className="size-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Top Banner Control */}
      <div className="bg-card border border-border rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <Megaphone className="size-4 text-primary" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">Top Announcement Strip</h3>
              <p className="text-xs text-muted-foreground">
                High-visibility alert banner displayed at the very top of your public site.
              </p>
            </div>
          </div>

          <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer">
            <input
              type="checkbox"
              disabled={isReadOnly}
              checked={formData.announcement_banner_active}
              onChange={(e) =>
                setFormData({ ...formData, announcement_banner_active: e.target.checked })
              }
              className="rounded border-border text-primary focus:ring-primary size-4"
            />
            <span className={formData.announcement_banner_active ? 'text-primary' : 'text-muted-foreground'}>
              {formData.announcement_banner_active ? 'Active on site' : 'Disabled'}
            </span>
          </label>
        </div>

        {formData.announcement_banner_active && (
          <div className="space-y-1.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">Banner Copy</label>
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => openAiHelper('announcement_banner_text', 'Polish Banner', 'rewrite_announcement')}
                  className="text-[11px] text-primary hover:underline inline-flex items-center gap-1"
                >
                  <Sparkles className="size-3" />
                  <span>AI Polish</span>
                </button>
              )}
            </div>
            <input
              type="text"
              disabled={isReadOnly}
              value={formData.announcement_banner_text}
              onChange={(e) =>
                setFormData({ ...formData, announcement_banner_text: e.target.value })
              }
              className="w-full h-9 rounded-md bg-background border border-border px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
              placeholder="e.g. Extended Weekend Hours or Special Seasonal Tasting Menus Now Open"
            />
          </div>
        )}
      </div>

      {/* Hero Section Content */}
      <div className="bg-card border border-border rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border/60">
          <Layout className="size-4 text-primary" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">Hero Section</h3>
            <p className="text-xs text-muted-foreground">
              The primary above-the-fold greeting visitors see on your homepage.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Top Pill / Micro Badge</label>
            <input
              type="text"
              disabled={isReadOnly}
              value={formData.hero_badge}
              onChange={(e) => setFormData({ ...formData, hero_badge: e.target.value })}
              className="w-full h-9 rounded-md bg-background border border-border px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
              placeholder="e.g. Boston Health Excellence 2026 or Greenwich Village Est. 2023"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">Main Headline</label>
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => openAiHelper('hero_headline', 'Improve Headline', 'improve_description')}
                  className="text-[11px] text-primary hover:underline inline-flex items-center gap-1"
                >
                  <Sparkles className="size-3" />
                  <span>AI Polish</span>
                </button>
              )}
            </div>
            <input
              type="text"
              required
              disabled={isReadOnly}
              value={formData.hero_headline}
              onChange={(e) => setFormData({ ...formData, hero_headline: e.target.value })}
              className="w-full h-9 rounded-md bg-background border border-border px-3 text-xs text-foreground font-semibold focus:ring-1 focus:ring-primary focus:outline-hidden"
              placeholder="Enter your compelling value proposition..."
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">Supporting Subheading</label>
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => openAiHelper('hero_description', 'Improve Subheading', 'improve_description')}
                  className="text-[11px] text-primary hover:underline inline-flex items-center gap-1"
                >
                  <Sparkles className="size-3" />
                  <span>AI Polish</span>
                </button>
              )}
            </div>
            <textarea
              rows={3}
              disabled={isReadOnly}
              value={formData.hero_description}
              onChange={(e) => setFormData({ ...formData, hero_description: e.target.value })}
              className="w-full rounded-md bg-background border border-border p-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden resize-none leading-relaxed"
              placeholder="Provide a clear, engaging sentence that expands on the headline..."
            />
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-3 p-3 rounded-md bg-muted/20 border border-border">
              <span className="text-xs font-semibold text-foreground block">Primary Action Button</span>
              <div className="space-y-1.5">
                <label className="text-[11px] text-muted-foreground">Button Label</label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={formData.primary_cta_label}
                  onChange={(e) => setFormData({ ...formData, primary_cta_label: e.target.value })}
                  className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground"
                  placeholder="e.g. Book an Appointment"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] text-muted-foreground">Destination Link</label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={formData.primary_cta_link}
                  onChange={(e) => setFormData({ ...formData, primary_cta_link: e.target.value })}
                  className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground font-mono"
                  placeholder="/book-appointment"
                />
              </div>
            </div>

            <div className="space-y-3 p-3 rounded-md bg-muted/20 border border-border">
              <span className="text-xs font-semibold text-foreground block">Secondary Action Button</span>
              <div className="space-y-1.5">
                <label className="text-[11px] text-muted-foreground">Button Label</label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={formData.secondary_cta_label}
                  onChange={(e) => setFormData({ ...formData, secondary_cta_label: e.target.value })}
                  className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground"
                  placeholder="e.g. View Evening Menu"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] text-muted-foreground">Destination Link</label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={formData.secondary_cta_link}
                  onChange={(e) => setFormData({ ...formData, secondary_cta_link: e.target.value })}
                  className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground font-mono"
                  placeholder="/menu"
                />
              </div>
            </div>
          </div>

          {/* Hero Visual Media */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-medium text-foreground">Hero Image URL</label>
            <input
              type="url"
              disabled={isReadOnly}
              value={formData.hero_image_url}
              onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
              className="w-full h-9 rounded-md bg-background border border-border px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
              placeholder="https://..."
            />
            {formData.hero_image_url && (
              <div className="mt-2 rounded-md overflow-hidden border border-border max-h-48">
                <img
                  src={formData.hero_image_url}
                  alt="Hero Preview"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Homepage Modules Configuration */}
      <div className="bg-card border border-border rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border/60">
          <CheckSquare className="size-4 text-primary" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">Homepage Sections & Modules</h3>
            <p className="text-xs text-muted-foreground">
              Toggle which content sections appear below your hero on the main landing page.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            {
              key: 'featured_services_enabled',
              label: 'Featured Services Carousel',
              desc: 'Displays your top clinical or advisory offerings',
            },
            {
              key: 'featured_products_enabled',
              label: 'Featured Products Grid',
              desc: 'Shows top-selling catalog items (E-commerce)',
            },
            {
              key: 'testimonials_enabled',
              label: 'Client Testimonials / Reviews',
              desc: 'Curated 5-star quotes from verified patients or guests',
            },
            {
              key: 'gallery_preview_enabled',
              label: 'Visual Photo Gallery Strip',
              desc: 'Shows high-resolution facility or food photography',
            },
            {
              key: 'faq_section_enabled',
              label: 'Frequently Asked Questions',
              desc: 'Accordion with published FAQ answers',
            },
          ].map((mod) => (
            <label
              key={mod.key}
              className="flex items-start gap-2.5 p-3 rounded-md bg-muted/20 border border-border/60 cursor-pointer hover:bg-muted/30 transition-colors"
            >
              <input
                type="checkbox"
                disabled={isReadOnly}
                checked={Boolean((formData as unknown as Record<string, boolean>)[mod.key])}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [mod.key]: e.target.checked,
                  })
                }
                className="rounded border-border text-primary focus:ring-primary size-4 mt-0.5"
              />
              <div>
                <span className="font-medium text-foreground block">{mod.label}</span>
                <span className="text-[11px] text-muted-foreground">{mod.desc}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      {!isReadOnly && (
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <button
            type="button"
            onClick={() => {
              if (initialData) setFormData(initialData);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs"
          >
            <Save className="size-3.5" />
            <span>Save & Publish Homepage</span>
          </button>
        </div>
      )}

      {/* AI Modal */}
      <AiAssistModal
        isOpen={aiModal.isOpen}
        onClose={() => setAiModal({ ...aiModal, isOpen: false })}
        title={aiModal.title}
        request={aiModal.request}
        onApply={(text) => setFormData({ ...formData, [aiModal.field]: text })}
      />
    </form>
  );
};
