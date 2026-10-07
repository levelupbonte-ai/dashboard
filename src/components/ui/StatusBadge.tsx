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

  const configs: Record<string, { text: string; bg: string; border: string; display: string }> = {
    // Website
    live: { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', display: 'Live' },
    online: { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', display: 'Online' },
    building: { text: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/25', display: 'In progress' },
    maintenance: { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25', display: 'Needs attention' },
    needs_attention: { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25', display: 'Needs attention' },
    offline: { text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/25', display: 'Offline' },

    // Requests
    submitted: { text: 'text-muted-foreground', bg: 'bg-muted/70', border: 'border-border', display: 'Pending' },
    in_review: { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25', display: 'Under review' },
    under_review: { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25', display: 'Under review' },
    in_progress: { text: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/25', display: 'In progress' },
    waiting_for_client: { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25', display: 'Needs attention' },
    completed: { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', display: 'Completed' },

    // Enquiries / Leads
    new: { text: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/25', display: 'New' },
    contacted: { text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/25', display: 'Contacted' },
    qualified: { text: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/25', display: 'Qualified' },
    converted: { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', display: 'Completed' },
    lost: { text: 'text-muted-foreground', bg: 'bg-muted/70', border: 'border-border', display: 'Cancelled' },

    // Appointments / Bookings
    confirmed: { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', display: 'Scheduled' },
    scheduled: { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', display: 'Scheduled' },
    pending: { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25', display: 'Pending' },
    cancelled: { text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/25', display: 'Cancelled' },

    // Invoices & Orders
    paid: { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', display: 'Paid' },
    open: { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25', display: 'Pending' },
    overdue: { text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/25', display: 'Past due' },
    past_due: { text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/25', display: 'Past due' },
    draft: { text: 'text-muted-foreground', bg: 'bg-muted/70', border: 'border-border', display: 'Draft' },
    processing: { text: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/25', display: 'In progress' },
    shipped: { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', display: 'Completed' },

    // Support
    resolved: { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', display: 'Completed' },
    waiting: { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25', display: 'Pending' },
  };

  const current = configs[normStatus] || {
    text: 'text-muted-foreground',
    bg: 'bg-muted/70',
    border: 'border-border',
    display: label || status,
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded border whitespace-nowrap tracking-tight transition-colors',
        current.bg,
        current.border,
        current.text,
        className
      )}
    >
      {label || current.display}
    </span>
  );
};
