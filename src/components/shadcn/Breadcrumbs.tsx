import React from 'react';
import { useTenant } from '../../context/TenantContext';

interface BreadcrumbsProps {
  activeTab: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ activeTab }) => {
  const { currentTenant } = useTenant();

  const isMedical = currentTenant.slug === 'lumina-health';
  const isHospitality = currentTenant.slug === 'velvet-vine';

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'overview':
        return 'Overview';
      case 'websites':
      case 'website-control':
        return 'Website Control';
      case 'website-content':
        return 'Homepage & Pages';
      case 'website-media':
        return 'Media Library';
      case 'website-menu':
        return 'Food & Wine Menu';
      case 'website-services':
        return 'Services';
      case 'website-products':
        return 'Products & Store';
      case 'website-team':
        return 'Team & Staff';
      case 'website-gallery':
        return 'Photo Gallery';
      case 'website-announcements':
        return 'Announcements';
      case 'website-blog':
        return 'Articles & Journal';
      case 'inventory':
        return 'Inventory';
      case 'performance':
        return 'Website performance';
      case 'requests':
        return 'Open requests';
      case 'leads':
        return isMedical ? 'Patient enquiries' : 'New enquiries';
      case 'bookings':
        return isHospitality ? 'Reservations' : 'Appointments';
      case 'store':
        return 'Orders';
      case 'analytics':
      case 'traffic':
        return 'Website traffic';
      case 'seo':
        return 'Search visibility';
      case 'billing':
        return 'Billing';
      case 'care':
        return 'Subscription';
      case 'team':
        return 'Team';
      case 'support':
        return 'Support';
      case 'settings':
        return 'Settings';
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
