import React from 'react';
import { cn } from '../../lib/utils';

type StatusType =
  | 'live'
  | 'online'
  | 'needs_attention'
  | 'submitted'
  | 'in_review'
  | 'under_review'
  | 'in_progress'
  | 'waiting_for_client'
  | 'completed'
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'converted'
  | 'lost'
  | 'confirmed'
  | 'scheduled'
  | 'pending'
  | 'cancelled'
  | 'paid'
  | 'open'
  | 'overdue'
  | 'past_due'
  | 'draft'
  | 'resolved';

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className }) => {
  const normStatus = (status || '').toLowerCase().replace(/\s+/g, '_');

  const configs: Record<string, { dot: string; text: string; bg: string; border: string; display: string }> = {
    // Website
    live: { dot: 'bg-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', display: 'Live' },
    online: { dot: 'bg-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', display: 'Online' },
    building: { dot: 'bg-amber-500', text: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', display: 'In progress' },
    maintenance: { dot: 'bg-amber-500', text: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', display: 'Needs attention' },
    needs_attention: { dot: 'bg-amber-500', text: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', display: 'Needs attention' },
    offline: { dot: 'bg-rose-500', text: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', display: 'Offline' },

    // Requests
    submitted: { dot: 'bg-sky-500', text: 'text-sky-500', bg: 'bg-sky-500/10', border: 'border-sky-500/20', display: 'Pending' },
    in_review: { dot: 'bg-amber-500', text: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', display: 'Under review' },
    under_review: { dot: 'bg-amber-500', text: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', display: 'Under review' },
    in_progress: { dot: 'bg-primary', text: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', display: 'In progress' },
    waiting_for_client: { dot: 'bg-amber-500', text: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', display: 'Needs attention' },
    completed: { dot: 'bg-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', display: 'Completed' },

    // Enquiries / Leads
    new: { dot: 'bg-sky-500', text: 'text-sky-500', bg: 'bg-sky-500/10', border: 'border-sky-500/20', display: 'New' },
    contacted: { dot: 'bg-blue-500', text: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', display: 'Contacted' },
    qualified: { dot: 'bg-primary', text: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', display: 'Qualified' },
    converted: { dot: 'bg-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', display: 'Completed' },
    lost: { dot: 'bg-muted-foreground', text: 'text-muted-foreground', bg: 'bg-muted', border: 'border-border', display: 'Cancelled' },

    // Appointments / Bookings
    confirmed: { dot: 'bg-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', display: 'Scheduled' },
    scheduled: { dot: 'bg-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', display: 'Scheduled' },
    pending: { dot: 'bg-amber-500', text: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', display: 'Pending' },
    cancelled: { dot: 'bg-rose-500', text: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', display: 'Cancelled' },

    // Invoices & Orders
    paid: { dot: 'bg-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', display: 'Paid' },
    open: { dot: 'bg-amber-500', text: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', display: 'Pending' },
    overdue: { dot: 'bg-rose-500', text: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', display: 'Past due' },
    past_due: { dot: 'bg-rose-500', text: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', display: 'Past due' },
    draft: { dot: 'bg-muted-foreground', text: 'text-muted-foreground', bg: 'bg-muted', border: 'border-border', display: 'Draft' },
    processing: { dot: 'bg-amber-500', text: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', display: 'In progress' },
    shipped: { dot: 'bg-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', display: 'Completed' },

    // Support
    resolved: { dot: 'bg-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', display: 'Completed' },
    waiting: { dot: 'bg-amber-500', text: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', display: 'Pending' },
  };

  const current = configs[normStatus] || {
    dot: 'bg-muted-foreground',
    text: 'text-foreground',
    bg: 'bg-muted',
    border: 'border-border',
    display: label || status,
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-md border whitespace-nowrap',
        current.bg,
        current.border,
        current.text,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', current.dot)} />
      <span>{label || current.display}</span>
    </span>
  );
};
