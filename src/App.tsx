/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TenantProvider, useTenant } from './context/TenantContext';
import { ShadcnSidebar } from './components/layout/ShadcnSidebar';
import { ShadcnHeader } from './components/layout/ShadcnHeader';
import { MobileNav } from './components/layout/MobileNav';
import { CommandMenu } from './components/command/CommandMenu';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { OverviewPage } from './components/modules/overview/OverviewPage';
import { WebsitesPage } from './components/modules/websites/WebsitesPage';
import { RequestsPage } from './components/modules/requests/RequestsPage';
import { LeadsPage } from './components/modules/leads/LeadsPage';
import { BookingsPage } from './components/modules/bookings/BookingsPage';
import { StorePage } from './components/modules/store/StorePage';
import { SeoPage } from './components/modules/seo/SeoPage';
import { AnalyticsPage } from './components/modules/analytics/AnalyticsPage';
import { BillingPage } from './components/modules/billing/BillingPage';
import { CarePage } from './components/modules/care/CarePage';
import { SupportPage } from './components/modules/support/SupportPage';
import { SettingsPage } from './components/modules/settings/SettingsPage';
import { TeamPage } from './components/modules/team/TeamPage';
import { dataService } from './services/dataService';
import { Website } from './types';

const DashboardContent: React.FC = () => {
  const { currentTenant, hasBookings, hasEcommerce, hasSeo } = useTenant();
  const { can } = useAuth();
  const canViewBilling = can('billing.view');

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 1024 : false;
  });
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [preselectedSite, setPreselectedSite] = useState<Website | null>(null);

  // Dynamic notifications & badge counts (Respecting billing visibility privacy)
  const notifications = dataService
    .getNotifications(currentTenant.id)
    .filter((n) => (n.category === 'billing' ? canViewBilling : true));
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const requests = dataService.getRequests(currentTenant.id);
  const pendingRequestsCount = requests.filter((r) => r.status !== 'completed').length;

  // Ensure activeTab is valid when switching tenants or organization roles
  useEffect(() => {
    if (activeTab === 'bookings' && !hasBookings) {
      setActiveTab('overview');
    }
    if (activeTab === 'store' && !hasEcommerce) {
      setActiveTab('overview');
    }
    if (activeTab === 'seo' && !hasSeo) {
      setActiveTab('overview');
    }
    if ((activeTab === 'billing' || activeTab === 'care') && !canViewBilling) {
      setActiveTab('overview');
    }
  }, [currentTenant.id, hasBookings, hasEcommerce, hasSeo, canViewBilling, activeTab]);

  const handleRequestChange = (site?: Website) => {
    if (site) {
      setPreselectedSite(site);
    }
    setIsRequestModalOpen(true);
    if (activeTab !== 'requests') {
      setActiveTab('requests');
    }
  };

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewPage
            onNavigateTab={(tab) => setActiveTab(tab)}
            onRequestChange={() => handleRequestChange()}
          />
        );
      case 'websites':
      case 'performance':
        return (
          <WebsitesPage
            onNavigateTab={(tab) => setActiveTab(tab)}
            onRequestChangeForSite={(site) => handleRequestChange(site)}
          />
        );
      case 'requests':
        return (
          <RequestsPage
            isCreateModalOpen={isRequestModalOpen}
            setIsCreateModalOpen={setIsRequestModalOpen}
            preselectedSite={preselectedSite}
          />
        );
      case 'leads':
        return <LeadsPage />;
      case 'bookings':
        return hasBookings ? (
          <BookingsPage />
        ) : (
          <OverviewPage onNavigateTab={setActiveTab} onRequestChange={handleRequestChange} />
        );
      case 'store':
        return hasEcommerce ? (
          <StorePage />
        ) : (
          <OverviewPage onNavigateTab={setActiveTab} onRequestChange={handleRequestChange} />
        );
      case 'analytics':
      case 'traffic':
        return <AnalyticsPage />;
      case 'seo':
        return hasSeo ? (
          <SeoPage />
        ) : (
          <OverviewPage onNavigateTab={setActiveTab} onRequestChange={handleRequestChange} />
        );
      case 'billing':
        return <BillingPage onNavigateTab={(tab) => setActiveTab(tab)} />;
      case 'care':
        return canViewBilling ? (
          <CarePage />
        ) : (
          <OverviewPage onNavigateTab={setActiveTab} onRequestChange={handleRequestChange} />
        );
      case 'team':
        return <TeamPage />;
      case 'support':
        return <SupportPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <OverviewPage
            onNavigateTab={(tab) => setActiveTab(tab)}
            onRequestChange={() => handleRequestChange()}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-primary/20 selection:text-foreground">
      <div className="flex flex-1">
        {/* Kiranism / shadcn Sidebar */}
        <ShadcnSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          pendingRequestsCount={pendingRequestsCount}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
          <ShadcnHeader
            activeTab={activeTab}
            onToggleSidebar={() => {
              if (window.innerWidth < 768) {
                setIsMobileDrawerOpen(true);
              } else {
                setIsSidebarCollapsed(!isSidebarCollapsed);
              }
            }}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            unreadCount={unreadCount}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />

          <main className="flex-1 p-3 sm:p-5 lg:p-7 max-w-7xl w-full mx-auto animate-in fade-in-50 duration-150">
            {renderActiveModule()}
          </main>
        </div>
      </div>

      {/* Mobile Responsive Navigation & Drawer */}
      <MobileNav
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        pendingRequestsCount={pendingRequestsCount}
        isOpen={isMobileDrawerOpen}
        onOpen={() => setIsMobileDrawerOpen(true)}
        onClose={() => setIsMobileDrawerOpen(false)}
      />

      {/* Global ⌘K Command Palette */}
      <CommandMenu
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(tab) => setActiveTab(tab)}
      />

      {/* Notification Slide-Over Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkRead={(id) => dataService.markNotificationRead(currentTenant.id, id)}
        onMarkAllRead={() => dataService.markAllNotificationsRead(currentTenant.id)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TenantProvider>
          <DashboardContent />
        </TenantProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
