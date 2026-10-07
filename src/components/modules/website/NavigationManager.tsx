import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Navigation,
  ExternalLink,
} from 'lucide-react';
import { Website, WebsiteNavItem } from '../../../types';
import { websiteDataService } from '../../../services/websiteDataService';

interface NavigationManagerProps {
  website: Website;
  tenantId: string;
  isReadOnly?: boolean;
}

export const NavigationManager: React.FC<NavigationManagerProps> = ({
  website,
  isReadOnly = false,
}) => {
  const [items, setItems] = useState<WebsiteNavItem[]>(() =>
    websiteDataService.getNavItems(website.id)
  );

  const [toast, setToast] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState('');
  const [newPath, setNewPath] = useState('');
  const [newLocation, setNewLocation] = useState<WebsiteNavItem['location']>('header');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly || !newLabel || !newPath) return;

    const updated = [
      ...items,
      {
        id: `nav-${Date.now()}`,
        website_id: website.id,
        label: newLabel,
        path: newPath,
        is_external: newPath.startsWith('http'),
        sort_order: items.length + 1,
        location: newLocation,
        status: 'published' as const,
      },
    ];

    websiteDataService.updateNavItems(website.id, updated);
    setItems(updated);
    setNewLabel('');
    setNewPath('');
    showToast(`Added navigation item "${newLabel}".`);
  };

  const handleRemove = (id: string, label: string) => {
    if (isReadOnly) return;
    const updated = items.filter((i) => i.id !== id);
    websiteDataService.updateNavItems(website.id, updated);
    setItems(updated);
    showToast(`Removed "${label}".`);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (isReadOnly) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const copy = [...items];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);

    const reordered = copy.map((item, idx) => ({ ...item, sort_order: idx + 1 }));
    websiteDataService.updateNavItems(website.id, reordered);
    setItems(reordered);
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
      <div className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Website Navigation Menu</h3>
          <p className="text-xs text-muted-foreground">
            Manage header and footer navigation links displayed to public visitors.
          </p>
        </div>
      </div>

      {/* Existing Menu Items */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <h4 className="text-xs font-semibold text-foreground">Current Menu Order</h4>

        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 p-2.5 rounded-md bg-muted/20 border border-border/60 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-muted-foreground w-4">
                  #{idx + 1}
                </span>
                <span className="font-semibold text-foreground">{item.label}</span>
                <span className="font-mono text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {item.path}
                </span>
                <span className="text-[10px] uppercase font-mono text-muted-foreground">
                  ({item.location})
                </span>
                {item.is_external && <ExternalLink className="size-3 text-muted-foreground" />}
              </div>

              {!isReadOnly && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveItem(idx, 'up')}
                    className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
                    title="Move up"
                  >
                    <ArrowUp className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === items.length - 1}
                    onClick={() => moveItem(idx, 'down')}
                    className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
                    title="Move down"
                  >
                    <ArrowDown className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id, item.label)}
                    className="p-1 rounded text-muted-foreground hover:text-rose-400"
                    title="Remove item"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add New Link Bar */}
      {!isReadOnly && (
        <form
          onSubmit={handleAdd}
          className="bg-card border border-border rounded-lg p-4 space-y-3"
        >
          <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Plus className="size-3.5 text-primary" />
            <span>Add Navigation Item</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">Link Label</label>
              <input
                type="text"
                required
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground"
                placeholder="e.g. Testimonials"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-[11px] text-muted-foreground">Destination Path</label>
              <input
                type="text"
                required
                value={newPath}
                onChange={(e) => setNewPath(e.target.value)}
                className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground font-mono"
                placeholder="/reviews or https://..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">Placement</label>
              <select
                value={newLocation}
                onChange={(e) =>
                  setNewLocation(e.target.value as WebsiteNavItem['location'])
                }
                className="w-full h-8 rounded bg-background border border-border px-2 text-xs text-foreground"
              >
                <option value="header">Header Only</option>
                <option value="footer">Footer Only</option>
                <option value="both">Both Header & Footer</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs"
            >
              Add Link to Menu
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
