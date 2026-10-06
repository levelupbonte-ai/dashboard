import React, { useState } from 'react';
import {
  Users2,
  Search,
  Filter,
  PlusCircle,
  Phone,
  Mail,
  DollarSign,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Save,
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';
import { dataService } from '../../../services/dataService';
import { Lead, LeadStatus } from '../../../types';
import { Button } from '../../ui/Button';
import { StatusBadge } from '../../ui/StatusBadge';
import { Modal } from '../../ui/Modal';
import { Drawer } from '../../ui/Drawer';
import { Input, Textarea } from '../../ui/Input';
import { EmptyState } from '../../shared/EmptyState';
import { formatDateTime, formatTimeAgo, formatCurrency } from '../../../lib/utils';

export const LeadsPage: React.FC = () => {
  const { currentTenant, websites } = useTenant();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

  // Notes state inside drawer
  const [currentNotes, setCurrentNotes] = useState('');

  // Add lead form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSource, setNewSource] = useState('Contact Form');
  const [newValue, setNewValue] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const leads = dataService.getLeads(currentTenant.id);

  const filteredLeads = leads.filter((lead) => {
    if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        lead.source.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenLead = (lead: Lead) => {
    setSelectedLead(lead);
    setCurrentNotes(lead.notes || '');
  };

  const handleUpdateStatus = (status: LeadStatus) => {
    if (!selectedLead) return;
    dataService.updateLeadStatus(currentTenant.id, selectedLead.id, status, currentNotes);
    setSelectedLead({ ...selectedLead, status, notes: currentNotes });
  };

  const handleSaveNotes = () => {
    if (!selectedLead) return;
    dataService.updateLeadStatus(currentTenant.id, selectedLead.id, selectedLead.status, currentNotes);
    setSelectedLead({ ...selectedLead, notes: currentNotes });
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    dataService.createLead(currentTenant.id, {
      website_id: websites[0]?.id || '',
      website_name: websites[0]?.domain || currentTenant.slug,
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim() || undefined,
      source: newSource,
      status: 'new',
      value: newValue ? parseFloat(newValue) : 0,
      notes: newNotes.trim() || undefined,
    });

    setIsAddLeadModalOpen(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewValue('');
    setNewNotes('');
  };

  const statuses: { id: string; label: string }[] = [
    { id: 'all', label: 'All Leads' },
    { id: 'new', label: 'New' },
    { id: 'contacted', label: 'Contacted' },
    { id: 'qualified', label: 'Qualified' },
    { id: 'converted', label: 'Converted' },
    { id: 'lost', label: 'Lost' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-border">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">Leads & Inquiries</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time pipeline captures from contact forms and quote calculators.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddLeadModalOpen(true)}
          icon={<PlusCircle className="size-3.5" />}
        >
          Add Lead Manually
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Status filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none border-b border-border/80 md:border-none">
          {statuses.map((tab) => {
            const isActive = statusFilter === tab.id;
            const count =
              tab.id === 'all' ? leads.length : leads.filter((l) => l.status === tab.id).length;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap min-h-[36px] ${
                  isActive
                    ? 'bg-accent text-accent-foreground font-semibold shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
                }`}
              >
                {tab.label}
                <span className="ml-1 text-[10px] font-mono opacity-60">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[200px] sm:min-w-[240px]">
          <Search className="size-3.5 text-muted-foreground absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads..."
            className="w-full bg-card border border-border rounded-md pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border min-h-[36px]"
          />
        </div>
      </div>

      {/* Leads Container (Card list on mobile, Table on tablet/desktop) */}
      {filteredLeads.length === 0 ? (
        <EmptyState
          icon={<Users2 className="size-6 text-foreground" />}
          title="No leads found"
          description="Inbound leads submitted on your websites will appear here."
          actionLabel="Add Lead"
          onAction={() => setIsAddLeadModalOpen(true)}
        />
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-xs">
          {/* Mobile Card List */}
          <div className="sm:hidden divide-y divide-border/60">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => handleOpenLead(lead)}
                className="p-3.5 hover:bg-accent/40 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold text-foreground">{lead.name}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">{lead.email}</div>
                  </div>
                  <StatusBadge status={lead.status} />
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span className="truncate max-w-[170px]">{lead.source}</span>
                  <span className="text-emerald-500 font-medium">
                    {lead.value ? formatCurrency(lead.value) : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Tablet & Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-muted-foreground font-mono uppercase text-[10px]">
                  <th className="py-2.5 px-3.5 font-medium">Name</th>
                  <th className="py-2.5 px-3.5 font-medium">Contact</th>
                  <th className="py-2.5 px-3.5 font-medium">Source / Site</th>
                  <th className="py-2.5 px-3.5 font-medium">Value</th>
                  <th className="py-2.5 px-3.5 font-medium">Captured</th>
                  <th className="py-2.5 px-3.5 font-medium">Status</th>
                  <th className="py-2.5 px-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => handleOpenLead(lead)}
                    className="hover:bg-accent/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-3.5">
                      <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {lead.name}
                      </div>
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="text-foreground font-mono">{lead.email}</div>
                      {lead.phone && (
                        <div className="text-[10px] text-muted-foreground font-mono">{lead.phone}</div>
                      )}
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="text-foreground">{lead.source}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{lead.website_name}</div>
                    </td>
                    <td className="py-3 px-3.5 font-mono tabular-nums text-emerald-500 font-semibold">
                      {lead.value ? formatCurrency(lead.value) : '—'}
                    </td>
                    <td className="py-3 px-3.5 text-muted-foreground font-mono text-[11px]">
                      {formatDateTime(lead.created_at)}
                    </td>
                    <td className="py-3 px-3.5">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono text-[11px] text-muted-foreground group-hover:text-foreground">
                      Inspect &rarr;
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lead Details Mini-CRM Drawer */}
      {selectedLead && (
        <Drawer
          isOpen={Boolean(selectedLead)}
          onClose={() => setSelectedLead(null)}
          title={selectedLead.name}
          subtitle={`Source: ${selectedLead.source} · ${selectedLead.website_name}`}
          width="lg"
        >
          <div className="space-y-5">
            {/* Status Change Strip */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono">
                Pipeline Stage
              </label>
              <div className="grid grid-cols-5 gap-1">
                {(['new', 'contacted', 'qualified', 'converted', 'lost'] as LeadStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(st)}
                      className={`py-1.5 text-[11px] font-mono capitalize rounded border text-center transition-all min-h-[34px] ${
                        selectedLead.status === st
                          ? 'bg-zinc-800 text-white border-zinc-600 font-bold'
                          : 'border-zinc-800 text-zinc-400 hover:bg-zinc-900/60'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="p-3.5 rounded-lg bg-[#0e0f14] border border-zinc-800 space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <Mail className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="font-mono hover:text-white hover:underline truncate"
                >
                  {selectedLead.email}
                </a>
              </div>

              {selectedLead.phone && (
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="font-mono hover:text-white hover:underline"
                  >
                    {selectedLead.phone}
                  </a>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <DollarSign className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  Opportunity Value:{' '}
                  <strong className="text-emerald-400 font-mono">
                    {selectedLead.value ? formatCurrency(selectedLead.value) : 'Not assigned'}
                  </strong>
                </span>
              </div>
            </div>

            {/* CRM Notes */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                  Interaction Notes
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSaveNotes}
                  icon={<Save className="w-3 h-3" />}
                >
                  Save
                </Button>
              </div>
              <Textarea
                rows={4}
                value={currentNotes}
                onChange={(e) => setCurrentNotes(e.target.value)}
                placeholder="Log follow-ups, requirements, budget discussed..."
              />
            </div>

            {/* Timeline info */}
            <div className="pt-3 border-t border-zinc-800 text-[10px] text-zinc-400 font-mono space-y-0.5">
              <div>Lead ID: {selectedLead.id}</div>
              <div>Captured: {formatDateTime(selectedLead.created_at)}</div>
            </div>
          </div>
        </Drawer>
      )}

      {/* Manual Add Lead Modal */}
      <Modal
        isOpen={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
        title="Add Inbound Lead"
        description="Log an inquiry received via phone, partner referral, or event."
        maxWidth="md"
      >
        <form onSubmit={handleAddLead} className="space-y-3.5">
          <Input
            label="Full Name"
            placeholder="e.g., Jonathan Sterling"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Email Address"
              type="email"
              placeholder="lead@company.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
            <Input
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Source</label>
              <select
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
                className="w-full bg-[#12131a] border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 min-h-[38px]"
              >
                <option value="Contact Form">Website Form</option>
                <option value="Phone Call">Direct Phone</option>
                <option value="Referral">Referral</option>
                <option value="Event">Event</option>
              </select>
            </div>

            <Input
              label="Estimated Value ($)"
              type="number"
              placeholder="e.g., 2500"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
          </div>

          <Textarea
            label="Notes"
            placeholder="Requirements or service scope..."
            rows={2}
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
          />

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAddLeadModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Lead
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
