import React, { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  X,
  Megaphone,
  Radio,
  Sparkles,
} from 'lucide-react';
import { Website, WebsiteAnnouncement } from '../../../types';
import { websiteDataService } from '../../../services/websiteDataService';
import { AiAssistModal } from '../../shared/AiAssistModal';

interface AnnouncementsManagerProps {
  website: Website;
  tenantId: string;
  isReadOnly?: boolean;
}

export const AnnouncementsManager: React.FC<AnnouncementsManagerProps> = ({
  website,
  tenantId,
  isReadOnly = false,
}) => {
  const [announcements, setAnnouncements] = useState<WebsiteAnnouncement[]>(() =>
    websiteDataService.getAnnouncements(website.id)
  );

  const [toast, setToast] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<WebsiteAnnouncement | null>(null);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [badgeLabel, setBadgeLabel] = useState('Update');
  const [badgeType, setBadgeType] = useState<WebsiteAnnouncement['badge_type']>('update');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkLabel, setLinkLabel] = useState('');
  const [status, setStatus] = useState<WebsiteAnnouncement['status']>('published');

  // AI Modal
  const [isAiOpen, setIsAiOpen] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenCreate = () => {
    setEditingAnn(null);
    setTitle('');
    setMessage('');
    setBadgeLabel('Announcement');
    setBadgeType('update');
    setLinkUrl('');
    setLinkLabel('');
    setStatus('published');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ann: WebsiteAnnouncement) => {
    setEditingAnn(ann);
    setTitle(ann.title);
    setMessage(ann.message);
    setBadgeLabel(ann.badge_label);
    setBadgeType(ann.badge_type);
    setLinkUrl(ann.link_url || '');
    setLinkLabel(ann.link_label || '');
    setStatus(ann.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    if (editingAnn) {
      websiteDataService.updateAnnouncement(website.id, editingAnn.id, {
        title,
        message,
        badge_label: badgeLabel,
        badge_type: badgeType,
        link_url: linkUrl || undefined,
        link_label: linkLabel || undefined,
        status,
      });
      showToast(`Announcement "${title}" updated.`);
    } else {
      websiteDataService.createAnnouncement(website.id, tenantId, {
        title,
        message,
        badge_label: badgeLabel,
        badge_type: badgeType,
        link_url: linkUrl || undefined,
        link_label: linkLabel || undefined,
        status,
      });
      showToast(`Announcement "${title}" created.`);
    }

    setAnnouncements(websiteDataService.getAnnouncements(website.id));
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, annTitle: string) => {
    if (isReadOnly) return;
    if (confirm(`Delete announcement "${annTitle}"?`)) {
      websiteDataService.deleteAnnouncement(website.id, id);
      setAnnouncements(websiteDataService.getAnnouncements(website.id));
      showToast(`Announcement "${annTitle}" deleted.`);
    }
  };

  const handleTogglePublish = (ann: WebsiteAnnouncement) => {
    if (isReadOnly) return;
    const nextStatus = ann.status === 'published' ? 'draft' : 'published';
    websiteDataService.updateAnnouncement(website.id, ann.id, { status: nextStatus });
    setAnnouncements(websiteDataService.getAnnouncements(website.id));
    showToast(
      `Announcement is now ${nextStatus === 'published' ? 'Live on website' : 'Saved as Draft'}.`
    );
  };

  const getBadgeStyle = (type: WebsiteAnnouncement['badge_type']) => {
    switch (type) {
      case 'offer':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'alert':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'notice':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'update':
      default:
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border rounded-lg p-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Website Announcements</h3>
          <p className="text-xs text-muted-foreground">
            Publish time-sensitive notices, holiday operating hours, seasonal menus, or promotions.
          </p>
        </div>

        {!isReadOnly && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs self-start sm:self-auto"
          >
            <Plus className="size-3.5" />
            <span>Create Announcement</span>
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-3">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="p-4 rounded-lg bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${getBadgeStyle(ann.badge_type)}`}>
                  {ann.badge_label}
                </span>

                <h4 className="text-xs font-semibold text-foreground">{ann.title}</h4>

                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded border font-mono ${
                    ann.status === 'published'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-muted text-muted-foreground border-border'
                  }`}
                >
                  {ann.status === 'published' ? 'Live on Site' : 'Draft'}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{ann.message}</p>

              {ann.link_url && (
                <div className="text-[11px] text-primary flex items-center gap-1">
                  <Radio className="size-3" />
                  <span>Links to: {ann.link_url}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            {!isReadOnly && (
              <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(ann)}
                  className="text-xs font-medium text-foreground hover:underline"
                >
                  {ann.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(ann)}
                    className="p-1.5 rounded text-muted-foreground hover:text-foreground"
                    title="Edit"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(ann.id, ann.title)}
                    className="p-1.5 rounded text-muted-foreground hover:text-rose-400"
                    title="Delete"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <form
            onSubmit={handleSave}
            className="w-full max-w-lg bg-card border border-border rounded-lg shadow-2xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/80">
              <h4 className="text-xs font-semibold text-foreground">
                {editingAnn ? 'Edit Announcement' : 'Create Announcement'}
              </h4>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Headline Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground"
                    placeholder="e.g. Autumn Tasting Menu Opening"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Badge Label</label>
                  <input
                    type="text"
                    required
                    value={badgeLabel}
                    onChange={(e) => setBadgeLabel(e.target.value)}
                    className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground"
                    placeholder="e.g. Holiday Hours or Special Offer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Badge Style</label>
                  <select
                    value={badgeType}
                    onChange={(e) =>
                      setBadgeType(e.target.value as WebsiteAnnouncement['badge_type'])
                    }
                    className="w-full h-8 rounded bg-background border border-border px-2 text-xs text-foreground"
                  >
                    <option value="update">Update (Sky)</option>
                    <option value="notice">Notice (Amber)</option>
                    <option value="offer">Special Offer (Emerald)</option>
                    <option value="alert">Alert (Rose)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Publish Status</label>
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as WebsiteAnnouncement['status'])
                    }
                    className="w-full h-8 rounded bg-background border border-border px-2 text-xs text-foreground"
                  >
                    <option value="published">Publish Immediately</option>
                    <option value="draft">Save as Draft</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">Announcement Message</label>
                  <button
                    type="button"
                    onClick={() => setIsAiOpen(true)}
                    className="text-[11px] text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <Sparkles className="size-3" />
                    <span>AI Polish</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded bg-background border border-border p-2.5 text-xs text-foreground resize-none leading-relaxed"
                  placeholder="Detailed announcement text for website visitors..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Destination Link (Optional)</label>
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground font-mono"
                    placeholder="/reservations or https://..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Link Button Label</label>
                  <input
                    type="text"
                    value={linkLabel}
                    onChange={(e) => setLinkLabel(e.target.value)}
                    className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground"
                    placeholder="e.g. Reserve Now"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 rounded border border-border text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"
              >
                Save Announcement
              </button>
            </div>
          </form>
        </div>
      )}

      {/* AI Assistant */}
      <AiAssistModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        title="Polish Announcement"
        request={{
          action: 'rewrite_announcement',
          currentText: message,
          context: { businessName: website.name, topic: title },
        }}
        onApply={(text) => setMessage(text)}
      />
    </div>
  );
};
