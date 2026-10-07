import React, { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 650,
  prefix = '',
  suffix = '',
  decimals,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const startValueRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Easing function: easeOutExpo (starts crisp, decelerates smoothly)
  const easeOutExpo = (t: number): number => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  };

  useEffect(() => {
    const startVal = startValueRef.current;
    const endVal = value;
    const diff = endVal - startVal;

    if (diff === 0) {
      setDisplayValue(endVal);
      return;
    }

    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);

      const current = startVal + diff * easedProgress;
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endVal);
        startValueRef.current = endVal;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, duration]);

  // Determine decimal places
  const effectiveDecimals =
    decimals !== undefined
      ? decimals
      : Number.isInteger(value)
      ? 0
      : 1;

  const formatted = displayValue.toLocaleString('en-US', {
    minimumFractionDigits: effectiveDecimals,
    maximumFractionDigits: effectiveDecimals,
  });

  return (
    <span className={`tabular-nums font-feature-settings-cv ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};
