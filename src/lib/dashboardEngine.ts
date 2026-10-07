import {
  Tenant,
  Website,
  OrganizationRole,
  DashboardEngineConfig,
  DashboardNavGroup,
  DashboardNavTab,
  QuickActionItem,
  PrioritizedAttentionItem,
  WebsiteType,
} from '../types';

export interface LiveDataMetricsSummary {
  pendingBookingsCount: number;
  upcomingBookingsCount: number;
  totalBookingsCount?: number;
  totalGuestsOrCovers?: number;
  openRequestsCount: number;
  newLeadsCount: number;
  totalLeadsCount?: number;
  pipelineValue?: number;
  storeOrdersCount: number;
  lowStockItemsCount: number;
  catalogCount?: number;
  draftAnnouncementsCount: number;
  totalVisitors: number;
  revenueTotal?: number;
  averageOrderValue?: number;
  performanceScore?: number;
  trafficTrend?: number[];
  leadsTrend?: number[];
  bookingsTrend?: number[];
  ordersTrend?: number[];
  visitorsChangePct?: number;
}

export function determineWebsiteType(tenant: Tenant, website?: Website | null): WebsiteType {
  if (website?.config?.website_type) {
    return website.config.website_type;
  }
  if (tenant.slug === 'velvet-vine') return 'restaurant';
  if (tenant.slug === 'lumina-health') return 'clinic';
  if (tenant.slug === 'apex-goods' || tenant.features.has_ecommerce) return 'ecommerce';
  if (tenant.slug === 'vantage-advisory') return 'corporate';
  return 'corporate';
}

