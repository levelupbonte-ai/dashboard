import React from 'react';
import { PanelLeft, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Breadcrumbs } from '../shadcn/Breadcrumbs';
import { SearchInput } from '../shadcn/SearchInput';
import { ThemeSelector } from '../shadcn/ThemeSelector';
import { ThemeModeToggle } from '../shadcn/ThemeModeToggle';

interface ShadcnHeaderProps {
  activeTab: string;
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  onNavigateTab: (tabId: string) => void;
}

export const ShadcnHeader: React.FC<ShadcnHeaderProps> = ({
  activeTab,
  onToggleSidebar,
  onOpenSearch,
  onOpenNotifications,
  unreadCount,
  onNavigateTab,
}) => {
  const { role } = useAuth();

  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-30 shrink-0">
      {/* Left: Sidebar trigger + Breadcrumb Trail */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors flex items-center justify-center shrink-0 border border-border/40"
          title="Toggle Sidebar"
          aria-label="Toggle Sidebar"
        >
          <PanelLeft className="size-4" />
        </button>

        <div className="h-4 w-px bg-border/80 hidden sm:block" />

        <Breadcrumbs activeTab={activeTab} />
      </div>

      {/* Right: Search, Role Switcher, Notification, Theme, Mode */}
      <div className="flex items-center gap-2 shrink-0">
        <SearchInput onClick={onOpenSearch} />

        {/* Role Badge (Desktop only) */}
        <div className="hidden lg:flex items-center px-2 py-1 rounded-md bg-muted/60 border border-border/80 text-[10px] font-mono text-muted-foreground">
          <span className="uppercase font-semibold tracking-wider">{role}</span>
        </div>

        <ThemeModeToggle />

        <div className="hidden sm:block">
          <ThemeSelector />
        </div>

        {/* Notifications Button */}
        <button
          onClick={onOpenNotifications}
          className="relative size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors flex items-center justify-center border border-border/40 bg-card"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="size-3.5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary ring-2 ring-background" />
          )}
        </button>
      </div>
    </header>
  );
};
