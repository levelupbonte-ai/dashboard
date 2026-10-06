import React from 'react';
import { cn } from '../../lib/utils';

type StatusType =
  | 'live'
  | 'submitted'
  | 'in_review'
  | 'in_progress'
  | 'waiting_for_client'
  | 'completed'
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'converted'
  | 'lost'
  | 'confirmed'
  | 'pending'
  | 'cancelled'
  | 'paid'
  | 'open'
  | 'resolved';

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className }) => {
  const normStatus = (status || '').toLowerCase().replace(/\s+/g, '_');

  const configs: Record<string, { dot: string; text: string; bg: string; border: string; display: string }> = {
    // Website & runtime
    live: { dot: 'bg-emerald-400', text: 'text-emerald-300', bg: 'bg-emerald-950/20', border: 'border-emerald-800/40', display: 'Live' },
    building: { dot: 'bg-amber-400', text: 'text-amber-300', bg: 'bg-amber-950/20', border: 'border-amber-800/40', display: 'Building' },
    offline: { dot: 'bg-rose-400', text: 'text-rose-300', bg: 'bg-rose-950/20', border: 'border-rose-800/40', display: 'Offline' },
    
    // Requests
    submitted: { dot: 'bg-sky-400', text: 'text-sky-300', bg: 'bg-sky-950/20', border: 'border-sky-800/40', display: 'Submitted' },
    in_review: { dot: 'bg-amber-400', text: 'text-amber-300', bg: 'bg-amber-950/20', border: 'border-amber-800/40', display: 'In Review' },
    in_progress: { dot: 'bg-violet-400', text: 'text-violet-300', bg: 'bg-violet-950/20', border: 'border-violet-800/40', display: 'In Progress' },
    waiting_for_client: { dot: 'bg-yellow-400', text: 'text-yellow-300', bg: 'bg-yellow-950/20', border: 'border-yellow-800/40', display: 'Waiting for Client' },
    completed: { dot: 'bg-emerald-400', text: 'text-emerald-300', bg: 'bg-emerald-950/20', border: 'border-emerald-800/40', display: 'Completed' },
    
    // Leads
    new: { dot: 'bg-sky-400', text: 'text-sky-300', bg: 'bg-sky-950/20', border: 'border-sky-800/40', display: 'New' },
    contacted: { dot: 'bg-blue-400', text: 'text-blue-300', bg: 'bg-blue-950/20', border: 'border-blue-800/40', display: 'Contacted' },
    qualified: { dot: 'bg-violet-400', text: 'text-violet-300', bg: 'bg-violet-950/20', border: 'border-violet-800/40', display: 'Qualified' },
    converted: { dot: 'bg-emerald-400', text: 'text-emerald-300', bg: 'bg-emerald-950/20', border: 'border-emerald-800/40', display: 'Converted' },
    lost: { dot: 'bg-zinc-400', text: 'text-zinc-400', bg: 'bg-zinc-900/40', border: 'border-zinc-800', display: 'Lost' },
    
    // Bookings
    confirmed: { dot: 'bg-emerald-400', text: 'text-emerald-300', bg: 'bg-emerald-950/20', border: 'border-emerald-800/40', display: 'Confirmed' },
    pending: { dot: 'bg-amber-400', text: 'text-amber-300', bg: 'bg-amber-950/20', border: 'border-amber-800/40', display: 'Pending' },
    cancelled: { dot: 'bg-rose-400', text: 'text-rose-300', bg: 'bg-rose-950/20', border: 'border-rose-800/40', display: 'Cancelled' },

    // Invoices
    paid: { dot: 'bg-emerald-400', text: 'text-emerald-300', bg: 'bg-emerald-950/20', border: 'border-emerald-800/40', display: 'Paid' },
    open: { dot: 'bg-amber-400', text: 'text-amber-300', bg: 'bg-amber-950/20', border: 'border-amber-800/40', display: 'Open' },
    overdue: { dot: 'bg-rose-400', text: 'text-rose-300', bg: 'bg-rose-950/20', border: 'border-rose-800/40', display: 'Overdue' },

    // Tickets
    resolved: { dot: 'bg-emerald-400', text: 'text-emerald-300', bg: 'bg-emerald-950/20', border: 'border-emerald-800/40', display: 'Resolved' },
  };

  const current = configs[normStatus] || {
    dot: 'bg-zinc-400',
    text: 'text-zinc-300',
    bg: 'bg-zinc-900/30',
    border: 'border-zinc-800',
    display: label || status,
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-mono tracking-tight font-medium rounded border whitespace-nowrap',
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
