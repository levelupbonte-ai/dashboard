import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Globe,
  FileText,
  Users,
  Calendar,
  CreditCard,
  LifeBuoy,
  Settings,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { dataService } from '../../services/dataService';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tabId: string) => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const { currentTenant, hasBookings, hasEcommerce, hasSeo } = useTenant();

  const websites = useMemo(() => dataService.getWebsites(currentTenant.id), [currentTenant.id]);
  const requests = useMemo(() => dataService.getRequests(currentTenant.id), [currentTenant.id]);
  const leads = useMemo(() => dataService.getLeads(currentTenant.id), [currentTenant.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  const staticNavigation = useMemo(() => {
    const nav = [
      { id: 'overview', title: 'Overview', icon: <TrendingUp className="size-3.5" /> },
      { id: 'websites', title: 'My Websites', icon: <Globe className="size-3.5" /> },
      { id: 'requests', title: 'Website Requests (Request a Change)', icon: <FileText className="size-3.5" /> },
      { id: 'leads', title: 'Leads & Inbound Pipeline', icon: <Users className="size-3.5" /> },
    ];
    if (hasBookings) {
      nav.push({ id: 'bookings', title: 'Bookings & Appointments', icon: <Calendar className="size-3.5" /> });
    }
    if (hasEcommerce) {
      nav.push({ id: 'store', title: 'Store & Orders', icon: <CreditCard className="size-3.5" /> });
    }
    if (hasSeo) {
      nav.push({ id: 'seo', title: 'Search Visibility (SEO)', icon: <Globe className="size-3.5" /> });
    }
    nav.push(
      { id: 'analytics', title: 'Analytics & Telemetry', icon: <TrendingUp className="size-3.5" /> },
      { id: 'billing', title: 'Billing & Plans', icon: <CreditCard className="size-3.5" /> },
      { id: 'care', title: 'Website Care Plans', icon: <FileText className="size-3.5" /> },
      { id: 'support', title: 'Support Desk', icon: <LifeBuoy className="size-3.5" /> },
      { id: 'settings', title: 'Account Settings', icon: <Settings className="size-3.5" /> }
    );
    return nav;
  }, [hasBookings, hasEcommerce, hasSeo]);

  const q = query.toLowerCase().trim();

  const filteredNavigation = useMemo(() => {
    if (!q) return staticNavigation;
    return staticNavigation.filter((item) => item.title.toLowerCase().includes(q));
  }, [staticNavigation, q]);

  const filteredWebsites = useMemo(() => {
    if (!q) return [];
    return websites
      .filter((s) => s.domain.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
      .map((s) => ({
        id: 'websites',
        title: `${s.name} (${s.domain})`,
        icon: <Globe className="size-3.5" />,
      }));
  }, [websites, q]);

  const filteredRequests = useMemo(() => {
    if (!q) return [];
    return requests
      .filter((r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q))
      .slice(0, 4)
      .map((r) => ({
        id: 'requests',
        title: `Request: ${r.title}`,
        icon: <FileText className="size-3.5" />,
      }));
  }, [requests, q]);

  const filteredLeads = useMemo(() => {
    if (!q) return [];
    return leads
      .filter((l) => l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q))
      .slice(0, 4)
      .map((l) => ({
        id: 'leads',
        title: `Lead: ${l.name} (${l.email})`,
        icon: <Users className="size-3.5" />,
      }));
  }, [leads, q]);

  if (!isOpen) return null;

  const handleSelect = (tabId: string) => {
    onNavigate(tabId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-3 sm:p-4">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-100"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-xl bg-card border border-border rounded-lg shadow-2xl overflow-hidden z-10 flex flex-col max-h-[75vh] animate-in fade-in zoom-in-95 duration-100">
        {/* Search Input Bar */}
        <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-border bg-muted/40">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search workspace..."
            className="w-full bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground bg-muted border border-border rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="overflow-y-auto p-1.5 divide-y divide-border/40 scrollbar-none">
          {filteredWebsites.length > 0 && (
            <div className="py-1">
              <div className="px-2 py-1 text-[10px] font-mono font-medium text-muted-foreground uppercase">
                Websites
              </div>
              {filteredWebsites.map((item, idx) => (
                <button
                  key={`site-${idx}`}
                  onClick={() => handleSelect(item.id)}
                  className="w-full flex items-center justify-between px-2.5 py-2 text-xs text-foreground hover:bg-accent/60 rounded-md transition-colors text-left min-h-[36px]"
                >
                  <div className="flex items-center gap-2 truncate">
                    {item.icon}
                    <span className="truncate">{item.title}</span>
                  </div>
                  <ArrowRight className="size-3 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          )}

          {filteredRequests.length > 0 && (
            <div className="py-1">
              <div className="px-2 py-1 text-[10px] font-mono font-medium text-muted-foreground uppercase">
                Requests
              </div>
              {filteredRequests.map((item, idx) => (
                <button
                  key={`req-${idx}`}
                  onClick={() => handleSelect(item.id)}
                  className="w-full flex items-center justify-between px-2.5 py-2 text-xs text-foreground hover:bg-accent/60 rounded-md transition-colors text-left min-h-[36px]"
                >
                  <div className="flex items-center gap-2 truncate">
                    {item.icon}
                    <span className="truncate">{item.title}</span>
                  </div>
                  <ArrowRight className="size-3 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          )}

          {filteredLeads.length > 0 && (
            <div className="py-1">
              <div className="px-2 py-1 text-[10px] font-mono font-medium text-muted-foreground uppercase">
                Leads
              </div>
              {filteredLeads.map((item, idx) => (
                <button
                  key={`lead-${idx}`}
                  onClick={() => handleSelect(item.id)}
                  className="w-full flex items-center justify-between px-2.5 py-2 text-xs text-foreground hover:bg-accent/60 rounded-md transition-colors text-left min-h-[36px]"
                >
                  <div className="flex items-center gap-2 truncate">
                    {item.icon}
                    <span className="truncate">{item.title}</span>
                  </div>
                  <ArrowRight className="size-3 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="py-1">
            <div className="px-2 py-1 text-[10px] font-mono font-medium text-muted-foreground uppercase">
              Navigation
            </div>
            {filteredNavigation.map((item) => (
              <button
                key={`nav-${item.id}`}
                onClick={() => handleSelect(item.id)}
                className="w-full flex items-center justify-between px-2.5 py-2 text-xs text-foreground hover:bg-accent/60 rounded-md transition-colors text-left min-h-[36px]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{item.icon}</span>
                  <span>{item.title}</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">Go</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 py-1.5 border-t border-border bg-muted/20 text-[10px] text-muted-foreground flex items-center justify-between font-mono">
          <span>{currentTenant.name}</span>
          <span>esc to close</span>
        </div>
      </div>
    </div>
  );
};
