import React, { useState } from 'react';
import {
  LifeBuoy,
  PlusCircle,
  Send,
  ArrowRight,
  Clock,
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
import { formatTimeAgo } from '../../../lib/utils';

export const SupportPage: React.FC = () => {
  const { currentTenant } = useTenant();
  const { user, role } = useAuth();

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

  // New ticket state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Website issue');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-border">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">Support</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Get help with your website, domain, or account
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsNewTicketOpen(true)}
          icon={<PlusCircle className="size-3.5" />}
        >
          Contact support
        </Button>
      </div>

      {/* Response time info */}
      <div className="p-3.5 rounded-lg border border-border bg-card flex items-center justify-between text-xs text-foreground">
        <div className="flex items-center gap-2.5">
          <Clock className="size-4 text-muted-foreground shrink-0" />
          <div>
            <span className="font-medium text-foreground">Support hours:</span>
            <span className="text-muted-foreground ml-1.5">
              Monday to Friday, 9:00 AM – 6:00 PM
            </span>
          </div>
        </div>
        <div className="text-muted-foreground hidden md:block">
          Typical response: under 12 hours
        </div>
      </div>

      {/* Tickets List */}
      {tickets.length === 0 ? (
        <EmptyState
          icon={<LifeBuoy className="size-6 text-foreground" />}
          title="No support messages"
          description="Send a message if you need help with your website or billing."
          actionLabel="Contact support"
          onAction={() => setIsNewTicketOpen(true)}
        />
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-xs divide-y divide-border/60">
          {tickets.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTicket(t)}
              className="p-3.5 sm:p-4 hover:bg-accent/40 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1 flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    {t.subject}
                  </span>
                  <StatusBadge status={t.status} />
                  <span className="text-xs text-muted-foreground">
                    {t.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Updated {formatTimeAgo(t.updated_at)}</span>
                  <span>·</span>
                  <span>{t.messages.length} messages</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 self-end sm:self-center">
                <span className="hidden sm:inline">View</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Support Message Modal */}
      <Modal
        isOpen={isNewTicketOpen}
        onClose={() => setIsNewTicketOpen(false)}
        title="Contact support"
        description="Send a message to our support team."
        maxWidth="md"
      >
        <form onSubmit={handleCreateTicket} className="space-y-3.5">
          <Input
            label="Subject"
            placeholder="e.g., Question about domain email setup"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Topic</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-card border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:border-border min-h-[38px]"
              >
                <option value="Website issue">Website issue</option>
                <option value="Domain & DNS">Domain & DNS</option>
                <option value="Email setup">Email setup</option>
                <option value="Billing">Billing</option>
                <option value="General question">General question</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as RequestPriority)}
                className="w-full bg-card border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:border-border min-h-[38px]"
              >
                <option value="low">Low</option>
                <option value="medium">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <Textarea
            label="Message"
            placeholder="How can we help?"
            rows={4}
            value={initialMessage}
            onChange={(e) => setInitialMessage(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsNewTicketOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Send message
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
          subtitle={selectedTicket.category}
          width="lg"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
              <div className="text-xs text-foreground">
                Topic: <strong>{selectedTicket.category}</strong>
              </div>
              <StatusBadge status={selectedTicket.status} />
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-medium text-muted-foreground">
                Messages
              </h3>

              <div className="space-y-2.5">
                {selectedTicket.messages.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-lg border border-border bg-card text-xs leading-relaxed"
                  >
                    <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-border/60">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{m.sender_name}</span>
                        <span
                          className={`px-1.5 py-0.5 text-[10px] rounded ${
                            m.sender_role === 'admin'
                              ? 'bg-primary text-primary-foreground font-medium'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {m.sender_role === 'admin' ? 'Support' : 'You'}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(m.created_at)}
                      </span>
                    </div>
                    <p className="text-foreground">{m.message}</p>
                  </div>
                ))}
              </div>

              {/* Reply form */}
              <form onSubmit={handleSendReply} className="pt-2 space-y-2">
                <Textarea
                  placeholder="Write a reply..."
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    icon={<Send className="size-3.5" />}
                    disabled={!replyText.trim()}
                  >
                    Send reply
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
