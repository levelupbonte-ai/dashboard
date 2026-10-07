import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { Tenant, Website } from '../types';
import { dataService } from '../services/dataService';

interface TenantContextType {
  currentTenant: Tenant;
  tenants: Tenant[];
  switchTenant: (tenantId: string) => void;
  websites: Website[];
  activeWebsite: Website | null;
  setActiveWebsite: (website: Website) => void;
  refreshTenantData: () => void;
  isLoadingData: boolean;
  triggerDatabaseLoad: (durationMs?: number) => void;
  // Dynamic feature gates based on tenant services purchased
  hasBookings: boolean;
  hasEcommerce: boolean;
  hasSeo: boolean;
  hasCarePlan: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenants, setTenants] = useState<Tenant[]>(() => dataService.getAllTenants());
  const [currentTenantId, setCurrentTenantId] = useState<string>('tenant-lumina-01');
  const [websites, setWebsites] = useState<Website[]>([]);
  const [activeWebsite, setActiveWebsite] = useState<Website | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  const currentTenant = useMemo(() => {
    return tenants.find((t) => t.id === currentTenantId) || tenants[0];
  }, [tenants, currentTenantId]);

  const triggerDatabaseLoad = (durationMs = 550) => {
    setIsLoadingData(true);
    window.setTimeout(() => {
      setIsLoadingData(false);
    }, durationMs);
  };

  const refreshTenantData = () => {
    triggerDatabaseLoad(500);
    const all = dataService.getAllTenants();
    setTenants(all);
    const siteList = dataService.getWebsites(currentTenantId);
    setWebsites(siteList);
    if (siteList.length > 0) {
      setActiveWebsite(siteList[0]);
    } else {
      setActiveWebsite(null);
    }
  };

  useEffect(() => {
    setIsLoadingData(true);
    const siteList = dataService.getWebsites(currentTenantId);
    setWebsites(siteList);
    if (siteList.length > 0) {
      setActiveWebsite(siteList[0]);
    } else {
      setActiveWebsite(null);
    }
    const timer = window.setTimeout(() => {
      setIsLoadingData(false);
    }, 600);
    return () => window.clearTimeout(timer);
  }, [currentTenantId]);

  const switchTenant = (tenantId: string) => {
    if (tenantId === currentTenantId) {
      triggerDatabaseLoad(450);
      return;
    }
    setCurrentTenantId(tenantId);
  };

  const hasBookings = Boolean(currentTenant?.features?.has_bookings);
  const hasEcommerce = Boolean(currentTenant?.features?.has_ecommerce);
  const hasSeo = Boolean(currentTenant?.features?.has_seo);
  const hasCarePlan = Boolean(currentTenant?.features?.has_care_plan);

  const value = useMemo(
    () => ({
      currentTenant,
      tenants,
      switchTenant,
      websites,
      activeWebsite,
      setActiveWebsite,
      refreshTenantData,
      isLoadingData,
      triggerDatabaseLoad,
      hasBookings,
      hasEcommerce,
      hasSeo,
      hasCarePlan,
    }),
    [
      currentTenant,
      tenants,
      websites,
      activeWebsite,
      isLoadingData,
      hasBookings,
      hasEcommerce,
      hasSeo,
      hasCarePlan,
    ]
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
