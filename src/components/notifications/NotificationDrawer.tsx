import React from 'react';
import { Drawer } from '../ui/Drawer';
import { AppNotification } from '../../types';
import { formatTimeAgo } from '../../lib/utils';
import { Button } from '../ui/Button';
import { CheckCheck, Sparkles, UserPlus, CreditCard, Bell } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onNavigateTab,
}) => {
  const getIcon = (category: AppNotification['category']) => {
    switch (category) {
      case 'update':
        return <Sparkles className="size-3.5 text-foreground" />;
      case 'lead':
        return <UserPlus className="size-3.5 text-emerald-500" />;
      case 'billing':
        return <CreditCard className="size-3.5 text-amber-500" />;
      default:
        return <Bell className="size-3.5 text-foreground" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Activity & Event Stream"
      subtitle={`${unreadCount} unread`}
      width="md"
    >
      <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
        <span className="text-[11px] font-mono text-muted-foreground">Workspace event log</span>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllRead}
            icon={<CheckCheck className="size-3" />}
          >
            Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-xs font-mono">
            No active notifications.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                onMarkRead(notif.id);
                if (notif.link_tab) {
                  onNavigateTab(notif.link_tab);
                  onClose();
                }
              }}
              className={`p-3 rounded-md border transition-colors cursor-pointer ${
                notif.is_read
                  ? 'bg-card border-border text-muted-foreground'
                  : 'bg-accent/40 border-border text-foreground font-medium'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded bg-muted border border-border shrink-0">
                  {getIcon(notif.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-semibold text-foreground truncate">{notif.title}</h4>
                    <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                      {formatTimeAgo(notif.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{notif.message}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Drawer>
  );
};
