import React from 'react';
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
        'bg-card border border-border/60 rounded-xl p-5 transition-all duration-150 shadow-2xs',
        onClick && 'cursor-pointer hover:border-border hover:bg-accent/30',
        className
      )}
    >
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs font-medium text-muted-foreground">
          {title}
        </span>
        {icon && (
          <div className="text-muted-foreground">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline justify-between gap-2">
        <div className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
          {value}
        </div>
        {badge && (
          <span className="px-2 py-0.5 text-[11px] font-medium bg-muted text-foreground border border-border/60 rounded">
            {badge}
          </span>
        )}
      </div>

      {(subValue || change) && (
        <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
          {subValue && <div>{subValue}</div>}
          {change && (
            <div
              className={cn(
                'font-medium tabular-nums',
                changeType === 'positive' && 'text-emerald-500',
                changeType === 'negative' && 'text-destructive',
                changeType === 'neutral' && 'text-muted-foreground'
              )}
            >
              {change}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
