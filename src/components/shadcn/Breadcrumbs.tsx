import React from 'react';
import { useTenant } from '../../context/TenantContext';

interface BreadcrumbsProps {
  activeTab: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ activeTab }) => {
  const { currentTenant } = useTenant();

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'overview':
        return 'Overview';
      case 'websites':
        return 'My Websites';
      case 'performance':
        return 'Performance';
      case 'requests':
        return 'Requests';
      case 'leads':
        return 'Leads';
      case 'bookings':
        return 'Bookings';
      case 'store':
        return 'Store & Orders';
      case 'analytics':
        return 'Analytics';
      case 'traffic':
        return 'Traffic';
      case 'seo':
        return 'Search Visibility';
      case 'billing':
        return 'Billing';
      case 'care':
        return 'Website Care';
      case 'support':
        return 'Support';
      case 'settings':
        return 'Settings';
      case 'admin-overview':
      case 'admin-clients':
      case 'admin-requests':
      case 'admin-audit':
        return 'Agency Admin';
      default:
        return 'Overview';
    }
  };

  return (
    <nav className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0" aria-label="Breadcrumb">
      <span className="hidden md:inline font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
        Dashboard
      </span>
      <span className="hidden md:inline text-muted-foreground/60">/</span>
      <span className="truncate max-w-[120px] sm:max-w-[160px] font-medium text-muted-foreground">
        {currentTenant.name}
      </span>
      <span className="text-muted-foreground/60">/</span>
      <span className="font-semibold text-foreground tracking-tight truncate">
        {getTabTitle(activeTab)}
      </span>
    </nav>
  );
};
