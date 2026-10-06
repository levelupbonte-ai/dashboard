import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-xs font-medium text-zinc-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full bg-[#101117] border border-zinc-800 rounded-md px-3 py-2 text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-600 transition-colors min-h-[38px]',
            error && 'border-rose-500/80 focus:border-rose-500',
            className
          )}
          {...props}
        />
        {helperText && !error && (
          <p className="text-[11px] text-zinc-400 font-mono">{helperText}</p>
        )}
        {error && <p className="text-[11px] text-rose-400 font-medium font-mono">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, rows = 3, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-xs font-medium text-zinc-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            'w-full bg-[#101117] border border-zinc-800 rounded-md px-3 py-2 text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-600 transition-colors resize-y',
            error && 'border-rose-500/80 focus:border-rose-500',
            className
          )}
          {...props}
        />
        {helperText && !error && (
          <p className="text-[11px] text-zinc-400 font-mono">{helperText}</p>
        )}
        {error && <p className="text-[11px] text-rose-400 font-medium font-mono">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
