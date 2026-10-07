import React from 'react';
import { cn } from '../../lib/utils';
import { AnimatedNumber } from './AnimatedNumber';
import { Sparkline } from './Sparkline';

interface MetricCardProps {
  title: string;
  value: string | number;
  numericValue?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  subValue?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  comparisonPeriod?: string;
  icon?: React.ReactNode;
  badge?: string;
  sparklineData?: number[];
  sparklineColor?: 'emerald' | 'rose' | 'indigo' | 'amber' | 'blue' | 'slate';
  emptyMessage?: string;
  staggerDelay?: number;
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  numericValue,
  prefix = '',
  suffix = '',
  decimals,
  subValue,
  change,
  changeType = 'positive',
  comparisonPeriod,
  icon,
  badge,
  sparklineData,
  sparklineColor,
  emptyMessage,
  staggerDelay = 0,
  onClick,
  className,
}) => {
  // Parse numeric representation if value is numeric or formatted string
  let parsedNumber: number | null = numericValue !== undefined ? numericValue : null;
  let effectivePrefix = prefix;
  let effectiveSuffix = suffix;

  if (parsedNumber === null) {
    if (typeof value === 'number') {
      parsedNumber = value;
    } else if (typeof value === 'string') {
      const trimmed = value.trim();
      const match = trimmed.match(/^([$€£¥]?)\s*([\d,]+(?:\.\d+)?)\s*(%|[a-zA-Z]+)?$/);
      if (match) {
        if (match[1]) effectivePrefix = match[1];
        parsedNumber = parseFloat(match[2].replace(/,/g, ''));
        if (match[3]) effectiveSuffix = match[3];
      }
    }
  }

  // Derive sparkline color from changeType if not specified
  const effectiveSparkColor =
    sparklineColor ||
    (changeType === 'positive'
      ? 'emerald'
      : changeType === 'negative'
      ? 'rose'
      : 'indigo');

  const isEmpty = parsedNumber === 0 && Boolean(emptyMessage);

  return (
    <div
      onClick={onClick}
      style={{
        animationDelay: `${staggerDelay}ms`,
      }}
      className={cn(
        'group relative bg-card border border-border/70 rounded-xl p-4 sm:p-5 transition-all duration-200 shadow-2xs hover:shadow-xs hover:border-border animate-fade-up',
        onClick && 'cursor-pointer hover:bg-accent/25',
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 text-muted-foreground">
        <span className="text-xs font-medium text-muted-foreground truncate">
          {title}
        </span>
        {icon && (
          <div className="text-muted-foreground/80 group-hover:text-foreground transition-colors shrink-0">
            {icon}
          </div>
        )}
      </div>

      {/* Main Metric Row with Sparkline */}
      <div className="mt-2.5 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground tabular-nums">
            {parsedNumber !== null ? (
              <AnimatedNumber
                value={parsedNumber}
                prefix={effectivePrefix}
                suffix={effectiveSuffix}
                decimals={decimals}
              />
            ) : (
              <span>{value}</span>
            )}
          </div>

          {badge && (
            <span className="mt-1 inline-block px-1.5 py-0.5 text-[10px] font-medium bg-muted text-foreground border border-border rounded">
              {badge}
            </span>
          )}
        </div>

        {/* Mini Sparkline Visualization */}
        {sparklineData && sparklineData.length >= 2 && !isEmpty && (
          <Sparkline
            data={sparklineData}
            color={effectiveSparkColor}
            width={80}
            height={28}
          />
        )}
      </div>

      {/* Comparison & Subvalue Footer */}
      <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground gap-2">
        <div className="flex items-center gap-1.5 truncate">
          {change && (
            <span
              className={cn(
                'font-medium tabular-nums inline-flex items-center gap-0.5',
                changeType === 'positive' && 'text-emerald-500 dark:text-emerald-400',
                changeType === 'negative' && 'text-rose-500 dark:text-rose-400',
                changeType === 'neutral' && 'text-muted-foreground'
              )}
            >
              {change}
            </span>
          )}
          {comparisonPeriod && (
            <span className="text-muted-foreground/70 truncate text-[11px]">
              {comparisonPeriod}
            </span>
          )}
          {!change && subValue && (
            <span className="text-muted-foreground/80 truncate text-[11px]">{subValue}</span>
          )}
        </div>

        {change && subValue && (
          <span className="text-[11px] text-muted-foreground/70 truncate hidden sm:inline">
            {subValue}
          </span>
        )}
      </div>

      {isEmpty && emptyMessage && (
        <div className="mt-1 text-[11px] text-muted-foreground/70 italic">
          {emptyMessage}
        </div>
      )}
    </div>
  );
};

