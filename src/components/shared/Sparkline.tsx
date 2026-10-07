import React, { useId } from 'react';

interface SparklineProps {
  data: number[];
  color?: 'emerald' | 'rose' | 'indigo' | 'amber' | 'blue' | 'slate';
  width?: number;
  height?: number;
  strokeWidth?: number;
  showGradient?: boolean;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color = 'emerald',
  width = 88,
  height = 28,
  strokeWidth = 1.75,
  showGradient = true,
  className = '',
}) => {
  const gradientId = useId();

  if (!data || data.length < 2) {
    return <div style={{ width, height }} className="opacity-0" />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const paddingY = 3;
  const effectiveHeight = height - paddingY * 2;

  // Generate coordinate points
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - paddingY - ((val - min) / range) * effectiveHeight;
    return { x, y };
  });

  // Generate smooth SVG path command (Catmull-Rom or Monotone curve)
  const linePath = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    const prev = arr[i - 1];
    const cpx1 = prev.x + (pt.x - prev.x) / 2;
    const cpy1 = prev.y;
    const cpx2 = prev.x + (pt.x - prev.x) / 2;
    const cpy2 = pt.y;
    return `${acc} C ${cpx1.toFixed(1)},${cpy1.toFixed(1)} ${cpx2.toFixed(1)},${cpy2.toFixed(1)} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
  }, '');

  // Closed area path for gradient
  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

  const colorConfig = {
    emerald: {
      stroke: 'var(--sparkline-emerald, #10b981)',
      stop: '#10b981',
    },
    rose: {
      stroke: 'var(--sparkline-rose, #f43f5e)',
      stop: '#f43f5e',
    },
    indigo: {
      stroke: 'var(--sparkline-indigo, #6366f1)',
      stop: '#6366f1',
    },
    amber: {
      stroke: 'var(--sparkline-amber, #f59e0b)',
      stop: '#f59e0b',
    },
    blue: {
      stroke: 'var(--sparkline-blue, #3b82f6)',
      stop: '#3b82f6',
    },
    slate: {
      stroke: 'var(--sparkline-slate, #94a3b8)',
      stop: '#94a3b8',
    },
  }[color];

  return (
    <div className={`relative shrink-0 overflow-hidden ${className}`} style={{ width, height }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colorConfig.stop} stopOpacity="0.22" />
            <stop offset="100%" stopColor={colorConfig.stop} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {showGradient && (
          <path
            d={areaPath}
            fill={`url(#${gradientId})`}
            className="transition-opacity duration-500"
          />
        )}

        <path
          d={linePath}
          fill="none"
          stroke={colorConfig.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-500 ease-out"
          style={{
            strokeDasharray: 300,
            strokeDashoffset: 0,
            animation: 'sparkline-draw 0.75s ease-out forwards',
          }}
        />

        {/* Small subtle active dot on latest value */}
        {points.length > 0 && (
          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r="2"
            fill={colorConfig.stroke}
            className="animate-in fade-in duration-300"
          />
        )}
      </svg>
    </div>
  );
};
