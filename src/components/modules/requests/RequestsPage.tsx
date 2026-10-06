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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Website Requests</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Submit modifications, copy revisions, and design tickets tracked under your Care Plan SLA.
          </p>
        </div>

        {/* View mode toggle (Kiranism Kanban vs Table) + Action button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 rounded-lg border border-zinc-800 bg-[#0c0d12]">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-mono transition-colors flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md text-xs font-mono transition-colors flex items-center gap-1.5 ${
                viewMode === 'kanban'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Kanban Board View"
            >
              <Kanban className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            icon={<PlusCircle className="w-3.5 h-3.5" />}
          >
            Request Change
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
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.label}
                <span className="ml-1 text-[10px] font-mono opacity-60">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[200px] sm:min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter requests..."
            className="w-full bg-[#0f1016] border border-zinc-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-600 min-h-[34px]"
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
                className="bg-[#0b0c10] border border-zinc-800/80 rounded-lg p-3 min-h-[360px] flex flex-col space-y-2.5 shadow-xs"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs font-mono font-medium text-zinc-300">
                  <span className="truncate">{col.label}</span>
                  <span className="px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">
                    {colRequests.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-2 flex-1">
                  {colRequests.length === 0 ? (
                    <div className="py-8 text-center text-[11px] font-mono text-zinc-600 border border-dashed border-zinc-800/60 rounded-md">
                      Empty
                    </div>
                  ) : (
                    colRequests.map((req) => (
                      <div
                        key={req.id}
                        onClick={() => setSelectedRequest(req)}
                        className="bg-[#101118] border border-zinc-800 hover:border-zinc-700 p-3 rounded-md transition-all cursor-pointer space-y-2 shadow-xs group"
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <h4 className="text-xs font-semibold text-white group-hover:text-violet-300 transition-colors line-clamp-2 leading-snug">
                            {req.title}
                          </h4>
                          <span
                            className={`text-[9px] font-mono uppercase font-bold px-1 rounded ${
                              req.priority === 'urgent'
                                ? 'text-rose-400 bg-rose-950/40'
                                : req.priority === 'high'
                                ? 'text-amber-400 bg-amber-950/40'
                                : 'text-zinc-400 bg-zinc-900'
                            }`}
                          >
                            {req.priority}
                          </span>
                        </div>

                        <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                          {req.description}
                        </p>

                        <div className="pt-1.5 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                          <span className="truncate max-w-[100px]">{req.website_name}</span>
                          <span className="inline-flex items-center gap-1">
                            <MessageSquare className="w-2.5 h-2.5" />
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
              icon={<FileCode2 className="w-6 h-6 text-violet-400" />}
              title="No requests found"
              description="You have no change requests under this filter."
              actionLabel="Request a Change"
              onAction={() => setIsCreateModalOpen(true)}
            />
          ) : (
            <div className="bg-[#0b0c10] border border-zinc-800 rounded-lg overflow-hidden shadow-xs divide-y divide-zinc-800/60">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className="p-3.5 sm:p-4 hover:bg-[#111218] transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-white group-hover:text-violet-300 transition-colors">
                        {req.title}
                      </span>
                      <StatusBadge status={req.status} />
                      <span className="px-1.5 py-0.2 text-[10px] font-mono uppercase bg-zinc-900 border border-zinc-800 text-zinc-400 rounded">
                        {req.category.replace('_', ' ')}
                      </span>
                      <span
                        className={`text-[10px] font-mono uppercase font-semibold ${
                          req.priority === 'urgent'
                            ? 'text-rose-400'
                            : req.priority === 'high'
                            ? 'text-amber-400'
                            : 'text-zinc-400'
                        }`}
                      >
                        {req.priority}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-1 leading-relaxed">
                      {req.description}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
                      <span>{req.website_name}</span>
                      <span>·</span>
                      <span>Created {formatTimeAgo(req.created_at)}</span>
                      {req.messages.length > 0 && (
                        <>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1 text-zinc-300">
                            <MessageSquare className="w-3 h-3" />
                            {req.messages.length}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 shrink-0 self-end md:self-center font-mono text-[11px]">
                    <span className="hidden sm:inline">Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-zinc-400" />
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
        title="Request a Change"
        description="Describe website updates. Staged and deployed under your Care Plan SLA."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateRequest} className="space-y-3.5">
          <Input
            label="Request Title"
            placeholder="e.g., Update doctor bio photos and headline"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Target Website</label>
              <select
                value={newWebsiteId}
                onChange={(e) => setNewWebsiteId(e.target.value)}
                className="w-full bg-[#12131a] border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 min-h-[38px]"
              >
                {websites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.domain})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as RequestCategory)}
                className="w-full bg-[#12131a] border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 min-h-[38px]"
              >
                <option value="content">Content & Text Update</option>
                <option value="new_section">New Website Section</option>
                <option value="new_page">Add a New Page</option>
                <option value="design">Design & Visual Tweak</option>
                <option value="booking">Modify Booking System</option>
                <option value="ecommerce">E-Commerce Store Change</option>
                <option value="seo">SEO & Metadata Request</option>
                <option value="bug">Bug Report / Fix</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Priority</label>
            <div className="grid grid-cols-4 gap-2">
              {(['low', 'medium', 'high', 'urgent'] as RequestPriority[]).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setNewPriority(p)}
                  className={`py-1.5 text-xs font-mono uppercase rounded-md border text-center transition-colors min-h-[36px] ${
                    newPriority === p
                      ? 'bg-zinc-800 text-white border-zinc-600 font-semibold'
                      : 'border-zinc-800 text-zinc-400 hover:bg-zinc-900/60'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <Textarea
            label="Specifications"
            placeholder="Describe changes in detail..."
            rows={4}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            required
          />

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Submit Request
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
          subtitle={`Ticket #${selectedRequest.id} · ${selectedRequest.website_name}`}
          width="xl"
        >
          <div className="space-y-5">
            <div className="p-3.5 rounded-lg bg-[#0e0f14] border border-zinc-800 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-[10px] uppercase font-mono text-zinc-400">Current Status</div>
                <StatusBadge status={selectedRequest.status} />
              </div>

              <div className="space-y-0.5 text-right">
                <div className="text-[10px] uppercase font-mono text-zinc-400">Priority</div>
                <div className="text-xs font-mono uppercase font-bold text-violet-300">
                  {selectedRequest.priority}
                </div>
              </div>

              {isAdmin && (
                <div className="space-y-0.5">
                  <div className="text-[10px] uppercase font-mono text-violet-400 font-bold">Admin Status</div>
                  <select
                    value={selectedRequest.status}
                    onChange={(e) => handleStatusChange(e.target.value as RequestStatus)}
                    className="bg-[#0b0c10] text-xs text-white border border-zinc-700 rounded px-2 py-1 font-mono"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="in_review">In Review</option>
                    <option value="in_progress">In Progress</option>
                    <option value="waiting_for_client">Waiting for Client</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                Specifications
              </h3>
              <div className="p-3.5 rounded-lg bg-[#0c0d12] border border-zinc-800 text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans">
                {selectedRequest.description}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono">
                Submitted on {formatDateTime(selectedRequest.created_at)}
              </div>
            </div>

            <div className="space-y-3 pt-3.5 border-t border-zinc-800">
              <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-violet-400" />
                Discussion & Staging Updates ({selectedRequest.messages.length})
              </h3>

              {selectedRequest.messages.length === 0 ? (
                <div className="p-5 text-center text-xs text-zinc-400 border border-zinc-800 rounded-lg font-mono">
                  No replies yet. Staging URLs and feedback will appear here.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {selectedRequest.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-lg border text-xs leading-relaxed ${
                        msg.sender_role === 'admin' || msg.sender_role === 'super_admin'
                          ? 'bg-[#10121a] border-violet-800/40 text-zinc-200'
                          : 'bg-[#0c0d12] border-zinc-800 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-zinc-800/60">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{msg.sender_name}</span>
                          <span
                            className={`px-1.5 py-0.2 text-[9px] font-mono rounded ${
                              msg.sender_role === 'admin'
                                ? 'bg-violet-950 text-violet-300 border border-violet-800/40'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {msg.sender_role === 'admin' ? 'Staff' : 'Client'}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-mono">
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
                  placeholder={`Reply as ${user.full_name}...`}
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
