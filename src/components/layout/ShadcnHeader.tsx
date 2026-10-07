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
}) => {
  const { orgRole } = useAuth();

  return (
    <header className="h-14 border-b border-border/50 bg-background/85 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-30 shrink-0">
      {/* Left: Sidebar trigger (Desktop/Tablet) + Breadcrumb Trail */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="hidden md:flex size-8 rounded-md text-muted-foreground hover:text-foreground transition-colors items-center justify-center shrink-0"
          title="Toggle Sidebar"
          aria-label="Toggle Sidebar"
        >
          <PanelLeft className="size-4" />
        </button>

        <div className="h-4 w-px bg-border/50 hidden md:block" />

        <Breadcrumbs activeTab={activeTab} />
      </div>

      {/* Right: Search, Role, Theme, Mode, Notifications */}
      <div className="flex items-center gap-2 shrink-0">
        <SearchInput onClick={onOpenSearch} />

        {/* Organization Role (Desktop only) */}
        <div className="hidden lg:flex items-center px-2 py-1 text-xs text-muted-foreground">
          <span className="uppercase font-medium tracking-wider text-foreground">{orgRole}</span>
        </div>

        <ThemeModeToggle />

        <div className="hidden sm:block">
          <ThemeSelector />
        </div>

        {/* Notifications Button (clean icon, no bubble) */}
        <button
          onClick={onOpenNotifications}
          className="size-8 rounded-md text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="size-4" />
        </button>
      </div>
    </header>
  );
};
