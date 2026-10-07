import React, { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  X,
  Mail,
  Phone,
  Sparkles,
} from 'lucide-react';
import { Website, WebsiteTeamMember } from '../../../types';
import { websiteDataService } from '../../../services/websiteDataService';
import { AiAssistModal } from '../../shared/AiAssistModal';

interface TeamManagerProps {
  website: Website;
  tenantId: string;
  isReadOnly?: boolean;
}

export const TeamManager: React.FC<TeamManagerProps> = ({
  website,
  tenantId,
  isReadOnly = false,
}) => {
  const [members, setMembers] = useState<WebsiteTeamMember[]>(() =>
    websiteDataService.getTeamMembers(website.id)
  );

  const [toast, setToast] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<WebsiteTeamMember | null>(null);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialtiesText, setSpecialtiesText] = useState('');
  const [status, setStatus] = useState<WebsiteTeamMember['status']>('published');

  // AI Modal
  const [isAiOpen, setIsAiOpen] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenCreate = () => {
    setEditingMember(null);
    setName('');
    setRole('');
    setBio('');
    setPhotoUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
    setEmail('');
    setPhone('');
    setSpecialtiesText('');
    setStatus('published');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: WebsiteTeamMember) => {
    setEditingMember(m);
    setName(m.name);
    setRole(m.role);
    setBio(m.bio);
    setPhotoUrl(m.photo_url);
    setEmail(m.email || '');
    setPhone(m.phone || '');
    setSpecialtiesText(m.specialties.join(', '));
    setStatus(m.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    const specialties = specialtiesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingMember) {
      websiteDataService.updateTeamMember(website.id, editingMember.id, {
        name,
        role,
        bio,
        photo_url: photoUrl,
        email: email || undefined,
        phone: phone || undefined,
        specialties,
        status,
      });
      showToast(`Profile for "${name}" updated.`);
    } else {
      websiteDataService.createTeamMember(website.id, tenantId, {
        name,
        role,
        bio,
        photo_url: photoUrl,
        email: email || undefined,
        phone: phone || undefined,
        specialties,
        sort_order: members.length + 1,
        status,
      });
      showToast(`Team member "${name}" added.`);
    }

    setMembers(websiteDataService.getTeamMembers(website.id));
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, memName: string) => {
    if (isReadOnly) return;
    if (confirm(`Remove "${memName}" from team directory?`)) {
      websiteDataService.deleteTeamMember(website.id, id);
      setMembers(websiteDataService.getTeamMembers(website.id));
      showToast(`"${memName}" removed.`);
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
          <h3 className="text-sm font-semibold text-foreground">Team & Practitioners</h3>
          <p className="text-xs text-muted-foreground">
            Manage public team profiles, bios, credentials, and specialties.
          </p>
        </div>

        {!isReadOnly && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs self-start sm:self-auto"
          >
            <Plus className="size-3.5" />
            <span>Add Team Member</span>
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {members.map((m) => (
          <div
            key={m.id}
            className="p-4 rounded-lg bg-card border border-border flex flex-col justify-between gap-3 shadow-xs"
          >
            <div className="flex items-start gap-3">
              <img
                src={m.photo_url}
                alt={m.name}
                className="size-16 rounded-md object-cover border border-border shrink-0 bg-muted"
              />

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-semibold text-foreground truncate">{m.name}</h4>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                      m.status === 'published'
                        ? 'bg-muted text-foreground border-border/60'
                        : 'bg-muted/40 text-muted-foreground border-border/40'
                    }`}
                  >
                    {m.status === 'published' ? 'Active' : 'Draft'}
                  </span>
                </div>

                <div className="text-[11px] font-medium text-primary">{m.role}</div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {m.bio}
                </p>

                {/* Specialties */}
                {m.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {m.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="text-[10px] px-1.5 py-0.2 rounded bg-muted/60 text-muted-foreground"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions & Contact */}
            <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                {m.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="size-3" />
                    <span>{m.email}</span>
                  </div>
                )}
                {m.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="size-3" />
                    <span>{m.phone}</span>
                  </div>
                )}
              </div>

              {!isReadOnly && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(m)}
                    className="p-1 rounded text-muted-foreground hover:text-foreground"
                    title="Edit Member"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(m.id, m.name)}
                    className="p-1 rounded text-muted-foreground hover:text-rose-400"
                    title="Delete Member"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              )}
            </div>
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
                {editingMember ? 'Edit Profile' : 'Add Team Member'}
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
                  <label className="text-xs font-medium text-foreground">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground"
                    placeholder="e.g. Dr. Elena Rostova, MD"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Professional Role</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground"
                    placeholder="e.g. Chief Medical Officer"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">Executive / Clinical Bio</label>
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
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded bg-background border border-border p-2.5 text-xs text-foreground resize-none leading-relaxed"
                  placeholder="Education, career milestones, specialized care approach..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Photo URL</label>
                <input
                  type="url"
                  required
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Contact Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground"
                    placeholder="name@organization.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Specialties (Comma Separated)</label>
                  <input
                    type="text"
                    value={specialtiesText}
                    onChange={(e) => setSpecialtiesText(e.target.value)}
                    className="w-full h-8 rounded bg-background border border-border px-2.5 text-xs text-foreground"
                    placeholder="Cardiology, Telehealth, Longevity"
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
                Save Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* AI Assistant */}
      <AiAssistModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        title="Polish Professional Bio"
        request={{
          action: 'improve_description',
          currentText: bio,
          context: { businessName: website.name, topic: `${name} - ${role}` },
        }}
        onApply={(text) => setBio(text)}
      />
    </div>
  );
};
