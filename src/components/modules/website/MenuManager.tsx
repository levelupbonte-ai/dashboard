import React, { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  UtensilsCrossed,
  X,
  DollarSign,
  Sparkles,
} from 'lucide-react';
import { Website, WebsiteMenuItem, WebsiteMenuCategory } from '../../../types';
import { websiteDataService } from '../../../services/websiteDataService';
import { AiAssistModal } from '../../shared/AiAssistModal';

interface MenuManagerProps {
  website: Website;
  tenantId: string;
  isReadOnly?: boolean;
}

export const MenuManager: React.FC<MenuManagerProps> = ({
  website,
  tenantId,
  isReadOnly = false,
}) => {
  const [categories] = useState<WebsiteMenuCategory[]>(() =>
    websiteDataService.getMenuCategories(website.id)
  );
  const [items, setItems] = useState<WebsiteMenuItem[]>(() =>
    websiteDataService.getMenuItems(website.id)
  );

  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [toast, setToast] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WebsiteMenuItem | null>(null);

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(24);
  const [dietary, setDietary] = useState<WebsiteMenuItem['dietary']>([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // AI Modal
  const [isAiOpen, setIsAiOpen] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredItems =
    selectedCat === 'all'
      ? items
      : items.filter((i) => i.category_id === selectedCat);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setName('');
    setCategoryId(categories[0]?.id || 'cat-starters');
    setDescription('');
    setPrice(28);
    setDietary([]);
    setIsAvailable(true);
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: WebsiteMenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategoryId(item.category_id);
    setDescription(item.description);
    setPrice(item.price);
    setDietary(item.dietary || []);
    setIsAvailable(item.is_available);
    setIsFeatured(item.is_featured);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    const catObj = categories.find((c) => c.id === categoryId);
    const catName = catObj ? catObj.name : 'Mains';

    if (editingItem) {
      websiteDataService.updateMenuItem(website.id, editingItem.id, {
        name,
        category_id: categoryId,
        category_name: catName,
        description,
        price,
        dietary,
        is_available: isAvailable,
        is_featured: isFeatured,
      });
      showToast(`Dish "${name}" updated.`);
    } else {
      websiteDataService.createMenuItem(website.id, tenantId, {
        category_id: categoryId,
        category_name: catName,
        name,
        description,
        price,
        dietary,
        is_available: isAvailable,
        is_featured: isFeatured,
        sort_order: items.length + 1,
        status: 'published',
      });
      showToast(`Dish "${name}" added to menu.`);
    }

    setItems(websiteDataService.getMenuItems(website.id));
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, itemName: string) => {
    if (isReadOnly) return;
    if (confirm(`Remove "${itemName}" from menu?`)) {
      websiteDataService.deleteMenuItem(website.id, id);
      setItems(websiteDataService.getMenuItems(website.id));
      showToast(`"${itemName}" removed.`);
    }
  };

  const handleToggleAvailable = (item: WebsiteMenuItem) => {
    if (isReadOnly) return;
    websiteDataService.updateMenuItem(website.id, item.id, {
      is_available: !item.is_available,
    });
    setItems(websiteDataService.getMenuItems(website.id));
    showToast(
      `"${item.name}" marked as ${!item.is_available ? 'Available' : 'Sold Out'}.`
    );
  };

  const toggleDietaryTag = (
    tag: 'vegetarian' | 'vegan' | 'gluten_free' | 'chef_special'
  ) => {
    if (dietary.includes(tag)) {
      setDietary(dietary.filter((t) => t !== tag));
    } else {
      setDietary([...dietary, tag]);
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
          <h3 className="text-sm font-semibold text-foreground">Menu & Wine Management</h3>
          <p className="text-xs text-muted-foreground">
            Update seasonal courses, prices, chef recommendations, and allergen tags live on your site.
          </p>
        </div>

        {!isReadOnly && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs self-start sm:self-auto"
          >
            <Plus className="size-3.5" />
            <span>Add Menu Item</span>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCat('all')}
          className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors ${
            selectedCat === 'all'
              ? 'bg-foreground text-background font-medium'
              : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          All Items ({items.length})
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCat(c.id)}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors ${
              selectedCat === c.id
                ? 'bg-foreground text-background font-medium'
                : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-lg bg-card border border-border flex flex-col justify-between gap-3 shadow-xs"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-mono font-medium text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                    {item.category_name}
                  </span>
                  <h4 className="text-sm font-semibold text-foreground mt-1">{item.name}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
                      item.is_available
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}
                  >
                    {item.is_available ? 'In Stock' : 'Sold Out'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {item.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                <div className="flex items-center gap-1 font-bold text-emerald-500">
                  <DollarSign className="size-3.5" />
                  <span>${item.price}</span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {item.dietary?.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-muted/60 border border-border text-foreground capitalize"
                    >
                      {tag.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            {!isReadOnly && (
              <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                <button
                  type="button"
                  onClick={() => handleToggleAvailable(item)}
                  className="text-muted-foreground hover:text-foreground text-[11px] underline"
                >
                  {item.is_available ? 'Mark as Sold Out' : 'Mark Available'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="p-1 rounded text-muted-foreground hover:text-foreground"
                    title="Edit Item"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.name)}
                    className="p-1 rounded text-muted-foreground hover:text-rose-400"
                    title="Remove Item"
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
                {editingItem ? 'Edit Menu Dish' : 'Add New Menu Dish'}
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
                  <label className="text-xs font-medium text-foreground">Item Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground"
                    placeholder="e.g. Charred Spanish Octopus"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Menu Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full h-8 rounded bg-background border border-border px-2 text-xs text-foreground"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">Culinary Description</label>
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
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded bg-background border border-border p-2.5 text-xs text-foreground resize-none leading-relaxed"
                  placeholder="Ingredients, preparation technique, sauces, pairings..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Price (USD)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Status & Availability</label>
                  <div className="pt-2 flex items-center gap-3 text-xs">
                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAvailable}
                        onChange={(e) => setIsAvailable(e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary size-3.5"
                      />
                      <span>In Stock</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary size-3.5"
                      />
                      <span>Chef Highlight</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-medium text-foreground">Dietary & Allergen Tags</label>
                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    { id: 'chef_special', label: "Chef's Special" },
                    { id: 'gluten_free', label: 'Gluten-Free' },
                    { id: 'vegetarian', label: 'Vegetarian' },
                    { id: 'vegan', label: 'Vegan' },
                  ].map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() =>
                        toggleDietaryTag(
                          tag.id as 'vegetarian' | 'vegan' | 'gluten_free' | 'chef_special'
                        )
                      }
                      className={`px-2 py-1 rounded text-xs border transition-colors ${
                        dietary.includes(
                          tag.id as 'vegetarian' | 'vegan' | 'gluten_free' | 'chef_special'
                        )
                          ? 'bg-primary/10 border-primary text-primary font-medium'
                          : 'bg-muted/40 border-border text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {tag.label}
                    </button>
                  ))}
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
                Save Menu Item
              </button>
            </div>
          </form>
        </div>
      )}

      {/* AI Assistant */}
      <AiAssistModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        title="Draft Culinary Description"
        request={{
          action: 'improve_description',
          context: { businessName: website.name, topic: name },
        }}
        onApply={(text) => setDescription(text)}
      />
    </div>
  );
};
