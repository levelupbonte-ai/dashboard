import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'violet';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  icon,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-400 disabled:opacity-40 disabled:pointer-events-none cursor-pointer select-none whitespace-nowrap shrink-0 rounded-md';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 min-h-[32px] sm:min-h-[30px]',
    md: 'text-xs px-3.5 py-2 min-h-[40px] sm:min-h-[36px]',
    lg: 'text-sm px-4 py-2.5 min-h-[44px] sm:min-h-[40px]',
  };

  const variantStyles = {
    primary:
      'bg-violet-600 hover:bg-violet-500 text-white font-medium shadow-xs shadow-violet-950/50 border border-violet-500/80 active:translate-y-px',
    violet:
      'bg-violet-600/10 hover:bg-violet-600/20 text-violet-300 border border-violet-500/30 active:translate-y-px',
    secondary:
      'bg-[#121318] hover:bg-[#1a1b22] text-zinc-200 border border-zinc-800 hover:border-zinc-700 active:translate-y-px',
    outline:
      'border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-900/60',
    ghost:
      'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60',
    danger:
      'bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 border border-rose-800/50',
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
