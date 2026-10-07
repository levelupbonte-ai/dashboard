import React, { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  Package,
  PlusCircle,
  MinusCircle,
  Sparkles,
} from 'lucide-react';
import { Website, WebsiteProduct } from '../../../types';
import { websiteDataService } from '../../../services/websiteDataService';
import { AiAssistModal } from '../../shared/AiAssistModal';

interface ProductsManagerProps {
  website: Website;
  tenantId: string;
  isReadOnly?: boolean;
}

export const ProductsManager: React.FC<ProductsManagerProps> = ({
  website,
  tenantId,
  isReadOnly = false,
}) => {
  const [products, setProducts] = useState<WebsiteProduct[]>(() =>
    websiteDataService.getProducts(website.id)
  );

  const [toast, setToast] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<WebsiteProduct | null>(null);

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(95);
  const [inventoryCount, setInventoryCount] = useState<number>(15);
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<WebsiteProduct['status']>('published');

  // AI Modal
  const [isAiOpen, setIsAiOpen] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setName('');
    setSku(`APX-${Math.floor(Math.random() * 900) + 100}`);
    setCategory('Everyday Carry');
    setDescription('');
    setPrice(120);
    setInventoryCount(25);
    setImageUrl('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80');
    setIsFeatured(false);
    setStatus('published');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: WebsiteProduct) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setCategory(p.category);
    setDescription(p.description);
    setPrice(p.price);
    setInventoryCount(p.inventory_count);
    setImageUrl(p.image_url);
    setIsFeatured(p.is_featured);
    setStatus(p.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    if (editingProduct) {
      websiteDataService.updateProduct(website.id, editingProduct.id, {
        name,
        sku,
        category,
        description,
        price,
        inventory_count: inventoryCount,
        image_url: imageUrl,
        is_featured: isFeatured,
        status,
      });
      showToast(`Product "${name}" updated.`);
    } else {
      websiteDataService.createProduct(website.id, tenantId, {
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        sku,
        category,
        description,
        price,
        inventory_count: inventoryCount,
        track_inventory: true,
        low_stock_threshold: 8,
        image_url: imageUrl,
        is_featured: isFeatured,
        status,
      });
      showToast(`Product "${name}" added to catalog.`);
    }

    setProducts(websiteDataService.getProducts(website.id));
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, prodName: string) => {
    if (isReadOnly) return;
    if (confirm(`Delete product "${prodName}"?`)) {
      websiteDataService.deleteProduct(website.id, id);
      setProducts(websiteDataService.getProducts(website.id));
      showToast(`"${prodName}" deleted.`);
    }
  };

  const adjustStock = (p: WebsiteProduct, delta: number) => {
    if (isReadOnly) return;
    const newCount = Math.max(0, p.inventory_count + delta);
    websiteDataService.updateProduct(website.id, p.id, { inventory_count: newCount });
    setProducts(websiteDataService.getProducts(website.id));
    showToast(`Stock updated for ${p.sku}: ${newCount} units.`);
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
          <h3 className="text-sm font-semibold text-foreground">Catalog & Inventory</h3>
          <p className="text-xs text-muted-foreground">
            Manage your ecommerce products, pricing, stock levels, and SKUs.
          </p>
        </div>

        {!isReadOnly && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs self-start sm:self-auto"
          >
            <Plus className="size-3.5" />
            <span>Add Product</span>
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {products.map((p) => {
          const isLowStock = p.inventory_count <= p.low_stock_threshold;
          return (
            <div
              key={p.id}
              className="p-4 rounded-lg bg-card border border-border flex flex-col justify-between gap-3 shadow-xs"
            >
              <div className="flex items-start gap-3">
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="size-16 rounded-md object-cover border border-border shrink-0 bg-muted"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground px-1 py-0.5 rounded bg-muted">
                      {p.sku}
                    </span>
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
                        p.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-muted text-muted-foreground border-border'
                      }`}
                    >
                      {p.status === 'published' ? 'Live' : 'Draft'}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-foreground truncate">{p.name}</h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">{p.description}</p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-foreground">${p.price}</span>

                    {/* Stock alert */}
                    <div className="flex items-center gap-1 text-[11px]">
                      {isLowStock ? (
                        <span className="text-rose-400 font-medium inline-flex items-center gap-1">
                          <AlertTriangle className="size-3" />
                          <span>Low: {p.inventory_count} units</span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          {p.inventory_count} in stock
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Fast Stock Adjuster & Actions */}
              {!isReadOnly && (
                <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span>Quick Stock:</span>
                    <button
                      type="button"
                      onClick={() => adjustStock(p, -1)}
                      className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
                      title="Decrease stock by 1"
                    >
                      <MinusCircle className="size-3.5" />
                    </button>
                    <span className="font-mono text-foreground font-semibold">{p.inventory_count}</span>
                    <button
                      type="button"
                      onClick={() => adjustStock(p, 1)}
                      className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
                      title="Increase stock by 1"
                    >
                      <PlusCircle className="size-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(p)}
                      className="p-1 rounded text-muted-foreground hover:text-foreground"
                      title="Edit Product"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-1 rounded text-muted-foreground hover:text-rose-400"
                      title="Delete Product"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
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
                {editingProduct ? 'Edit Product' : 'Add New Product'}
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
                  <label className="text-xs font-medium text-foreground">Product Title</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground"
                    placeholder="e.g. Titanium Bolt Pen"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">SKU Number</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground font-mono"
                    placeholder="APX-PEN-01"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">Product Copy & Specs</label>
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
                  placeholder="Material specs, dimensions, warranty, fit..."
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
                  <label className="text-xs font-medium text-foreground">Inventory Units in Stock</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={inventoryCount}
                    onChange={(e) => setInventoryCount(Number(e.target.value))}
                    className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Product Image URL</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground"
                  placeholder="https://images.unsplash.com/..."
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
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* AI Assistant */}
      <AiAssistModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        title="Enhance Product Specs"
        request={{
          action: 'improve_description',
          context: { businessName: website.name, topic: name },
        }}
        onApply={(text) => setDescription(text)}
      />
    </div>
  );
};
