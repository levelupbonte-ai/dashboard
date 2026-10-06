import React, { useState } from 'react';
import {
  LifeBuoy,
  PlusCircle,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  Paperclip,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';
import { useAuth } from '../../../context/AuthContext';
import { dataService } from '../../../services/dataService';
import { SupportTicket, RequestPriority } from '../../../types';
import { Button } from '../../ui/Button';
import { StatusBadge } from '../../ui/StatusBadge';
import { Modal } from '../../ui/Modal';
import { Drawer } from '../../ui/Drawer';
import { Input, Textarea } from '../../ui/Input';
import { EmptyState } from '../../shared/EmptyState';
import { formatDateTime, formatTimeAgo } from '../../../lib/utils';

export const SupportPage: React.FC = () => {
  const { currentTenant } = useTenant();
  const { user, role } = useAuth();

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

  // New ticket state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Technical Issue');
  const [priority, setPriority] = useState<RequestPriority>('medium');
  const [initialMessage, setInitialMessage] = useState('');

  const tickets = dataService.getSupportTickets(currentTenant.id);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !initialMessage.trim()) return;

    const created = dataService.createSupportTicket(
      currentTenant.id,
      {
        subject: subject.trim(),
        priority,
        status: 'open',
        category,
      },
      initialMessage.trim()
    );

    setIsNewTicketOpen(false);
    setSubject('');
    setInitialMessage('');
    setSelectedTicket(created);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    dataService.addTicketMessage(
      currentTenant.id,
      selectedTicket.id,
      user.full_name,
      role === 'admin' || role === 'super_admin' ? 'admin' : 'client',
      replyText.trim()
    );

    const updated = dataService
      .getSupportTickets(currentTenant.id)
      .find((t) => t.id === selectedTicket.id);
    if (updated) setSelectedTicket({ ...updated });
    setReplyText('');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">Support Desk</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Direct communication channel with LevelUp engineers and system architects.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsNewTicketOpen(true)}
          icon={<PlusCircle className="w-3.5 h-3.5" />}
        >
          Open Ticket
        </Button>
      </div>

      {/* Support SLA Banner */}
      <div className="p-3.5 rounded-lg border border-zinc-800 bg-[#0b0c10] flex items-center justify-between text-xs text-zinc-300">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-violet-400 shrink-0" />
          <div>
            <span className="font-semibold text-white">Care Plan SLA</span>
            <span className="text-zinc-400 ml-2">
              Assigned directly to on-call LevelUp engineering pods.
            </span>
          </div>
        </div>
        <div className="font-mono text-emerald-400 font-semibold text-[11px] hidden md:block">
          Target SLA &lt; 12h
        </div>
      </div>

      {/* Tickets List */}
      {tickets.length === 0 ? (
        <EmptyState
          icon={<LifeBuoy className="w-6 h-6 text-violet-400" />}
          title="No open tickets"
          description="Everything operational. Open a ticket if you need technical support."
          actionLabel="Open a Ticket"
          onAction={() => setIsNewTicketOpen(true)}
        />
      ) : (
        <div className="bg-[#0b0c10] border border-zinc-800 rounded-lg overflow-hidden shadow-xs divide-y divide-zinc-800/60">
          {tickets.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTicket(t)}
              className="p-3.5 sm:p-4 hover:bg-[#111218] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1 flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white group-hover:text-violet-300 transition-colors">
                    {t.subject}
                  </span>
                  <StatusBadge status={t.status} />
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">
                    {t.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
                  <span>#{t.id}</span>
                  <span>·</span>
                  <span>Updated {formatTimeAgo(t.updated_at)}</span>
                  <span>·</span>
                  <span>{t.messages.length} replies</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-zinc-400 shrink-0 self-end sm:self-center">
                <span className="text-[11px] font-mono hidden sm:inline">Thread</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-zinc-400" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Ticket Modal */}
      <Modal
        isOpen={isNewTicketOpen}
        onClose={() => setIsNewTicketOpen(false)}
        title="Open Support Ticket"
        description="Submit an inquiry to LevelUp engineering."
        maxWidth="md"
      >
        <form onSubmit={handleCreateTicket} className="space-y-3.5">
          <Input
            label="Subject"
            placeholder="e.g., Assistance configuring domain DNS for Google Workspace"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#12131a] border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 min-h-[38px]"
              >
                <option value="Technical Issue">Technical Issue</option>
                <option value="DNS & Domain">DNS & Domain</option>
                <option value="Email Configuration">Email Configuration</option>
                <option value="Billing & Invoicing">Billing & Invoicing</option>
                <option value="General Question">General Question</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as RequestPriority)}
                className="w-full bg-[#12131a] border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 min-h-[38px]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <Textarea
            label="Message"
            placeholder="Provide context or error messages..."
            rows={4}
            value={initialMessage}
            onChange={(e) => setInitialMessage(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2.5 pt-3 border-t border-zinc-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsNewTicketOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Submit Ticket
            </Button>
          </div>
        </form>
      </Modal>

      {/* Ticket Drawer */}
      {selectedTicket && (
        <Drawer
          isOpen={Boolean(selectedTicket)}
          onClose={() => setSelectedTicket(null)}
          title={selectedTicket.subject}
          subtitle={`#${selectedTicket.id} · Priority: ${selectedTicket.priority.toUpperCase()}`}
          width="lg"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0e0f14] border border-zinc-800">
              <div className="text-xs text-zinc-300 font-mono">
                Category: <strong>{selectedTicket.category}</strong>
              </div>
              <StatusBadge status={selectedTicket.status} />
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                Conversation History
              </h3>

              <div className="space-y-2.5">
                {selectedTicket.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-3 rounded-lg border text-xs leading-relaxed ${
                      m.sender_role === 'admin'
                        ? 'bg-[#10121a] border-violet-800/40 text-zinc-200'
                        : 'bg-[#0c0d12] border-zinc-800 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-zinc-800/60">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{m.sender_name}</span>
                        <span
                          className={`px-1.5 py-0.2 text-[9px] font-mono rounded ${
                            m.sender_role === 'admin'
                              ? 'bg-violet-950 text-violet-300'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {m.sender_role === 'admin' ? 'Staff' : 'Client'}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {formatTimeAgo(m.created_at)}
                      </span>
                    </div>
                    <p>{m.message}</p>
                  </div>
                ))}
              </div>

              {/* Reply form */}
              <form onSubmit={handleSendReply} className="pt-2 space-y-2">
                <Textarea
                  placeholder={`Reply as ${user.full_name}...`}
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    icon={<Send className="w-3.5 h-3.5" />}
                    disabled={!replyText.trim()}
                  >
                    Send Reply
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
