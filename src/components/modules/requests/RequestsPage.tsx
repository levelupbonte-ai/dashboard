import React, { useState } from 'react';
import {
  FileCode2,
  PlusCircle,
  Filter,
  Search,
  MessageSquare,
  Clock,
  Send,
  AlertCircle,
  CheckCircle2,
  Paperclip,
  ArrowRight,
  ExternalLink,
  Kanban,
  Table as TableIcon,
  MoreHorizontal,
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';
import { useAuth } from '../../../context/AuthContext';
import { dataService } from '../../../services/dataService';
import { ChangeRequest, RequestCategory, RequestPriority, RequestStatus, Website } from '../../../types';
import { Button } from '../../ui/Button';
import { StatusBadge } from '../../ui/StatusBadge';
import { Drawer } from '../../ui/Drawer';
import { Modal } from '../../ui/Modal';
import { Input, Textarea } from '../../ui/Input';
import { EmptyState } from '../../shared/EmptyState';
import { Badge } from '../../ui/badge';
import { formatDateTime, formatTimeAgo } from '../../../lib/utils';

interface RequestsPageProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  preselectedSite?: Website | null;
}

export const RequestsPage: React.FC<RequestsPageProps> = ({
  isCreateModalOpen,
  setIsCreateModalOpen,
  preselectedSite,
}) => {
  const { currentTenant, websites } = useTenant();
  const { user, role, isAdmin } = useAuth();

  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<ChangeRequest | null>(null);
  const [replyText, setReplyText] = useState('');

  // Form State for new request
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<RequestCategory>('content');
  const [newPriority, setNewPriority] = useState<RequestPriority>('medium');
  const [newWebsiteId, setNewWebsiteId] = useState<string>(
    preselectedSite?.id || websites[0]?.id || ''
  );

  const requests = dataService.getRequests(currentTenant.id);

  const filteredRequests = requests.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const targetSite = websites.find((s) => s.id === newWebsiteId) || websites[0];

    const created = dataService.createRequest(currentTenant.id, {
      website_id: targetSite?.id || '',
      website_name: targetSite?.domain || 'Global Site',
      title: newTitle.trim(),
      description: newDescription.trim(),
      category: newCategory,
      priority: newPriority,
      status: 'submitted',
    });

    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setSelectedRequest(created);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !replyText.trim()) return;

    dataService.addRequestMessage(
      currentTenant.id,
      selectedRequest.id,
      user.full_name,
      role,
      replyText.trim()
    );

    const updated = dataService
      .getRequests(currentTenant.id)
      .find((r) => r.id === selectedRequest.id);
    if (updated) setSelectedRequest({ ...updated });
    setReplyText('');
  };

  const handleStatusChange = (newStatus: RequestStatus) => {
    if (!selectedRequest) return;
    dataService.updateRequestStatus(currentTenant.id, selectedRequest.id, newStatus);
    const updated = dataService
      .getRequests(currentTenant.id)
      .find((r) => r.id === selectedRequest.id);
    if (updated) setSelectedRequest({ ...updated });
  };

  const kanbanColumns: { id: RequestStatus; label: string }[] = [
    { id: 'submitted', label: 'Submitted' },
    { id: 'in_review', label: 'In Review' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'waiting_for_client', label: 'Waiting for Client' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Open requests</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Submit and track updates for your website.
          </p>
        </div>

        {/* View mode toggle + Action button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 rounded-lg border border-border bg-card">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs transition-colors flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-muted text-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="List view"
            >
              <TableIcon className="size-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md text-xs transition-colors flex items-center gap-1.5 ${
                viewMode === 'kanban'
                  ? 'bg-muted text-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Board view"
            >
              <Kanban className="size-3.5" />
              <span className="hidden sm:inline">Board</span>
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            icon={<PlusCircle className="size-3.5" />}
          >
            Request a change
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {([
            { id: 'all', label: 'All Requests' },
            { id: 'submitted', label: 'Submitted' },
            { id: 'in_review', label: 'In Review' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'waiting_for_client', label: 'Waiting' },
            { id: 'completed', label: 'Completed' },
          ] as const).map((tab) => {
            const isActive = statusFilter === tab.id;
            const count =
              tab.id === 'all'
                ? requests.length
                : requests.filter((r) => r.status === tab.id).length;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap min-h-[34px] ${
                  isActive
                    ? 'bg-accent text-accent-foreground font-semibold shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
                <span className="ml-1 text-[10px] font-mono opacity-60">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[200px] sm:min-w-[240px]">
          <Search className="size-3.5 text-muted-foreground absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter requests..."
            className="w-full bg-card border border-border rounded-md pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border min-h-[34px]"
          />
        </div>
      </div>

      {/* VIEW MODE 1: KANBAN BOARD (Kiranism dnd-kit / Kanban style) */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 overflow-x-auto pb-4">
          {kanbanColumns.map((col) => {
            const colRequests = requests.filter((r) => r.status === col.id);
            return (
              <div
                key={col.id}
                className="bg-card border border-border rounded-lg p-3 min-h-[360px] flex flex-col space-y-2.5 shadow-xs"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-border text-xs font-mono font-medium text-foreground">
                  <span className="truncate">{col.label}</span>
                  <span className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] text-muted-foreground">
                    {colRequests.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-2 flex-1">
                  {colRequests.length === 0 ? (
                    <div className="py-8 text-center text-[11px] font-mono text-muted-foreground border border-dashed border-border/80 rounded-md">
                      Empty
                    </div>
                  ) : (
                    colRequests.map((req) => (
                      <div
                        key={req.id}
                        onClick={() => setSelectedRequest(req)}
                        className="bg-muted/40 border border-border hover:border-border/80 p-3 rounded-md transition-all cursor-pointer space-y-2 shadow-xs group"
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                            {req.title}
                          </h4>
                          <span
                            className={`text-[9px] font-mono uppercase font-bold px-1 rounded ${
                              req.priority === 'urgent'
                                ? 'text-destructive bg-destructive/10'
                                : req.priority === 'high'
                                ? 'text-amber-500 bg-amber-500/10'
                                : 'text-muted-foreground bg-muted'
                            }`}
                          >
                            {req.priority}
                          </span>
                        </div>

                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                          {req.description}
                        </p>

                        <div className="pt-1.5 border-t border-border/60 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                          <span className="truncate max-w-[100px]">{req.website_name}</span>
                          <span className="inline-flex items-center gap-1">
                            <MessageSquare className="size-2.5" />
                            {req.messages.length}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: TABLE VIEW */}
      {viewMode === 'table' && (
        <>
          {filteredRequests.length === 0 ? (
            <EmptyState
              icon={<FileCode2 className="size-6 text-foreground" />}
              title="No requests yet"
              description="When you need an update to your website, submit a request here."
              actionLabel="Request a change"
              onAction={() => setIsCreateModalOpen(true)}
            />
          ) : (
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-xs divide-y divide-border/80">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className="p-3.5 sm:p-4 hover:bg-accent/50 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                        {req.title}
                      </span>
                      <StatusBadge status={req.status} />
                      <span className="px-1.5 py-0.2 text-[10px] font-mono uppercase bg-muted border border-border text-muted-foreground rounded">
                        {req.category.replace('_', ' ')}
                      </span>
                      <span
                        className={`text-[10px] font-mono uppercase font-semibold ${
                          req.priority === 'urgent'
                            ? 'text-destructive'
                            : req.priority === 'high'
                            ? 'text-amber-500'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {req.priority}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
                      {req.description}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                      <span>{req.website_name}</span>
                      <span>·</span>
                      <span>Created {formatTimeAgo(req.created_at)}</span>
                      {req.messages.length > 0 && (
                        <>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1 text-foreground">
                            <MessageSquare className="w-3 h-3" />
                            {req.messages.length}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 self-end md:self-center font-mono text-[11px]">
                    <span className="hidden sm:inline">Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* New Request Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Request a change"
        description="Tell us what you would like updated on your website."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateRequest} className="space-y-3.5">
          <Input
            label="Summary"
            placeholder="e.g., Update team photos and opening hours"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Website</label>
              <select
                value={newWebsiteId}
                onChange={(e) => setNewWebsiteId(e.target.value)}
                className="w-full bg-card border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:border-border min-h-[38px]"
              >
                {websites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.domain})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Type of change</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as RequestCategory)}
                className="w-full bg-card border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:border-border min-h-[38px]"
              >
                <option value="content">Text or images</option>
                <option value="new_section">New page section</option>
                <option value="new_page">New page</option>
                <option value="design">Design adjustment</option>
                <option value="booking">Appointments / bookings</option>
                <option value="ecommerce">Online store</option>
                <option value="seo">Search visibility (SEO)</option>
                <option value="bug">Fix an issue</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Priority</label>
            <div className="grid grid-cols-4 gap-2">
              {(['low', 'medium', 'high', 'urgent'] as RequestPriority[]).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setNewPriority(p)}
                  className={`py-1.5 text-xs capitalize rounded-md border text-center transition-colors min-h-[36px] ${
                    newPriority === p
                      ? 'bg-accent text-accent-foreground border-border font-semibold shadow-2xs'
                      : 'border-border text-muted-foreground hover:bg-accent/40 hover:text-foreground'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <Textarea
            label="Details"
            placeholder="Describe what needs to be changed..."
            rows={4}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            required
          />

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Send request
            </Button>
          </div>
        </form>
      </Modal>

      {/* Request Detail Drawer */}
      {selectedRequest && (
        <Drawer
          isOpen={Boolean(selectedRequest)}
          onClose={() => setSelectedRequest(null)}
          title={selectedRequest.title}
          subtitle={selectedRequest.website_name}
          width="xl"
        >
          <div className="space-y-5">
            <div className="p-3.5 rounded-lg bg-card border border-border flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs text-muted-foreground">Status</div>
                <StatusBadge status={selectedRequest.status} />
              </div>

              <div className="space-y-0.5 text-right">
                <div className="text-xs text-muted-foreground">Priority</div>
                <div className="text-xs capitalize font-semibold text-foreground">
                  {selectedRequest.priority}
                </div>
              </div>

              {isAdmin && (
                <div className="space-y-0.5">
                  <div className="text-xs text-muted-foreground">Update status</div>
                  <select
                    value={selectedRequest.status}
                    onChange={(e) => handleStatusChange(e.target.value as RequestStatus)}
                    className="bg-card text-xs text-foreground border border-border rounded px-2 py-1"
                  >
                    <option value="submitted">Pending</option>
                    <option value="in_review">Under review</option>
                    <option value="in_progress">In progress</option>
                    <option value="waiting_for_client">Needs attention</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs font-medium text-muted-foreground">
                Request details
              </h3>
              <div className="p-3.5 rounded-lg bg-card border border-border text-xs text-foreground leading-relaxed whitespace-pre-wrap font-sans">
                {selectedRequest.description}
              </div>
              <div className="text-xs text-muted-foreground">
                Submitted {formatDateTime(selectedRequest.created_at)}
              </div>
            </div>

            <div className="space-y-3 pt-3.5 border-t border-border">
              <h3 className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                Messages ({selectedRequest.messages.length})
              </h3>

              {selectedRequest.messages.length === 0 ? (
                <div className="p-5 text-center text-xs text-muted-foreground border border-border rounded-lg">
                  No messages yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {selectedRequest.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-lg border text-xs leading-relaxed ${
                        msg.sender_role === 'admin' || msg.sender_role === 'super_admin'
                          ? 'bg-muted/60 border-border text-foreground'
                          : 'bg-card border-border text-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-border/60">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{msg.sender_name}</span>
                          <span
                            className={`px-1.5 py-0.5 text-[10px] rounded ${
                              msg.sender_role === 'admin'
                                ? 'bg-primary text-primary-foreground font-medium'
                                : 'bg-muted text-muted-foreground border border-border'
                            }`}
                          >
                            {msg.sender_role === 'admin' ? 'Support' : 'Team'}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(msg.created_at)}
                        </span>
                      </div>
                      <p>{msg.message}</p>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleSendReply} className="pt-2 space-y-2">
                <Textarea
                  placeholder="Write a message..."
                  rows={2}
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
                    Send message
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
