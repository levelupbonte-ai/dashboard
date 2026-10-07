import React, { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Sparkles,
  CheckCircle2,
  CalendarCheck,
  X,
  Clock,
  DollarSign,
} from 'lucide-react';
import { Website, WebsiteService } from '../../../types';
import { websiteDataService } from '../../../services/websiteDataService';
import { AiAssistModal } from '../../shared/AiAssistModal';

interface ServicesManagerProps {
  website: Website;
  tenantId: string;
  isReadOnly?: boolean;
}

export const ServicesManager: React.FC<ServicesManagerProps> = ({
  website,
  tenantId,
  isReadOnly = false,
}) => {
  const [services, setServices] = useState<WebsiteService[]>(() =>
    websiteDataService.getServices(website.id)
  );

  const [toast, setToast] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<WebsiteService | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(100);
  const [duration, setDuration] = useState<number>(30);
  const [isBookingEnabled, setIsBookingEnabled] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<WebsiteService['status']>('published');

  // AI Modal
  const [isAiOpen, setIsAiOpen] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenCreate = () => {
    setEditingService(null);
    setName('');
    setCategory('General');
    setDescription('');
    setPrice(120);
    setDuration(30);
    setIsBookingEnabled(true);
    setIsFeatured(false);
    setStatus('published');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv: WebsiteService) => {
    setEditingService(srv);
    setName(srv.name);
    setCategory(srv.category);
    setDescription(srv.description);
    setPrice(srv.price);
    setDuration(srv.duration_minutes);
    setIsBookingEnabled(srv.is_booking_enabled);
    setIsFeatured(srv.is_featured);
    setStatus(srv.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    if (editingService) {
      websiteDataService.updateService(website.id, editingService.id, {
        name,
        category,
        description,
        price,
        duration_minutes: duration,
        is_booking_enabled: isBookingEnabled,
        is_featured: isFeatured,
        status,
      });
      showToast(`Service "${name}" updated.`);
    } else {
      websiteDataService.createService(website.id, tenantId, {
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        category,
        description,
        price,
        duration_minutes: duration,
        is_booking_enabled: isBookingEnabled,
        is_featured: isFeatured,
        status,
        sort_order: services.length + 1,
      });
      showToast(`Service "${name}" created.`);
    }

    setServices(websiteDataService.getServices(website.id));
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, srvName: string) => {
    if (isReadOnly) return;
    if (confirm(`Delete service "${srvName}"?`)) {
      websiteDataService.deleteService(website.id, id);
      setServices(websiteDataService.getServices(website.id));
      showToast(`Service "${srvName}" deleted.`);
    }
  };

  const handleToggleStatus = (srv: WebsiteService) => {
    if (isReadOnly) return;
    const nextStatus = srv.status === 'published' ? 'draft' : 'published';
    websiteDataService.updateService(website.id, srv.id, { status: nextStatus });
    setServices(websiteDataService.getServices(website.id));
    showToast(`Service status set to ${nextStatus}.`);
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
          <h3 className="text-sm font-semibold text-foreground">Services Catalog</h3>
          <p className="text-xs text-muted-foreground">
            Manage your clinical consultations, treatments, or corporate advisory offerings.
          </p>
        </div>

        {!isReadOnly && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs self-start sm:self-auto"
          >
            <Plus className="size-3.5" />
            <span>Create Service</span>
          </button>
        )}
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="p-4 rounded-lg bg-card border border-border flex flex-col justify-between gap-3 shadow-xs"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-mono font-medium text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                    {srv.category}
                  </span>
                  <h4 className="text-sm font-semibold text-foreground mt-1">{srv.name}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
                      srv.status === 'published'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-muted text-muted-foreground border-border'
                    }`}
                  >
                    {srv.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {srv.description}
              </p>

              <div className="flex items-center gap-4 text-xs font-medium text-foreground pt-1">
                <div className="flex items-center gap-1 text-emerald-500">
                  <DollarSign className="size-3.5" />
                  <span>${srv.price}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="size-3.5" />
                  <span>{srv.duration_minutes} min</span>
                </div>
                {srv.is_booking_enabled && (
                  <div className="flex items-center gap-1 text-primary text-[11px]">
                    <CalendarCheck className="size-3" />
                    <span>Online Booking</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {!isReadOnly && (
              <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(srv)}
                  className="text-muted-foreground hover:text-foreground hover:underline text-[11px]"
                >
                  {srv.status === 'published' ? 'Unpublish (Draft)' : 'Publish to site'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(srv)}
                    className="p-1 rounded text-muted-foreground hover:text-foreground"
                    title="Edit Service"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(srv.id, srv.name)}
                    className="p-1 rounded text-muted-foreground hover:text-rose-400"
                    title="Delete Service"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <form
            onSubmit={handleSave}
            className="w-full max-w-lg bg-card border border-border rounded-lg shadow-2xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/80">
              <h4 className="text-xs font-semibold text-foreground">
                {editingService ? 'Edit Service' : 'Create New Service'}
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
                  <label className="text-xs font-medium text-foreground">Service Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground"
                    placeholder="e.g. Telehealth Consultation"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Category</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground"
                    placeholder="e.g. Telehealth / Preventive"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">Service Description</label>
                  <button
                    type="button"
                    onClick={() => setIsAiOpen(true)}
                    className="text-[11px] text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <Sparkles className="size-3" />
                    <span>AI Generate</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded bg-background border border-border p-2.5 text-xs text-foreground resize-none leading-relaxed"
                  placeholder="Explain what the service entails, who it is for, and deliverables..."
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
                  <label className="text-xs font-medium text-foreground">Duration (Minutes)</label>
                  <input
                    type="number"
                    required
                    min={5}
                    step={5}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-1 text-xs">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBookingEnabled}
                    onChange={(e) => setIsBookingEnabled(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary size-4"
                  />
                  <span>Enable Online Booking</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary size-4"
                  />
                  <span>Feature on Homepage</span>
                </label>
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
                Save Service
              </button>
            </div>
          </form>
        </div>
      )}

      {/* AI Assistant */}
      <AiAssistModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        title="Draft Service Description"
        request={{
          action: 'generate_service',
          context: { businessName: website.name, topic: name },
        }}
        onApply={(text) => setDescription(text)}
      />
    </div>
  );
};
