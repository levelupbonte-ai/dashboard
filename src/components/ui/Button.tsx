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
    'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-40 disabled:pointer-events-none cursor-pointer select-none whitespace-nowrap shrink-0 rounded-md';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 min-h-[32px] sm:min-h-[30px]',
    md: 'text-xs px-3.5 py-2 min-h-[38px] sm:min-h-[36px]',
    lg: 'text-sm px-4 py-2.5 min-h-[44px] sm:min-h-[40px]',
  };

  const variantStyles = {
    primary:
      'bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-xs border border-transparent active:translate-y-px',
    violet:
      'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border active:translate-y-px',
    secondary:
      'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border active:translate-y-px',
    outline:
      'border border-border bg-card hover:bg-accent hover:text-accent-foreground text-foreground',
    ghost:
      'text-muted-foreground hover:text-foreground hover:bg-accent',
    danger:
      'bg-destructive text-destructive-foreground hover:bg-destructive/90',
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
