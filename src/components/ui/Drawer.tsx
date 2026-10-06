import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: 'md' | 'lg' | 'xl' | '2xl';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = 'xl',
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

  const widthStyles = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-100"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
        <div
          className={cn(
            'w-screen bg-[#0b0c10] border-l border-zinc-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200',
            widthStyles[width]
          )}
        >
          {/* Mobile Drag Handle affordance */}
          <div className="sm:hidden w-8 h-1 bg-zinc-800 rounded-full mx-auto my-2" />

          {/* Header */}
          <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-b border-zinc-800 flex items-center justify-between gap-3">
            <div className="pr-2 min-w-0">
              <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight truncate">{title}</h2>
              {subtitle && <p className="text-[11px] text-zinc-400 mt-0.5 truncate font-mono">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center shrink-0"
              aria-label="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};
