import React, { useState } from 'react';
import {
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building2,
  Clock,
  Share2,
  Search,
} from 'lucide-react';
import { Website, WebsiteInformation } from '../../../types';
import { websiteDataService } from '../../../services/websiteDataService';
import { AiAssistModal } from '../../shared/AiAssistModal';
import { AiEnhanceRequest } from '../../../services/aiService';

interface WebsiteInfoEditorProps {
  website: Website;
  isReadOnly?: boolean;
}

export const WebsiteInfoEditor: React.FC<WebsiteInfoEditorProps> = ({
  website,
  isReadOnly = false,
}) => {
  const initialData = websiteDataService.getInformation(website.id);

  const [formData, setFormData] = useState<WebsiteInformation>(() => {
    return (
      initialData || {
        website_id: website.id,
        business_name: website.name,
        tagline: '',
        description: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        postal_code: '',
        country: 'United States',
        opening_hours: {
          monday: { open: '09:00', close: '18:00', is_closed: false },
          tuesday: { open: '09:00', close: '18:00', is_closed: false },
          wednesday: { open: '09:00', close: '18:00', is_closed: false },
          thursday: { open: '09:00', close: '18:00', is_closed: false },
          friday: { open: '09:00', close: '18:00', is_closed: false },
          saturday: { open: '10:00', close: '16:00', is_closed: false },
          sunday: { open: '00:00', close: '00:00', is_closed: true },
        },
        social_links: {},
        logo_url: '',
        favicon_url: '',
        seo_title: '',
        seo_description: '',
        og_image_url: '',
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
    field: 'tagline' | 'description' | 'seo_description';
    title: string;
    request: AiEnhanceRequest;
  }>({
    isOpen: false,
    field: 'tagline',
    title: '',
    request: { action: 'improve_description' },
  });

  const handleHourChange = (
    day: string,
    key: 'open' | 'close' | 'is_closed',
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      opening_hours: {
        ...prev.opening_hours,
        [day]: {
          ...prev.opening_hours[day],
          [key]: value,
        },
      },
    }));
  };

  const handleSocialChange = (network: string, val: string) => {
    setFormData((prev) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [network]: val,
      },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    try {
      websiteDataService.updateInformation(website.id, formData);
      setStatusMessage({
        type: 'success',
        text: 'Website information saved and published to public site.',
      });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Unable to save changes. Please try again.',
      });
    }
  };

  const handleReset = () => {
    if (initialData) {
      setFormData(initialData);
      setStatusMessage(null);
    }
  };

  const openAiHelper = (
    field: 'tagline' | 'description' | 'seo_description',
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
          businessName: formData.business_name,
          businessType: website.config?.website_type,
        },
      },
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Feedback banner */}
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

      {/* Section 1: Business Profile */}
      <div className="bg-card border border-border rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border/60">
          <Building2 className="size-4 text-primary" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">Business Information</h3>
            <p className="text-xs text-muted-foreground">
              Core company details displayed across your header, footer, and contact pages.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Business Name</label>
            <input
              type="text"
              required
              disabled={isReadOnly}
              value={formData.business_name}
              onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
              className="w-full h-9 rounded-md bg-background border border-border px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
              placeholder="e.g. Lumina Health Group"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">Tagline / Slogan</label>
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => openAiHelper('tagline', 'Enhance Tagline', 'improve_description')}
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
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full h-9 rounded-md bg-background border border-border px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
              placeholder="e.g. Comprehensive Family Medicine & Digital Telehealth"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-foreground">Company Overview / Description</label>
            {!isReadOnly && (
              <button
                type="button"
                onClick={() => openAiHelper('description', 'Enhance Description', 'improve_description')}
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
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-md bg-background border border-border p-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden resize-none leading-relaxed"
            placeholder="Describe what sets your company and client experience apart..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Public Phone Number</label>
            <input
              type="text"
              disabled={isReadOnly}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full h-9 rounded-md bg-background border border-border px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
              placeholder="+1 (617) 555-0182"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Public Inquiries Email</label>
            <input
              type="email"
              disabled={isReadOnly}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full h-9 rounded-md bg-background border border-border px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
              placeholder="hello@yourdomain.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="space-y-1.5 sm:col-span-1">
            <label className="text-xs font-medium text-foreground">Street Address</label>
            <input
              type="text"
              disabled={isReadOnly}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full h-9 rounded-md bg-background border border-border px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
              placeholder="450 Brookline Ave"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">City</label>
            <input
              type="text"
              disabled={isReadOnly}
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full h-9 rounded-md bg-background border border-border px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
              placeholder="Boston"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Postal Code / State</label>
            <input
              type="text"
              disabled={isReadOnly}
              value={formData.postal_code}
              onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
              className="w-full h-9 rounded-md bg-background border border-border px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
              placeholder="MA 02215"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Structured Opening Hours */}
      <div className="bg-card border border-border rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border/60">
          <Clock className="size-4 text-primary" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">Opening Hours</h3>
            <p className="text-xs text-muted-foreground">
              Directly feeds your public website footer and Google Knowledge Graph schema.
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
            const current = formData.opening_hours?.[day] || {
              open: '09:00',
              close: '18:00',
              is_closed: false,
            };
            return (
              <div
                key={day}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-md bg-muted/20 border border-border/50 text-xs"
              >
                <div className="font-medium capitalize text-foreground w-28">{day}</div>

                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-1.5 text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      disabled={isReadOnly}
                      checked={current.is_closed}
                      onChange={(e) => handleHourChange(day, 'is_closed', e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary size-3.5"
                    />
                    <span>Closed</span>
                  </label>

                  {!current.is_closed && (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        disabled={isReadOnly}
                        value={current.open}
                        onChange={(e) => handleHourChange(day, 'open', e.target.value)}
                        className="h-8 rounded bg-background border border-border px-2 text-xs text-foreground"
                      />
                      <span className="text-muted-foreground">to</span>
                      <input
                        type="time"
                        disabled={isReadOnly}
                        value={current.close}
                        onChange={(e) => handleHourChange(day, 'close', e.target.value)}
                        className="h-8 rounded bg-background border border-border px-2 text-xs text-foreground"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Social Links */}
      <div className="bg-card border border-border rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border/60">
          <Share2 className="size-4 text-primary" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">Social Profiles</h3>
            <p className="text-xs text-muted-foreground">
              Official channels linked across your website and metadata.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { id: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/yourhandle' },
            { id: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/company/yourpage' },
            { id: 'facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/yourpage' },
            { id: 'twitter', label: 'X / Twitter URL', placeholder: 'https://x.com/yourhandle' },
          ].map((item) => (
            <div key={item.id} className="space-y-1">
              <label className="text-xs font-medium text-foreground">{item.label}</label>
              <input
                type="url"
                disabled={isReadOnly}
                value={(formData.social_links as Record<string, string>)?.[item.id] || ''}
                onChange={(e) => handleSocialChange(item.id, e.target.value)}
                className="w-full h-9 rounded-md bg-background border border-border px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
                placeholder={item.placeholder}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Search Visibility & Meta */}
      <div className="bg-card border border-border rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border/60">
          <Search className="size-4 text-primary" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">SEO & Social Sharing Card</h3>
            <p className="text-xs text-muted-foreground">
              How your website appears on Google search results and when shared on iMessage, LinkedIn, or Slack.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">SEO Meta Title</label>
            <input
              type="text"
              disabled={isReadOnly}
              value={formData.seo_title}
              onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
              className="w-full h-9 rounded-md bg-background border border-border px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
              placeholder="Business Name | Official Website & Booking"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">SEO Meta Description</label>
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => openAiHelper('seo_description', 'Generate SEO Meta', 'generate_seo')}
                  className="text-[11px] text-primary hover:underline inline-flex items-center gap-1"
                >
                  <Sparkles className="size-3" />
                  <span>AI Generate</span>
                </button>
              )}
            </div>
            <textarea
              rows={2}
              disabled={isReadOnly}
              value={formData.seo_description}
              onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
              className="w-full rounded-md bg-background border border-border p-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden resize-none leading-relaxed"
              placeholder="Concise description between 140-160 characters describing your offer..."
            />
          </div>

          {/* Google Preview Snippet */}
          <div className="p-3.5 rounded-md bg-muted/30 border border-border space-y-1 text-xs">
            <div className="text-[10px] text-muted-foreground font-mono">Google Search Preview:</div>
            <div className="text-sky-500 font-medium truncate text-sm hover:underline cursor-pointer">
              {formData.seo_title || formData.business_name}
            </div>
            <div className="text-emerald-500 text-[11px] font-mono">
              https://{website.domain}
            </div>
            <div className="text-muted-foreground text-xs line-clamp-2">
              {formData.seo_description || formData.description || 'Visit the official website.'}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      {!isReadOnly && (
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset Changes</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs"
          >
            <Save className="size-3.5" />
            <span>Save & Publish Changes</span>
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
