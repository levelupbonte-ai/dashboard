import React, { useState } from 'react';
import { ChevronsUpDown, Check, Plus } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { LevelUpLogo } from './LevelUpLogo';
import { cn } from '../../lib/utils';

interface OrgSwitcherProps {
  isCollapsed?: boolean;
}

export const OrgSwitcher: React.FC<OrgSwitcherProps> = ({ isCollapsed = false }) => {
  const { currentTenant, tenants, switchTenant } = useTenant();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center gap-2.5 p-2 rounded-lg text-left transition-colors hover:bg-accent/60 group',
          isCollapsed ? 'justify-center p-1.5' : 'justify-between'
        )}
        title={currentTenant.name}
        aria-label="Switch organization"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <LevelUpLogo className="size-7 shrink-0" />
          {!isCollapsed && (
            <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
              <span className="truncate font-semibold text-foreground tracking-tight text-xs">
                {currentTenant.name}
              </span>
              <span className="text-muted-foreground truncate text-[11px] capitalize">
                {currentTenant.care_plan} plan
              </span>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <ChevronsUpDown className="size-4 text-muted-foreground ml-auto shrink-0 transition-transform duration-200 group-data-state-open:rotate-180" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-50" onClick={() => setIsOpen(false)} />
          <div
            className={cn(
              'absolute top-full mt-1.5 w-60 rounded-lg bg-card border border-border shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100',
              isCollapsed ? 'left-full ml-2 top-0 mt-0' : 'left-0'
            )}
          >
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground border-b border-border/80 mb-1">
              <span>Organizations</span>
            </div>

            <div className="space-y-0.5 max-h-56 overflow-y-auto">
              {tenants.map((tenant) => {
                const isActive = tenant.id === currentTenant.id;
                return (
                  <button
                    key={tenant.id}
                    onClick={() => {
                      switchTenant(tenant.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between gap-2 p-2 rounded-md text-xs transition-colors text-left',
                      isActive
                        ? 'bg-accent text-accent-foreground font-semibold'
                        : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground'
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <LevelUpLogo className="size-5 shrink-0" />
                      <span className="truncate">{tenant.name}</span>
                    </div>

                    {isActive && <Check className="size-3.5 text-foreground shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-1 mt-1 border-t border-border/80">
              <button
                onClick={() => {
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 p-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors"
              >
                <Plus className="size-4 text-muted-foreground shrink-0" />
                <span className="font-medium text-xs">Add organization</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
