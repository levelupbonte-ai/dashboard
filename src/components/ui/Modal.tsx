import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-100"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog (Vercel clean dialog) */}
      <div
        className={cn(
          'relative w-full bg-card border border-border rounded-lg shadow-2xl p-4 sm:p-5 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto',
          maxWidthStyles[maxWidth]
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-border">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">{title}</h3>
            {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent/60 size-8 flex items-center justify-center"
            aria-label="Close dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-3.5">{children}</div>
      </div>
    </div>
  );
};
