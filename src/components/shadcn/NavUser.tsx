import React, { useState } from 'react';
import {
  ChevronsUpDown,
  Sparkles,
  CreditCard,
  Bell,
  LogOut,
  User,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { cn } from '../../lib/utils';

interface NavUserProps {
  isCollapsed?: boolean;
  onNavigateTab?: (tabId: string) => void;
  onOpenNotifications?: () => void;
}

export const NavUser: React.FC<NavUserProps> = ({
  isCollapsed = false,
  onNavigateTab,
  onOpenNotifications,
}) => {
  const { user, role, setRole, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center gap-2.5 p-2 rounded-lg text-left transition-colors hover:bg-accent/60 group border border-transparent hover:border-border',
          isCollapsed && 'justify-center p-1.5'
        )}
        title={user.full_name}
        aria-label="User account menu"
      >
        <div className="size-8 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center font-mono font-semibold text-xs shrink-0 border border-border">
          {getInitials(user.full_name)}
        </div>

        {!isCollapsed && (
          <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
            <span className="truncate font-semibold text-foreground text-xs">
              {user.full_name}
            </span>
            <span className="truncate text-[10px] text-muted-foreground font-mono">
              {user.email}
            </span>
          </div>
        )}

        {!isCollapsed && (
          <ChevronsUpDown className="size-4 text-muted-foreground ml-auto shrink-0 transition-transform duration-200 group-data-state-open:rotate-180" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-50" onClick={() => setIsOpen(false)} />
          <div
            className={cn(
              'absolute bottom-full mb-1.5 w-60 rounded-lg bg-card border border-border shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100',
              isCollapsed ? 'left-full ml-2 bottom-0 mb-0' : 'left-0'
            )}
          >
            {/* User Identity Header */}
            <div className="px-2 py-2 border-b border-border/80 mb-1">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center font-mono font-semibold text-xs shrink-0 border border-border">
                  {getInitials(user.full_name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-foreground truncate">
                    {user.full_name}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono truncate">
                    {user.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Role Switcher Section */}
            <div className="px-2 py-1.5 text-[10px] font-mono uppercase text-muted-foreground">
              Simulate View Role
            </div>
            <div className="space-y-0.5 mb-1 border-b border-border/80 pb-1.5">
              {(['client', 'admin', 'super_admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRole(r);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-2 py-1 rounded text-xs transition-colors text-left',
                    role === r
                      ? 'bg-accent text-accent-foreground font-semibold'
                      : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground'
                  )}
                >
                  <span className="capitalize">{r.replace('_', ' ')}</span>
                  {role === r && <Check className="size-3 text-foreground" />}
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="space-y-0.5">
              <button
                onClick={() => {
                  onNavigateTab?.('care');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-foreground hover:bg-accent/60 transition-colors"
              >
                <Sparkles className="size-3.5 text-foreground" />
                <span>Care Plan Options</span>
              </button>

              <button
                onClick={() => {
                  onNavigateTab?.('settings');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-foreground hover:bg-accent/60 transition-colors"
              >
                <User className="size-3.5 text-muted-foreground" />
                <span>Account Profile</span>
              </button>

              <button
                onClick={() => {
                  onNavigateTab?.('billing');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-foreground hover:bg-accent/60 transition-colors"
              >
                <CreditCard className="size-3.5 text-muted-foreground" />
                <span>Billing Ledger</span>
              </button>

              <button
                onClick={() => {
                  onOpenNotifications?.();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-foreground hover:bg-accent/60 transition-colors"
              >
                <Bell className="size-3.5 text-muted-foreground" />
                <span>Notification Center</span>
              </button>
            </div>

            <div className="pt-1 mt-1 border-t border-border/80">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-destructive hover:bg-destructive/10 transition-colors text-left"
              >
                <LogOut className="size-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
