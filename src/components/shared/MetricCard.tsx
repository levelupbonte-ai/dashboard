import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  badge?: string;
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subValue,
  change,
  changeType = 'positive',
  icon,
  badge,
  onClick,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-card border border-border rounded-lg p-3.5 sm:p-4.5 transition-all duration-150 shadow-xs',
        onClick && 'cursor-pointer hover:border-border/80 hover:bg-accent/40',
        className
      )}
    >
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-medium">
          {title}
        </span>
        {icon && (
          <div className="p-1 rounded bg-muted border border-border text-foreground">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2.5 sm:mt-3 flex items-baseline justify-between gap-2">
        <div className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-mono tabular-nums">
          {value}
        </div>
        {badge && (
          <span className="px-1.5 py-0.5 text-[10px] font-mono uppercase font-semibold bg-muted text-foreground border border-border rounded">
            {badge}
          </span>
        )}
      </div>

      {(subValue || change) && (
        <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/60">
          {subValue && <span className="truncate pr-2">{subValue}</span>}
          {change && (
            <div
              className={cn(
                'inline-flex items-center gap-0.5 font-mono tabular-nums shrink-0 font-medium',
                changeType === 'positive' && 'text-emerald-500',
                changeType === 'negative' && 'text-destructive',
                changeType === 'neutral' && 'text-muted-foreground'
              )}
            >
              {changeType === 'positive' && <ArrowUpRight className="size-3" />}
              {changeType === 'negative' && <ArrowDownRight className="size-3" />}
              <span>{change}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
