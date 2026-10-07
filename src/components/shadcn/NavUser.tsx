import React, { useState } from 'react';
import {
  ChevronsUpDown,
  Sparkles,
  CreditCard,
  Bell,
  LogOut,
  User,
  Users2,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { OrganizationRole } from '../../types';
import { ROLE_LABELS } from '../../lib/permissions';
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
  const { user, orgRole, setOrgRole, can } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const canViewBilling = can('billing.view');

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center gap-2.5 p-2 rounded-lg text-left transition-colors hover:bg-accent/60 group border border-transparent hover:border-border',
          isCollapsed && 'justify-center p-1.5'
        )}
        title={`${user.full_name} (${ROLE_LABELS[orgRole]})`}
        aria-label="User account menu"
      >
        <User className="size-4 text-muted-foreground shrink-0" />

        {!isCollapsed && (
          <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
            <span className="truncate font-semibold text-foreground text-xs">
              {user.full_name}
            </span>
            <span className="truncate text-[11px] text-muted-foreground">
              {ROLE_LABELS[orgRole]}
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
              'absolute bottom-full mb-1.5 w-64 rounded-lg bg-card border border-border shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100',
              isCollapsed ? 'left-full ml-2 bottom-0 mb-0' : 'left-0'
            )}
          >
            {/* User Identity Header */}
            <div className="px-2 py-2 border-b border-border/80 mb-1">
              <div className="flex items-center gap-2">
                <User className="size-4 text-muted-foreground shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-foreground truncate">
                    {user.full_name}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {user.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Organization Role Switcher (To test OWNER / ADMIN / MEMBER / VIEWER permissions) */}
            <div className="px-2 py-1 text-[10px] font-mono uppercase text-muted-foreground">
              Organization Role
            </div>
            <div className="space-y-0.5 mb-1 border-b border-border/80 pb-1.5">
              {(['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'] as OrganizationRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setOrgRole(r);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors text-left',
                    orgRole === r
                      ? 'bg-accent text-accent-foreground font-semibold'
                      : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground'
                  )}
                >
                  <span>{ROLE_LABELS[r]}</span>
                  {orgRole === r && <Check className="size-3 text-foreground" />}
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="space-y-0.5">
              <button
                onClick={() => {
                  onNavigateTab?.('team');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-foreground hover:bg-accent/60 transition-colors"
              >
                <Users2 className="size-3.5 text-muted-foreground" />
                <span>Organization Team</span>
              </button>

              <button
                onClick={() => {
                  onNavigateTab?.('settings');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-foreground hover:bg-accent/60 transition-colors"
              >
                <User className="size-3.5 text-muted-foreground" />
                <span>Account & Organization</span>
              </button>

              {canViewBilling && (
                <>
                  <button
                    onClick={() => {
                      onNavigateTab?.('billing');
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-foreground hover:bg-accent/60 transition-colors"
                  >
                    <CreditCard className="size-3.5 text-muted-foreground" />
                    <span>Billing & Invoices</span>
                  </button>

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
                </>
              )}

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
