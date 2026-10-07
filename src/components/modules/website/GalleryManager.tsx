import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  CheckCircle2,
  X,
  Camera,
} from 'lucide-react';
import { Website, WebsiteGalleryItem } from '../../../types';
import { websiteDataService } from '../../../services/websiteDataService';

interface GalleryManagerProps {
  website: Website;
  tenantId: string;
  isReadOnly?: boolean;
}

export const GalleryManager: React.FC<GalleryManagerProps> = ({
  website,
  tenantId,
  isReadOnly = false,
}) => {
  const [items, setItems] = useState<WebsiteGalleryItem[]>(() =>
    websiteDataService.getGalleryItems(website.id)
  );

  const [toast, setToast] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('Ambiance');
  const [caption, setCaption] = useState('');
  const [altText, setAltText] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenCreate = () => {
    setTitle('');
    setImageUrl('https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80');
    setCategory('Interior');
    setCaption('');
    setAltText('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    websiteDataService.addGalleryItem(website.id, tenantId, {
      title,
      image_url: imageUrl,
      category,
      caption: caption || undefined,
      alt_text: altText || title,
      sort_order: items.length + 1,
      status: 'published',
    });
    showToast(`Photo "${title}" added to gallery.`);
    setItems(websiteDataService.getGalleryItems(website.id));
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, itemTitle: string) => {
    if (isReadOnly) return;
    if (confirm(`Remove "${itemTitle}" from gallery?`)) {
      websiteDataService.deleteGalleryItem(website.id, id);
      setItems(websiteDataService.getGalleryItems(website.id));
      showToast(`Photo "${itemTitle}" removed.`);
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
          <h3 className="text-sm font-semibold text-foreground">Photo Gallery</h3>
          <p className="text-xs text-muted-foreground">
            Curate visual albums showcasing your dining ambiance, clinical suites, or creative portfolio.
          </p>
        </div>

        {!isReadOnly && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs self-start sm:self-auto"
          >
            <Plus className="size-3.5" />
            <span>Add Photo</span>
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-border bg-card overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div className="aspect-4/3 bg-muted relative overflow-hidden">
              <img
                src={item.image_url}
                alt={item.alt_text}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-background/80 backdrop-blur-xs border border-border text-foreground">
                {item.category}
              </span>
            </div>

            <div className="p-3 space-y-1">
              <h4 className="text-xs font-semibold text-foreground truncate">{item.title}</h4>
              {item.caption && (
                <p className="text-[11px] text-muted-foreground line-clamp-2">{item.caption}</p>
              )}
            </div>

            {!isReadOnly && (
              <div className="px-3 py-2 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-[10px] text-muted-foreground">Order: #{item.sort_order}</span>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.title)}
                  className="p-1 rounded text-muted-foreground hover:text-rose-400"
                  title="Delete Photo"
                >
                  <Trash2 className="size-3.5" />
                </button>
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
            className="w-full max-w-md bg-card border border-border rounded-lg shadow-2xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/80">
              <h4 className="text-xs font-semibold text-foreground">Add Gallery Photo</h4>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Photo Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground"
                  placeholder="e.g. Hearth Cooking Embers"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Image URL</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground"
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Category Album</label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground"
                  placeholder="Ambiance, Dishes, Cellar, Facilities..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Caption</label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full rounded bg-background border border-border p-2.5 text-xs text-foreground resize-none leading-relaxed"
                  placeholder="Brief descriptive note displayed on hover or lightbox..."
                />
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
                Save Photo
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
