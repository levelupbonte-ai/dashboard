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
        'bg-[#0b0c10] border border-zinc-800/80 rounded-lg p-3.5 sm:p-4.5 transition-all duration-150',
        onClick && 'cursor-pointer hover:border-zinc-700 hover:bg-[#101117]',
        className
      )}
    >
      <div className="flex items-center justify-between text-zinc-400">
        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-medium">
          {title}
        </span>
        {icon && (
          <div className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2.5 sm:mt-3 flex items-baseline justify-between gap-2">
        <div className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
          {value}
        </div>
        {badge && (
          <span className="px-1.5 py-0.5 text-[10px] font-mono uppercase font-semibold bg-violet-950/40 text-violet-300 border border-violet-800/40 rounded">
            {badge}
          </span>
        )}
      </div>

      {(subValue || change) && (
        <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/50">
          {subValue && <span className="truncate pr-2">{subValue}</span>}
          {change && (
            <div
              className={cn(
                'inline-flex items-center gap-0.5 font-mono tabular-nums shrink-0 font-medium',
                changeType === 'positive' && 'text-emerald-400',
                changeType === 'negative' && 'text-rose-400',
                changeType === 'neutral' && 'text-zinc-400'
              )}
            >
              {changeType === 'positive' && <ArrowUpRight className="w-3 h-3" />}
              {changeType === 'negative' && <ArrowDownRight className="w-3 h-3" />}
              <span>{change}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
