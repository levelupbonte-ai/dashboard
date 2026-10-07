import React, { useState } from 'react';
import {
  Upload,
  Trash2,
  Copy,
  Check,
  Eye,
  Filter,
  Image as ImageIcon,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Website, MediaItem } from '../../../types';
import { websiteDataService } from '../../../services/websiteDataService';

interface MediaManagerProps {
  website: Website;
  tenantId: string;
  isReadOnly?: boolean;
}

export const MediaManager: React.FC<MediaManagerProps> = ({
  website,
  tenantId,
  isReadOnly = false,
}) => {
  const [mediaList, setMediaList] = useState<MediaItem[]>(() =>
    websiteDataService.getMedia(website.id)
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // New Upload state
  const [newAltText, setNewAltText] = useState('');
  const [newCategory, setNewCategory] = useState<MediaItem['category']>('gallery');
  const [newFileUrl, setNewFileUrl] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All Files' },
    { id: 'heroes', label: 'Hero Banners' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'services', label: 'Services' },
    { id: 'products', label: 'Products' },
    { id: 'team', label: 'Team Portraits' },
    { id: 'brand', label: 'Logos & Brand' },
  ];

  const filteredMedia =
    selectedCategory === 'all'
      ? mediaList
      : mediaList.filter((m) => m.category === selectedCategory);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDelete = (id: string) => {
    if (isReadOnly) return;
    if (confirm('Are you sure you want to delete this media asset?')) {
      websiteDataService.deleteMedia(website.id, id);
      setMediaList(websiteDataService.getMedia(website.id));
      setSelectedMedia(null);
      showToast('Media asset removed from library.');
    }
  };

  const handleCreateMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileUrl) return;

    const item = websiteDataService.addMedia(website.id, tenantId, {
      name: `asset-${Date.now().toString().slice(-4)}.jpg`,
      url: newFileUrl,
      category: newCategory,
      size_kb: Math.floor(Math.random() * 250) + 90,
      mime_type: 'image/jpeg',
      alt_text: newAltText || 'Website asset',
      created_by: 'Antoine Mercier',
    });

    setMediaList(websiteDataService.getMedia(website.id));
    setNewFileUrl('');
    setNewAltText('');
    setIsUploadOpen(false);
    showToast(`Asset "${item.name}" uploaded to secure storage.`);
  };

  const showToast = (text: string) => {
    setToast(text);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border rounded-lg p-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Media Assets</h3>
          <p className="text-xs text-muted-foreground">
            Manage high-resolution images, brand vectors, and photography served on CDN.
          </p>
        </div>

        {!isReadOnly && (
          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs self-start sm:self-auto"
          >
            <Upload className="size-3.5" />
            <span>Upload New Asset</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <Filter className="size-3.5 text-muted-foreground mr-1 shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-foreground text-background font-medium'
                : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border rounded-lg space-y-2">
          <ImageIcon className="size-8 text-muted-foreground/40 mx-auto" />
          <div className="text-xs font-semibold text-foreground">No media assets in this category</div>
          <p className="text-[11px] text-muted-foreground">
            Upload images to organize and attach them to your site content.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className="group relative rounded-lg border border-border bg-card overflow-hidden cursor-pointer hover:border-foreground/30 transition-all flex flex-col"
            >
              <div className="aspect-square bg-muted/40 overflow-hidden relative">
                <img
                  src={item.url}
                  alt={item.alt_text}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="p-1.5 rounded-full bg-background/80 text-foreground">
                    <Eye className="size-3.5" />
                  </span>
                </div>
              </div>

              <div className="p-2 text-[11px] space-y-0.5">
                <div className="font-medium text-foreground truncate">{item.name}</div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span className="capitalize">{item.category}</span>
                  <span>{item.size_kb} KB</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Asset Detail Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-card border border-border rounded-lg shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/80">
              <span className="text-xs font-semibold text-foreground truncate max-w-xs">
                {selectedMedia.name}
              </span>
              <button
                onClick={() => setSelectedMedia(null)}
                className="p-1 rounded text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="rounded-lg overflow-hidden border border-border bg-muted/30 max-h-72 flex items-center justify-center">
              <img
                src={selectedMedia.url}
                alt={selectedMedia.alt_text}
                className="max-h-72 w-full object-contain"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] text-muted-foreground uppercase font-mono">Category</span>
                <div className="capitalize font-medium text-foreground">{selectedMedia.category}</div>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] text-muted-foreground uppercase font-mono">File Size</span>
                <div className="font-medium text-foreground">{selectedMedia.size_kb} KB ({selectedMedia.mime_type})</div>
              </div>

              <div className="col-span-2 space-y-0.5">
                <span className="text-[10px] text-muted-foreground uppercase font-mono">Alt Text</span>
                <div className="text-foreground">{selectedMedia.alt_text || 'No alt text configured'}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => handleCopy(selectedMedia.url)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs text-foreground hover:bg-accent transition-colors"
              >
                {isCopied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                <span>{isCopied ? 'URL Copied!' : 'Copy CDN URL'}</span>
              </button>

              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => handleDelete(selectedMedia.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-colors"
                >
                  <Trash2 className="size-3.5" />
                  <span>Delete Asset</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <form
            onSubmit={handleCreateMedia}
            className="w-full max-w-md bg-card border border-border rounded-lg shadow-2xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/80">
              <h4 className="text-xs font-semibold text-foreground">Upload Media Asset</h4>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="p-1 rounded text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Image URL</label>
                <input
                  type="url"
                  required
                  value={newFileUrl}
                  onChange={(e) => setNewFileUrl(e.target.value)}
                  className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Category Tag</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as MediaItem['category'])}
                  className="w-full h-8 rounded bg-background border border-border px-2 text-xs text-foreground"
                >
                  <option value="gallery">Gallery</option>
                  <option value="heroes">Hero Banner</option>
                  <option value="services">Services</option>
                  <option value="products">Products</option>
                  <option value="team">Team Portrait</option>
                  <option value="brand">Logo / Brand</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Alt Text (Accessibility & SEO)</label>
                <input
                  type="text"
                  required
                  value={newAltText}
                  onChange={(e) => setNewAltText(e.target.value)}
                  className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground"
                  placeholder="Descriptive text for search engines and screen readers"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="px-3 py-1.5 rounded border border-border text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"
              >
                Save to Library
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