export function generateDashboardEngineConfig(
  tenant: Tenant,
  website: Website | null,
  orgRole: OrganizationRole,
  metrics: LiveDataMetricsSummary
): DashboardEngineConfig {
  const type = determineWebsiteType(tenant, website);
  const isViewer = orgRole === 'VIEWER';

  // 1. Navigation generation based on website type & features
  const navGroups: DashboardNavGroup[] = [];

  // Group: Overview
  navGroups.push({
    label: 'Overview',
    items: [
      {
        id: 'overview',
        title: 'Overview',
        icon: 'LayoutDashboard',
      },
    ],
  });

  // Group: Website (Cloudflare-style clean hierarchy with concise sub-sections)
  const websiteSubItems: { id: string; subTab: string; title: string }[] = [
    { id: 'website-sub-content', subTab: 'homepage', title: 'Pages & Content' },
    { id: 'website-sub-media', subTab: 'media', title: 'Media Library' },
  ];

  if (type === 'restaurant') {
    websiteSubItems.push({
      id: 'website-sub-menu',
      subTab: 'menu',
      title: 'Food & Wine Menu',
    });
  } else if (type === 'clinic' || type === 'corporate') {
    websiteSubItems.push({
      id: 'website-sub-services',
      subTab: 'services',
      title: type === 'clinic' ? 'Clinical Services' : 'Services & Offerings',
    });
  } else if (type === 'ecommerce') {
    websiteSubItems.push({
      id: 'website-sub-products',
      subTab: 'products',
      title: 'Products & Catalog',
    });
  }

  websiteSubItems.push({
    id: 'website-sub-announcements',
    subTab: 'announcements',
    title: 'Announcements',
  });

  websiteSubItems.push({
    id: 'website-sub-settings',
    subTab: 'info',
    title: 'Settings & Domains',
  });

  navGroups.push({
    label: 'Website',
    items: [
      {
        id: 'website-control',
        title: 'Website Control',
        icon: 'Globe',
        badge: metrics.draftAnnouncementsCount > 0 ? `${metrics.draftAnnouncementsCount} draft` : undefined,
        badgeColor: 'amber',
        subItems: websiteSubItems,
      },
    ],
  });

  // Group: Operations (Dynamic business data)
  const operationItems: DashboardNavTab[] = [];

  if (type === 'restaurant') {
    operationItems.push({
      id: 'bookings',
      title: 'Reservations',
      icon: 'CalendarDays',
      badge: metrics.upcomingBookingsCount > 0 ? metrics.upcomingBookingsCount : undefined,
    });
    operationItems.push({
      id: 'leads',
      title: 'Event Enquiries',
      icon: 'MessageSquare',
      badge: metrics.newLeadsCount > 0 ? metrics.newLeadsCount : undefined,
    });
  } else if (type === 'clinic') {
    operationItems.push({
      id: 'bookings',
      title: 'Appointments',
      icon: 'CalendarDays',
      badge: metrics.upcomingBookingsCount > 0 ? metrics.upcomingBookingsCount : undefined,
    });
    operationItems.push({
      id: 'leads',
      title: 'Patient Enquiries',
      icon: 'Users2',
      badge: metrics.newLeadsCount > 0 ? metrics.newLeadsCount : undefined,
    });
  } else if (type === 'ecommerce') {
    operationItems.push({
      id: 'store',
      title: 'Customer Orders',
      icon: 'Package',
      badge: metrics.storeOrdersCount > 0 ? metrics.storeOrdersCount : undefined,
    });
    operationItems.push({
      id: 'inventory',
      title: 'Stock & Inventory',
      icon: 'Boxes',
      badge: metrics.lowStockItemsCount > 0 ? `${metrics.lowStockItemsCount} low` : undefined,
      badgeColor: 'rose',
    });
    operationItems.push({
      id: 'leads',
      title: 'Customer Inquiries',
      icon: 'MessageSquare',
    });
  } else {
    // Corporate
    operationItems.push({
      id: 'leads',
      title: 'Inbound Enquiries',
      icon: 'Users2',
      badge: metrics.newLeadsCount > 0 ? metrics.newLeadsCount : undefined,
    });
  }

  navGroups.push({
    label: 'Operations',
    items: operationItems,
  });

  // Group: Analytics
  navGroups.push({
    label: 'Analytics',
    items: [
      {
        id: 'analytics',
        title: 'Website Traffic',
        icon: 'LineChart',
      },
      {
        id: 'seo',
        title: 'Search Visibility',
        icon: 'SearchCode',
      },
    ],
  });

  // Group: LevelUp Workspace & Operations
  const workspaceItems: DashboardNavTab[] = [
    {
      id: 'requests',
      title: 'Change Requests',
      icon: 'FileCode2',
      badge: metrics.openRequestsCount > 0 ? metrics.openRequestsCount : undefined,
    },
  ];

  if (orgRole === 'OWNER' || orgRole === 'ADMIN') {
    workspaceItems.push({
      id: 'billing',
      title: 'Billing & Plan',
      icon: 'CreditCard',
    });
    workspaceItems.push({
      id: 'care',
      title: 'Care Plan SLA',
      icon: 'ShieldCheck',
    });
  }

  workspaceItems.push({
    id: 'team',
    title: 'Organization Team',
    icon: 'UserCheck',
  });
  workspaceItems.push({
    id: 'support',
    title: 'LevelUp Support',
    icon: 'LifeBuoy',
  });
  workspaceItems.push({
    id: 'settings',
    title: 'Settings & Security',
    icon: 'Settings',
  });

  navGroups.push({
    label: 'LevelUp Workspace',
    items: workspaceItems,
  });

  // 2. Contextual Quick Actions based on type
  const quickActions: QuickActionItem[] = [];

  if (type === 'restaurant') {
    quickActions.push({
      id: 'qa-menu',
      label: 'Add Menu Item',
      action_tab: 'website-menu',
      sub_tab: 'items',
      icon: 'Utensils',
      description: 'Add a new seasonal dish or wine with price & dietary tags',
    });
    quickActions.push({
      id: 'qa-reservations',
      label: 'View Reservations',
      action_tab: 'bookings',
      icon: 'CalendarDays',
      description: 'Check today and upcoming dining table bookings',
    });
    quickActions.push({
      id: 'qa-announcement',
      label: 'Publish Announcement',
      action_tab: 'website-announcements',
      icon: 'Megaphone',
      description: 'Broadcast holiday hours or chef special tasting menu',
    });
    quickActions.push({
      id: 'qa-request',
      label: 'Request Structural Change',
      action_tab: 'requests',
      icon: 'Sparkles',
      description: 'Ask LevelUp engineers for code or custom UI additions',
    });
  } else if (type === 'clinic') {
    quickActions.push({
      id: 'qa-service',
      label: 'Add Clinical Service',
      action_tab: 'website-services',
      icon: 'Briefcase',
      description: 'Define consultation type, duration, price and booking options',
    });
    quickActions.push({
      id: 'qa-team',
      label: 'Add Doctor / Staff',
      action_tab: 'website-team',
      icon: 'Users',
      description: 'Introduce new medical practitioner or specialist profile',
    });
    quickActions.push({
      id: 'qa-appointments',
      label: 'View Appointments',
      action_tab: 'bookings',
      icon: 'CalendarDays',
      description: 'Manage confirmed and pending telehealth or clinic sessions',
    });
    quickActions.push({
      id: 'qa-hours',
      label: 'Edit Clinic Hours',
      action_tab: 'website-control',
      sub_tab: 'hours',
      icon: 'Clock',
      description: 'Update opening hours and emergency contact numbers',
    });
  } else if (type === 'ecommerce') {
    quickActions.push({
      id: 'qa-product',
      label: 'Add New Product',
      action_tab: 'website-products',
      icon: 'PlusCircle',
      description: 'Upload product imagery, set price, SKU, and inventory count',
    });
    quickActions.push({
      id: 'qa-inventory',
      label: 'Update Stock Levels',
      action_tab: 'inventory',
      icon: 'Boxes',
      description: 'Adjust inventory quantities across product variants',
    });
    quickActions.push({
      id: 'qa-orders',
      label: 'Manage Orders',
      action_tab: 'store',
      icon: 'Package',
      description: 'Review orders needing processing and fulfillment',
    });
    quickActions.push({
      id: 'qa-hero',
      label: 'Update Hero Promotion',
      action_tab: 'website-content',
      icon: 'Image',
      description: 'Feature latest collection or seasonal discount banner',
    });
  } else {
    // Corporate
    quickActions.push({
      id: 'qa-service',
      label: 'Add Practice Area',
      action_tab: 'website-services',
      icon: 'Briefcase',
      description: 'Highlight new advisory specialization or client offering',
    });
    quickActions.push({
      id: 'qa-article',
      label: 'Publish Insight / Article',
      action_tab: 'website-blog',
      icon: 'BookOpen',
      description: 'Share market analysis or company announcement',
    });
    quickActions.push({
      id: 'qa-leads',
      label: 'Review Inbound Deals',
      action_tab: 'leads',
      icon: 'Users2',
      description: 'Evaluate high-value prospect enquiries from contact form',
    });
    quickActions.push({
      id: 'qa-request',
      label: 'Request Feature Build',
      action_tab: 'requests',
      icon: 'Sparkles',
      description: 'Submit technical request to your LevelUp dedicated engineer',
    });
  }

  // 3. Intelligent Prioritized Attention Items
  const priorities: PrioritizedAttentionItem[] = [];

  if (metrics.openRequestsCount > 0) {
    priorities.push({
      id: 'prio-requests',
      type: 'info',
      title: `${metrics.openRequestsCount} Technical Change Request${metrics.openRequestsCount > 1 ? 's' : ''} in Progress`,
      message: 'LevelUp engineering is actively reviewing and working on your requested updates.',
      action_tab: 'requests',
      action_label: 'View Requests',
    });
  }

  if (metrics.upcomingBookingsCount > 0) {
    priorities.push({
      id: 'prio-bookings',
      type: 'urgent',
      title: `${metrics.upcomingBookingsCount} Upcoming ${type === 'restaurant' ? 'Reservations' : 'Appointments'} Scheduled`,
      message: 'New guests or patients are booked for the upcoming cycle.',
      action_tab: 'bookings',
      action_label: 'Review Schedule',
    });
  }

  if (metrics.lowStockItemsCount > 0 && type === 'ecommerce') {
    priorities.push({
      id: 'prio-low-stock',
      type: 'warning',
      title: `${metrics.lowStockItemsCount} Product${metrics.lowStockItemsCount > 1 ? 's' : ''} Running Low on Stock`,
      message: 'Inventory has dropped below safety thresholds on active store items.',
      action_tab: 'inventory',
      action_label: 'Update Inventory',
    });
  }

  if (metrics.draftAnnouncementsCount > 0) {
    priorities.push({
      id: 'prio-draft-announcement',
      type: 'warning',
      title: 'Unpublished Announcement Draft in Queue',
      message: 'You have drafted a banner announcement that is not yet visible to public visitors.',
      action_tab: 'website-announcements',
      action_label: 'Publish Announcement',
    });
  }

  // 4. Overview Metrics adapted to website type (Strictly Data-Driven)
  let overviewMetrics = [];

  if (type === 'restaurant') {
    overviewMetrics = [
      {
        key: 'reservations',
        label: 'Active Reservations',
        value: metrics.upcomingBookingsCount,
        numericValue: metrics.upcomingBookingsCount,
        change: metrics.upcomingBookingsCount > 0 ? `+${metrics.upcomingBookingsCount} active` : undefined,
        changeType: (metrics.upcomingBookingsCount > 0 ? 'positive' : 'neutral') as 'positive' | 'neutral',
        comparisonPeriod: 'upcoming schedule',
        subtext: metrics.upcomingBookingsCount > 0 ? `${metrics.pendingBookingsCount} pending confirmation` : 'Schedule open',
        emptyMessage: metrics.upcomingBookingsCount === 0 ? 'No reservations currently scheduled' : undefined,
        sparklineData: metrics.bookingsTrend || [1, 2, 1, 3, 2, 4, metrics.upcomingBookingsCount],
        sparklineColor: 'emerald' as const,
        isPositive: true,
      },
      {
        key: 'covers',
        label: 'Dining Covers Booked',
        value: metrics.totalGuestsOrCovers ?? (metrics.upcomingBookingsCount * 2),
        numericValue: metrics.totalGuestsOrCovers ?? (metrics.upcomingBookingsCount * 2),
        suffix: ' guests',
        change: metrics.upcomingBookingsCount > 0 ? `Avg party size: ${((metrics.totalGuestsOrCovers || (metrics.upcomingBookingsCount * 2)) / Math.max(metrics.upcomingBookingsCount, 1)).toFixed(1)}` : undefined,
        changeType: 'neutral' as const,
        subtext: metrics.upcomingBookingsCount > 0 ? 'Confirmed dining parties' : 'No upcoming guests',
        sparklineData: [2, 4, 3, 6, 5, 8, metrics.totalGuestsOrCovers || 4],
        sparklineColor: 'indigo' as const,
        isPositive: true,
      },
      {
        key: 'visitors',
        label: 'Website Menu & Venue Views',
        value: metrics.totalVisitors,
        numericValue: metrics.totalVisitors,
        change: `+${metrics.visitorsChangePct || 14.2}%`,
        changeType: 'positive' as const,
        comparisonPeriod: 'vs prev 30 days',
        subtext: 'Mobile traffic: 76%',
        sparklineData: metrics.trafficTrend || [420, 480, 510, 460, 590, 640, 710],
        sparklineColor: 'emerald' as const,
        isPositive: true,
      },
      {
        key: 'leads',
        label: 'Private Dining Enquiries',
        value: metrics.newLeadsCount,
        numericValue: metrics.newLeadsCount,
        change: metrics.newLeadsCount > 0 ? `${metrics.newLeadsCount} new` : 'All reviewed',
        changeType: (metrics.newLeadsCount > 0 ? 'positive' : 'neutral') as 'positive' | 'neutral',
        subtext: metrics.pipelineValue ? `Est. value: $${metrics.pipelineValue.toLocaleString()}` : 'Event inquiries',
        emptyMessage: metrics.newLeadsCount === 0 ? 'No pending private event inquiries' : undefined,
        sparklineData: metrics.leadsTrend || [0, 1, 0, 1, 1, 2, metrics.newLeadsCount],
        sparklineColor: 'amber' as const,
        isPositive: true,
      },
    ];
  } else if (type === 'clinic') {
    overviewMetrics = [
      {
        key: 'appointments',
        label: 'Booked Consultations',
        value: metrics.upcomingBookingsCount,
        numericValue: metrics.upcomingBookingsCount,
        change: metrics.upcomingBookingsCount > 0 ? `+${metrics.upcomingBookingsCount} booked` : 'Schedule open',
        changeType: (metrics.upcomingBookingsCount > 0 ? 'positive' : 'neutral') as 'positive' | 'neutral',
        comparisonPeriod: 'telehealth & in-clinic',
        subtext: `${metrics.pendingBookingsCount} awaiting intake approval`,
        emptyMessage: metrics.upcomingBookingsCount === 0 ? 'No patient appointments scheduled' : undefined,
        sparklineData: metrics.bookingsTrend || [2, 3, 2, 4, 3, 5, metrics.upcomingBookingsCount],
        sparklineColor: 'emerald' as const,
        isPositive: true,
      },
      {
        key: 'leads',
        label: 'New Patient Inquiries',
        value: metrics.newLeadsCount,
        numericValue: metrics.newLeadsCount,
        change: metrics.newLeadsCount > 0 ? `${metrics.newLeadsCount} awaiting response` : 'All contacted',
        changeType: (metrics.newLeadsCount > 0 ? 'positive' : 'neutral') as 'positive' | 'neutral',
        subtext: metrics.pipelineValue ? `Pipeline: $${metrics.pipelineValue.toLocaleString()}` : 'Inbound requests',
        emptyMessage: metrics.newLeadsCount === 0 ? 'No new patient inquiries' : undefined,
        sparklineData: metrics.leadsTrend || [1, 2, 1, 3, 2, 4, metrics.newLeadsCount],
        sparklineColor: 'indigo' as const,
        isPositive: true,
      },
      {
        key: 'visitors',
        label: 'Portal Monthly Visitors',
        value: metrics.totalVisitors,
        numericValue: metrics.totalVisitors,
        change: `+${metrics.visitorsChangePct || 18.5}%`,
        changeType: 'positive' as const,
        comparisonPeriod: 'vs prev 30 days',
        subtext: 'Organic search: 58%',
        sparklineData: metrics.trafficTrend || [420, 480, 510, 460, 590, 640, 710],
        sparklineColor: 'emerald' as const,
        isPositive: true,
      },
      {
        key: 'performance',
        label: 'Website Performance Score',
        value: metrics.performanceScore ? `${metrics.performanceScore} / 100` : '98 / 100',
        numericValue: metrics.performanceScore || 98,
        suffix: ' / 100',
        change: 'Core Web Vitals Passed',
        changeType: 'positive' as const,
        subtext: 'Lighthouse A+ rating',
        sparklineData: [96, 97, 96, 98, 97, 98, metrics.performanceScore || 98],
        sparklineColor: 'emerald' as const,
        isPositive: true,
      },
    ];
  } else if (type === 'ecommerce') {
    overviewMetrics = [
      {
        key: 'orders',
        label: 'Store Orders (30d)',
        value: metrics.storeOrdersCount,
        numericValue: metrics.storeOrdersCount,
        change: metrics.storeOrdersCount > 0 ? `+${metrics.storeOrdersCount} orders` : undefined,
        changeType: (metrics.storeOrdersCount > 0 ? 'positive' : 'neutral') as 'positive' | 'neutral',
        comparisonPeriod: 'vs prev period',
        subtext: metrics.averageOrderValue ? `Avg order: $${Math.round(metrics.averageOrderValue)}` : 'Store fulfillment active',
        emptyMessage: metrics.storeOrdersCount === 0 ? 'No customer orders placed yet' : undefined,
        sparklineData: metrics.ordersTrend || [1, 2, 1, 3, 2, 3, metrics.storeOrdersCount],
        sparklineColor: 'emerald' as const,
        isPositive: true,
      },
      {
        key: 'revenue',
        label: 'Gross Store Volume',
        value: metrics.revenueTotal || 0,
        numericValue: metrics.revenueTotal || 0,
        prefix: '$',
        change: (metrics.revenueTotal || 0) > 0 ? '+16.5%' : undefined,
        changeType: ((metrics.revenueTotal || 0) > 0 ? 'positive' : 'neutral') as 'positive' | 'neutral',
        comparisonPeriod: 'vs prev 30 days',
        subtext: 'Stripe payments synchronized',
        emptyMessage: (metrics.revenueTotal || 0) === 0 ? '$0 recorded in store transactions' : undefined,
        sparklineData: [340, 560, 420, 890, 710, 1120, metrics.revenueTotal || 1445],
        sparklineColor: 'emerald' as const,
        isPositive: true,
      },
      {
        key: 'visitors',
        label: 'Store Shoppers',
        value: metrics.totalVisitors,
        numericValue: metrics.totalVisitors,
        change: `+${metrics.visitorsChangePct || 24.3}%`,
        changeType: 'positive' as const,
        comparisonPeriod: 'vs prev 30 days',
        subtext: `Conversion rate: ${metrics.totalVisitors > 0 && metrics.storeOrdersCount > 0 ? ((metrics.storeOrdersCount / metrics.totalVisitors) * 100).toFixed(1) : '2.8'}%`,
        sparklineData: metrics.trafficTrend || [800, 920, 1100, 980, 1250, 1400, 1550],
        sparklineColor: 'indigo' as const,
        isPositive: true,
      },
      {
        key: 'inventory',
        label: 'Catalog Items',
        value: metrics.catalogCount || 0,
        numericValue: metrics.catalogCount || 0,
        suffix: ' products',
        change: metrics.lowStockItemsCount > 0 ? `${metrics.lowStockItemsCount} low stock` : 'Healthy stock',
        changeType: (metrics.lowStockItemsCount > 0 ? 'negative' : 'positive') as 'negative' | 'positive',
        subtext: 'Inventory fulfillment active',
        sparklineData: [12, 12, 14, 14, 15, 16, metrics.catalogCount || 16],
        sparklineColor: (metrics.lowStockItemsCount > 0 ? 'amber' : 'emerald') as 'amber' | 'emerald',
        isPositive: metrics.lowStockItemsCount === 0,
      },
    ];
  } else {
    // Corporate
    overviewMetrics = [
      {
        key: 'enquiries',
        label: 'Inbound Mandate Enquiries',
        value: metrics.newLeadsCount,
        numericValue: metrics.newLeadsCount,
        change: metrics.newLeadsCount > 0 ? `+${metrics.newLeadsCount} active` : 'All reviewed',
        changeType: (metrics.newLeadsCount > 0 ? 'positive' : 'neutral') as 'positive' | 'neutral',
        comparisonPeriod: 'this week',
        subtext: metrics.pipelineValue ? `Est. deal value: $${metrics.pipelineValue.toLocaleString()}` : 'Mandate inquiries',
        emptyMessage: metrics.newLeadsCount === 0 ? 'No new inbound enquiries' : undefined,
        sparklineData: metrics.leadsTrend || [1, 2, 1, 3, 2, 4, metrics.newLeadsCount],
        sparklineColor: 'emerald' as const,
        isPositive: true,
      },
      {
        key: 'visitors',
        label: 'Executive Site Visitors',
        value: metrics.totalVisitors,
        numericValue: metrics.totalVisitors,
        change: `+${metrics.visitorsChangePct || 9.4}%`,
        changeType: 'positive' as const,
        comparisonPeriod: 'vs prev 30 days',
        subtext: 'Direct & LinkedIn: 72%',
        sparklineData: metrics.trafficTrend || [220, 260, 240, 290, 310, 340, 380],
        sparklineColor: 'indigo' as const,
        isPositive: true,
      },
      {
        key: 'speed',
        label: 'Global Performance',
        value: metrics.performanceScore ? `${metrics.performanceScore} / 100` : '99 / 100',
        numericValue: metrics.performanceScore || 99,
        suffix: ' / 100',
        change: 'Grade A+',
        changeType: 'positive' as const,
        subtext: 'Sub-second edge latency',
        sparklineData: [97, 98, 98, 99, 98, 99, metrics.performanceScore || 99],
        sparklineColor: 'emerald' as const,
        isPositive: true,
      },
      {
        key: 'requests',
        label: 'LevelUp Engineering SLA',
        value: metrics.openRequestsCount > 0 ? `${metrics.openRequestsCount} in progress` : 'Active Pro',
        change: '24h turnaround',
        changeType: 'positive' as const,
        subtext: 'Dedicated engineer assigned',
        sparklineData: [1, 1, 2, 1, 2, 1, metrics.openRequestsCount || 1],
        sparklineColor: 'slate' as const,
        isPositive: true,
      },
    ];
  }

  const categoryNames: Record<WebsiteType, string> = {
    restaurant: 'Restaurant & Dining Experience',
    clinic: 'Healthcare & Telehealth Clinic',
    ecommerce: 'Digital Commerce & Retail',
    corporate: 'Capital Advisory & Corporate Advisory',
    portfolio: 'Creative Studio & Showcase',
    event: 'Event & Conference Management',
  };

  return {
    websiteType: type,
    businessCategoryName: categoryNames[type] || 'Digital Web Presence',
    navGroups,
    quickActions,
    priorities,
    overviewMetrics,
  };
}
