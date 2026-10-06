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
        return <Sparkles className="w-3.5 h-3.5 text-violet-400" />;
      case 'lead':
        return <UserPlus className="w-3.5 h-3.5 text-emerald-400" />;
      case 'billing':
        return <CreditCard className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-sky-400" />;
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
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
        <span className="text-[11px] font-mono text-zinc-400">Workspace event log</span>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllRead}
            icon={<CheckCheck className="w-3 h-3" />}
          >
            Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-zinc-400 text-xs font-mono">
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
                  ? 'bg-[#0b0c10] border-zinc-800 text-zinc-400'
                  : 'bg-[#10121a] border-violet-800/40 text-zinc-200'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded bg-zinc-900 border border-zinc-800 shrink-0">
                  {getIcon(notif.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-semibold text-white truncate">{notif.title}</h4>
                    <span className="text-[10px] text-zinc-400 shrink-0 font-mono">
                      {formatTimeAgo(notif.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{notif.message}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Drawer>
  );
};
