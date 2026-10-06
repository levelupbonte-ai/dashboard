import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variantStyles = {
    default:
      'border-transparent bg-violet-600 text-white shadow-xs hover:bg-violet-500',
    secondary:
      'border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800',
    destructive:
      'border-transparent bg-rose-950 text-rose-300 hover:bg-rose-900',
    outline:
      'border-zinc-800 text-zinc-300 hover:bg-zinc-800/50',
    success:
      'border-emerald-800/50 bg-emerald-950/40 text-emerald-300',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-[10px] font-mono font-medium transition-colors border',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
