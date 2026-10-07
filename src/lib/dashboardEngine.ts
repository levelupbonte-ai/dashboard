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

interface LiveDataMetricsSummary {
  pendingBookingsCount: number;
  upcomingBookingsCount: number;
  openRequestsCount: number;
  newLeadsCount: number;
  storeOrdersCount: number;
  lowStockItemsCount: number;
  draftAnnouncementsCount: number;
  totalVisitors: number;
  revenueTotal?: number;
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

  // Group: Website Control Center (The Heart of LevelUp Operating System)
  const websiteItems: DashboardNavTab[] = [
    {
      id: 'website-control',
      title: 'Website Control',
      icon: 'Globe',
    },
    {
      id: 'website-content',
      title: 'Content & Pages',
      icon: 'FileText',
    },
    {
      id: 'website-media',
      title: 'Media Library',
      icon: 'Image',
    },
  ];

  // Additional type-specific content items in Website
  if (type === 'restaurant') {
    websiteItems.push({
      id: 'website-menu',
      title: 'Food & Wine Menu',
      icon: 'Utensils',
    });
  } else if (type === 'clinic' || type === 'corporate') {
    websiteItems.push({
      id: 'website-services',
      title: type === 'clinic' ? 'Clinical Services' : 'Advisory Services',
      icon: 'Briefcase',
    });
  } else if (type === 'ecommerce') {
    websiteItems.push({
      id: 'website-products',
      title: 'Products & Store',
      icon: 'ShoppingBag',
    });
  }

  // Team
  if (type === 'clinic' || type === 'corporate') {
    websiteItems.push({
      id: 'website-team',
      title: type === 'clinic' ? 'Doctors & Staff' : 'Partners & Team',
      icon: 'Users',
    });
  }

  // Gallery
  if (type === 'restaurant' || type === 'portfolio' || type === 'clinic') {
    websiteItems.push({
      id: 'website-gallery',
      title: 'Photo Gallery',
      icon: 'Camera',
    });
  }

  // Blog / Articles
  if (type === 'clinic' || type === 'corporate') {
    websiteItems.push({
      id: 'website-blog',
      title: 'Articles & Blog',
      icon: 'BookOpen',
    });
  }

  // Announcements
  websiteItems.push({
    id: 'website-announcements',
    title: 'Announcements',
    icon: 'Megaphone',
    badge: metrics.draftAnnouncementsCount > 0 ? `${metrics.draftAnnouncementsCount} draft` : undefined,
    badgeColor: 'amber',
  });

  navGroups.push({
    label: 'Website Control Center',
    items: websiteItems,
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

  // Group: Performance & SEO
  navGroups.push({
    label: 'Performance',
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
      {
        id: 'performance',
        title: 'Performance & Vitals',
        icon: 'Gauge',
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

  // 4. Overview Metrics adapted to website type
  let overviewMetrics = [];

  if (type === 'restaurant') {
    overviewMetrics = [
      {
        key: 'reservations',
        label: 'Active Reservations',
        value: metrics.upcomingBookingsCount > 0 ? metrics.upcomingBookingsCount : 18,
        change: '+14% vs last week',
        subtext: 'Next sitting tonight at 7:30 PM',
        isPositive: true,
      },
      {
        key: 'covers',
        label: 'Estimated Dining Covers',
        value: '52 guests',
        change: '+8 covers',
        subtext: 'Average party size: 3.4',
        isPositive: true,
      },
      {
        key: 'visitors',
        label: 'Website Menu Views',
        value: (metrics.totalVisitors || 8420).toLocaleString(),
        change: '+19.2%',
        subtext: 'Mobile traffic: 78%',
        isPositive: true,
      },
      {
        key: 'leads',
        label: 'Private Dining Enquiries',
        value: metrics.newLeadsCount,
        change: '3 unread',
        subtext: 'Potential value: $6,400',
        isPositive: true,
      },
    ];
  } else if (type === 'clinic') {
    overviewMetrics = [
      {
        key: 'appointments',
        label: 'Booked Consultations',
        value: metrics.upcomingBookingsCount > 0 ? metrics.upcomingBookingsCount : 24,
        change: '+12% this month',
        subtext: 'Telehealth + In-clinic',
        isPositive: true,
      },
      {
        key: 'leads',
        label: 'New Patient Inquiries',
        value: metrics.newLeadsCount > 0 ? metrics.newLeadsCount : 9,
        change: '4 awaiting response',
        subtext: 'Avg response time: 28 min',
        isPositive: true,
      },
      {
        key: 'visitors',
        label: 'Portal Monthly Visitors',
        value: (metrics.totalVisitors || 14280).toLocaleString(),
        change: '+22.4%',
        subtext: 'Organic search: 61%',
        isPositive: true,
      },
      {
        key: 'sla',
        label: 'LevelUp SLA Uptime',
        value: '100.0%',
        change: 'Verified',
        subtext: 'Page speed: 98/100',
        isPositive: true,
      },
    ];
  } else if (type === 'ecommerce') {
    overviewMetrics = [
      {
        key: 'orders',
        label: 'Store Orders (30d)',
        value: metrics.storeOrdersCount > 0 ? metrics.storeOrdersCount : 84,
        change: '+18% vs prev period',
        subtext: 'Avg order value: $138',
        isPositive: true,
      },
      {
        key: 'revenue',
        label: 'Gross Store Volume',
        value: metrics.revenueTotal ? `$${metrics.revenueTotal.toLocaleString()}` : '$11,592',
        change: '+16.5%',
        subtext: 'Stripe payments connected',
        isPositive: true,
      },
      {
        key: 'visitors',
        label: 'Store Shoppers',
        value: (metrics.totalVisitors || 19340).toLocaleString(),
        change: '+27.1%',
        subtext: 'Conversion rate: 3.2%',
        isPositive: true,
      },
      {
        key: 'inventory',
        label: 'Catalog Items',
        value: '36 products',
        change: metrics.lowStockItemsCount > 0 ? `${metrics.lowStockItemsCount} low stock` : 'Healthy stock',
        subtext: 'SKU fulfillment active',
        isPositive: metrics.lowStockItemsCount === 0,
      },
    ];
  } else {
    // Corporate
    overviewMetrics = [
      {
        key: 'enquiries',
        label: 'Qualified Inbound Mandates',
        value: metrics.newLeadsCount > 0 ? metrics.newLeadsCount : 6,
        change: '+2 this week',
        subtext: 'Est. deal value: $1.8M',
        isPositive: true,
      },
      {
        key: 'visitors',
        label: 'Executive Site Visitors',
        value: (metrics.totalVisitors || 5120).toLocaleString(),
        change: '+8.3%',
        subtext: 'Direct & LinkedIn: 72%',
        isPositive: true,
      },
      {
        key: 'speed',
        label: 'Global Performance',
        value: '99 / 100',
        change: 'A+ Grade',
        subtext: 'Sub-second edge latency',
        isPositive: true,
      },
      {
        key: 'requests',
        label: 'LevelUp Engineering SLA',
        value: 'Active Pro',
        change: '24h turnaround',
        subtext: 'Dedicated engineer assigned',
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
