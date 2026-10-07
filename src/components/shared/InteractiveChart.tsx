import React, { useState, useId, useMemo } from 'react';

interface DataPoint {
  date: string;
  value: number;
  secondaryValue?: number;
}

interface InteractiveChartProps {
  data: DataPoint[];
  color?: 'emerald' | 'indigo' | 'blue' | 'amber' | 'slate';
  unit?: string;
  prefix?: string;
  suffix?: string;
  height?: number;
  showArea?: boolean;
  className?: string;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  data,
  color = 'emerald',
  unit = '',
  prefix = '',
  suffix = '',
  height = 200,
  showArea = true,
  className = '',
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const gradientId = useId();

  const width = 600;
  const paddingX = 18;
  const paddingTop = 22;
  const paddingBottom = 26;

  const effectiveWidth = width - paddingX * 2;
  const effectiveHeight = height - paddingTop - paddingBottom;

  const { minVal, maxVal, avgVal, points, pathString, areaString } = useMemo(() => {
    if (!data || data.length === 0) {
      return { minVal: 0, maxVal: 0, avgVal: 0, points: [], pathString: '', areaString: '' };
    }

    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

    const pts = data.map((d, idx) => {
      const x = paddingX + (idx / Math.max(data.length - 1, 1)) * effectiveWidth;
      const y = paddingTop + effectiveHeight - ((d.value - min) / range) * effectiveHeight;
      return { x, y, ...d };
    });

    // Smooth cubic Bezier spline
    const path = pts.reduce((acc, pt, i, arr) => {
      if (i === 0) return `M ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
      const prev = arr[i - 1];
      const cp1x = prev.x + (pt.x - prev.x) / 2;
      const cp1y = prev.y;
      const cp2x = prev.x + (pt.x - prev.x) / 2;
      const cp2y = pt.y;
      return `${acc} C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    }, '');

    const area = `${path} L ${pts[pts.length - 1].x.toFixed(1)},${(paddingTop + effectiveHeight).toFixed(1)} L ${pts[0].x.toFixed(1)},${(paddingTop + effectiveHeight).toFixed(1)} Z`;

    return {
      minVal: min,
      maxVal: max,
      avgVal: avg,
      points: pts,
      pathString: path,
      areaString: area,
    };
  }, [data, effectiveWidth, effectiveHeight, paddingX, paddingTop]);

  const colorConfig = {
    emerald: {
      stroke: '#10b981',
      fillStart: '#10b981',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    indigo: {
      stroke: '#6366f1',
      fillStart: '#6366f1',
      badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    },
    blue: {
      stroke: '#3b82f6',
      fillStart: '#3b82f6',
      badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
    amber: {
      stroke: '#f59e0b',
      fillStart: '#f59e0b',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    slate: {
      stroke: '#94a3b8',
      fillStart: '#94a3b8',
      badgeBg: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    },
  }[color];

  const activePoint = hoverIndex !== null ? points[hoverIndex] : null;

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const svgX = (relativeX / rect.width) * width;

    // Find nearest point
    let nearestIdx = 0;
    let minDistance = Infinity;

    points.forEach((pt, idx) => {
      const dist = Math.abs(pt.x - svgX);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIdx = idx;
      }
    });

    setHoverIndex(nearestIdx);
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Top summary info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 px-1">
        <div className="flex items-center gap-3">
          <span>
            Avg: <strong className="text-foreground tabular-nums">{prefix}{avgVal.toLocaleString()}{suffix}</strong> {unit}
          </span>
          <span>
            Peak: <strong className="text-foreground tabular-nums">{prefix}{maxVal.toLocaleString()}{suffix}</strong>
          </span>
        </div>

        {activePoint ? (
          <div className="flex items-center gap-2 animate-in fade-in duration-150">
            <span className="text-muted-foreground font-medium">{activePoint.date}:</span>
            <span className="font-semibold text-foreground tabular-nums">
              {prefix}{activePoint.value.toLocaleString()}{suffix} {unit}
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-muted-foreground">Hover points to inspect</span>
        )}
      </div>

      {/* SVG Container */}
      <div className="relative w-full overflow-hidden select-none" style={{ height }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full cursor-crosshair overflow-visible touch-none"
          preserveAspectRatio="none"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colorConfig.fillStart} stopOpacity="0.22" />
              <stop offset="60%" stopColor={colorConfig.fillStart} stopOpacity="0.04" />
              <stop offset="100%" stopColor={colorConfig.fillStart} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal grid guide lines */}
          <line
            x1={paddingX}
            y1={paddingTop}
            x2={width - paddingX}
            y2={paddingTop}
            stroke="currentColor"
            className="text-border/40"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingX}
            y1={paddingTop + effectiveHeight / 2}
            x2={width - paddingX}
            y2={paddingTop + effectiveHeight / 2}
            stroke="currentColor"
            className="text-border/40"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingX}
            y1={paddingTop + effectiveHeight}
            x2={width - paddingX}
            y2={paddingTop + effectiveHeight}
            stroke="currentColor"
            className="text-border/60"
          />

          {/* Area fill */}
          {showArea && (
            <path
              d={areaString}
              fill={`url(#${gradientId})`}
              className="transition-opacity duration-300"
            />
          )}

          {/* Stroke path */}
          <path
            d={pathString}
            fill="none"
            stroke={colorConfig.stroke}
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
            style={{
              strokeDasharray: 2000,
              strokeDashoffset: 0,
              animation: 'sparkline-draw 0.8s ease-out forwards',
            }}
          />

          {/* Hover crosshair & point indicator */}
          {activePoint && (
            <g className="transition-all duration-150">
              <line
                x1={activePoint.x}
                y1={paddingTop}
                x2={activePoint.x}
                y2={paddingTop + effectiveHeight}
                stroke={colorConfig.stroke}
                strokeWidth="1.25"
                strokeDasharray="2 2"
                opacity="0.8"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="4.5"
                fill={colorConfig.stroke}
                stroke="var(--background, #09090b)"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Data Points (subtle resting dots) */}
          {!activePoint &&
            points.map((pt, idx) => (
              <circle
                key={idx}
                cx={pt.x}
                cy={pt.y}
                r="2.5"
                fill={colorConfig.stroke}
                opacity="0.85"
                className="transition-opacity"
              />
            ))}
        </svg>

        {/* Date labels under the chart */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-3 text-[11px] text-muted-foreground/80 pointer-events-none">
          {data.map((d, idx) => (
            <span key={idx} className="truncate">
              {d.date}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
