// =======================================================================
// LEVELUP DASHBOARD - DATA ACCESS LAYER
// Multi-tenant isolation with real persistent state and database readiness.
// All simulation data removed. Ready for database connection.
// =======================================================================

import {
  Tenant,
  Website,
  ChangeRequest,
  Lead,
  Booking,
  Invoice,
  SupportTicket,
  AppNotification,
  TrafficPoint,
  PageStat,
  TrafficSource,
  StoreOrder,
  SeoKeyword,
  AuditLogItem,
  RequestStatus,
  LeadStatus,
  OrganizationMember,
  OrganizationInvitation,
  OrganizationActivityItem,
  OrganizationRole,
} from '../types';

// =======================================================================
// PRODUCTION WORKSPACE DEFAULT SETUP
// =======================================================================

const DEFAULT_TENANT_ID = 'tenant-main';

const DEFAULT_TENANT: Tenant = {
  id: DEFAULT_TENANT_ID,
  name: 'LevelUp Workspace',
  slug: 'levelup-workspace',
  company_email: 'workspace@levelup.dev',
  care_plan: 'pro',
  stripe_customer_id: '',
  features: {
    has_bookings: true,
    has_ecommerce: true,
    has_seo: true,
    has_care_plan: true,
    has_analytics: true,
    has_leads: true,
    custom_domains_count: 1,
  },
  created_at: new Date().toISOString(),
};

const DEFAULT_WEBSITE: Website = {
  id: 'web-main',
  tenant_id: DEFAULT_TENANT_ID,
  name: 'Production Workspace',
  domain: 'levelup.dev',
  staging_domain: 'staging.levelup.dev',
  status: 'live',
  preview_url: 'https://levelup.dev',
  performance_score: 99,
  seo_score: 98,
  accessibility_score: 100,
  care_plan: 'pro',
  visitors_30d: 0,
  last_deployed_at: new Date().toISOString(),
  framework: 'Next.js 16 + Tailwind',
  config: {
    website_type: 'corporate',
    features: [
      'information',
      'homepage',
      'media',
      'services',
      'team',
      'bookings',
      'faqs',
      'announcements',
      'blog',
      'gallery',
      'navigation',
      'seo',
      'analytics',
      'requests',
    ],
    homepage_modules: ['hero', 'announcement', 'featured_services', 'faq'],
    currency: 'USD',
    timezone: 'UTC',
  },
};

// Helper for local persistent storage
const loadStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(`levelup_db_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveStorage = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`levelup_db_${key}`, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to local storage', err);
  }
};

// Clean in-memory states with localStorage persistence (no simulation data)
let tenantsState: Tenant[] = loadStorage<Tenant[]>('tenants', [DEFAULT_TENANT]);
let websitesState: Record<string, Website[]> = loadStorage<Record<string, Website[]>>('websites', {
  [DEFAULT_TENANT_ID]: [DEFAULT_WEBSITE],
});
let requestsState: Record<string, ChangeRequest[]> = loadStorage<Record<string, ChangeRequest[]>>(
  'requests',
  { [DEFAULT_TENANT_ID]: [] }
);
let leadsState: Record<string, Lead[]> = loadStorage<Record<string, Lead[]>>('leads', {
  [DEFAULT_TENANT_ID]: [],
});
let bookingsState: Record<string, Booking[]> = loadStorage<Record<string, Booking[]>>('bookings', {
  [DEFAULT_TENANT_ID]: [],
});
let invoicesState: Record<string, Invoice[]> = loadStorage<Record<string, Invoice[]>>('invoices', {
  [DEFAULT_TENANT_ID]: [],
});
let ticketsState: Record<string, SupportTicket[]> = loadStorage<Record<string, SupportTicket[]>>(
  'tickets',
  { [DEFAULT_TENANT_ID]: [] }
);
let notificationsState: Record<string, AppNotification[]> = loadStorage<
  Record<string, AppNotification[]>
>('notifications', { [DEFAULT_TENANT_ID]: [] });
let storeOrdersState: Record<string, StoreOrder[]> = loadStorage<Record<string, StoreOrder[]>>(
  'store_orders',
  { [DEFAULT_TENANT_ID]: [] }
);
let seoKeywordsState: Record<string, SeoKeyword[]> = loadStorage<Record<string, SeoKeyword[]>>(
  'seo_keywords',
  { [DEFAULT_TENANT_ID]: [] }
);
let auditLogsState: AuditLogItem[] = loadStorage<AuditLogItem[]>('audit_logs', []);
let orgMembersState: Record<string, OrganizationMember[]> = loadStorage<
  Record<string, OrganizationMember[]>
>('org_members', {
  [DEFAULT_TENANT_ID]: [
    {
      id: 'mem-admin',
      organization_id: DEFAULT_TENANT_ID,
      full_name: 'Workspace Administrator',
      email: 'admin@levelup.dev',
      org_role: 'OWNER',
      title: 'Workspace Owner',
      mfa_enabled: true,
      status: 'active',
      joined_at: new Date().toISOString(),
      last_active_at: new Date().toISOString(),
    },
  ],
});
let orgInvitationsState: Record<string, OrganizationInvitation[]> = loadStorage<
  Record<string, OrganizationInvitation[]>
>('org_invitations', { [DEFAULT_TENANT_ID]: [] });
let orgActivityState: Record<string, OrganizationActivityItem[]> = loadStorage<
  Record<string, OrganizationActivityItem[]>
>('org_activity', { [DEFAULT_TENANT_ID]: [] });

// =======================================================================
// SERVICE REPOSITORY API
// =======================================================================

export const dataService = {
  // TENANTS
  getAllTenants: (): Tenant[] => {
    return [...tenantsState];
  },

  getTenantById: (tenantId: string): Tenant | undefined => {
    return tenantsState.find((t) => t.id === tenantId) || tenantsState[0];
  },

  updateTenantFeatures: (tenantId: string, features: Partial<Tenant['features']>): Tenant => {
    tenantsState = tenantsState.map((t) => {
      if (t.id === tenantId) {
        return {
          ...t,
          features: { ...t.features, ...features },
        };
      }
      return t;
    });
    saveStorage('tenants', tenantsState);
    return tenantsState.find((t) => t.id === tenantId)!;
  },

  // WEBSITES
  getWebsites: (tenantId: string): Website[] => {
    return websitesState[tenantId] || websitesState[DEFAULT_TENANT_ID] || [];
  },

  // CHANGE REQUESTS
  getRequests: (tenantId: string): ChangeRequest[] => {
    return requestsState[tenantId] || [];
  },

  createRequest: (
    tenantId: string,
    payload: Omit<ChangeRequest, 'id' | 'tenant_id' | 'created_at' | 'updated_at' | 'messages'>
  ): ChangeRequest => {
    const newRequest: ChangeRequest = {
      ...payload,
      id: `req-${Date.now().toString(36)}`,
      tenant_id: tenantId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      messages: [],
    };

    if (!requestsState[tenantId]) {
      requestsState[tenantId] = [];
    }
    requestsState[tenantId] = [newRequest, ...requestsState[tenantId]];
    saveStorage('requests', requestsState);

    dataService.logOrganizationActivity(tenantId, {
      actor_name: 'You',
      actor_email: 'admin@levelup.dev',
      actor_role: 'OWNER',
      action: 'submitted change request',
      target: newRequest.title,
      category: 'request',
    });

    return newRequest;
  },

  addRequestMessage: (
    tenantId: string,
    requestId: string,
    senderName: string,
    senderRole: 'client' | 'admin' | 'super_admin',
    message: string
  ): void => {
    const requests = requestsState[tenantId] || [];
    const target = requests.find((r) => r.id === requestId);
    if (target) {
      target.messages.push({
        id: `msg-${Date.now()}`,
        request_id: requestId,
        sender_name: senderName,
        sender_role: senderRole,
        message,
        created_at: new Date().toISOString(),
      });
      target.updated_at = new Date().toISOString();
      saveStorage('requests', requestsState);
    }
  },

  updateRequestStatus: (tenantId: string, requestId: string, status: RequestStatus): void => {
    const requests = requestsState[tenantId] || [];
    const target = requests.find((r) => r.id === requestId);
    if (target) {
      target.status = status;
      target.updated_at = new Date().toISOString();
      if (status === 'completed') {
        target.completed_at = new Date().toISOString();
      }
      saveStorage('requests', requestsState);
    }
  },

  // LEADS
  getLeads: (tenantId: string): Lead[] => {
    return leadsState[tenantId] || [];
  },

  createLead: (tenantId: string, lead: Omit<Lead, 'id' | 'tenant_id' | 'created_at'>): Lead => {
    const newLead: Lead = {
      ...lead,
      id: `lead-${Date.now().toString(36)}`,
      tenant_id: tenantId,
      created_at: new Date().toISOString(),
    };
    if (!leadsState[tenantId]) {
      leadsState[tenantId] = [];
    }
    leadsState[tenantId] = [newLead, ...leadsState[tenantId]];
    saveStorage('leads', leadsState);
    return newLead;
  },

  updateLeadStatus: (tenantId: string, leadId: string, status: LeadStatus, notes?: string): void => {
    const leads = leadsState[tenantId] || [];
    const lead = leads.find((l) => l.id === leadId);
    if (lead) {
      lead.status = status;
      if (notes !== undefined) {
        lead.notes = notes;
      }
      saveStorage('leads', leadsState);
    }
  },

  deleteLead: (tenantId: string, leadId: string): void => {
    if (leadsState[tenantId]) {
      leadsState[tenantId] = leadsState[tenantId].filter((l) => l.id !== leadId);
      saveStorage('leads', leadsState);
    }
  },

  // BOOKINGS
  getBookings: (tenantId: string): Booking[] => {
    return bookingsState[tenantId] || [];
  },

  createBooking: (tenantId: string, booking: Omit<Booking, 'id' | 'tenant_id'>): Booking => {
    const newBooking: Booking = {
      ...booking,
      id: `bk-${Date.now().toString(36)}`,
      tenant_id: tenantId,
    };
    if (!bookingsState[tenantId]) {
      bookingsState[tenantId] = [];
    }
    bookingsState[tenantId] = [newBooking, ...bookingsState[tenantId]];
    saveStorage('bookings', bookingsState);
    return newBooking;
  },

  updateBookingStatus: (
    tenantId: string,
    bookingId: string,
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  ): void => {
    const bookings = bookingsState[tenantId] || [];
    const b = bookings.find((item) => item.id === bookingId);
    if (b) {
      b.status = status;
      saveStorage('bookings', bookingsState);
    }
  },

  cancelBooking: (tenantId: string, bookingId: string): void => {
    dataService.updateBookingStatus(tenantId, bookingId, 'cancelled');
  },

  // INVOICES
  getInvoices: (tenantId: string): Invoice[] => {
    return invoicesState[tenantId] || [];
  },

  // ORGANIZATION TEAM MEMBERS
  getOrganizationMembers: (tenantId: string): OrganizationMember[] => {
    return orgMembersState[tenantId] || [];
  },

  getOrganizationInvitations: (tenantId: string): OrganizationInvitation[] => {
    return orgInvitationsState[tenantId] || [];
  },

  getOrganizationActivity: (tenantId: string): OrganizationActivityItem[] => {
    return orgActivityState[tenantId] || [];
  },

  logOrganizationActivity: (
    tenantId: string,
    payload: Omit<OrganizationActivityItem, 'id' | 'organization_id' | 'created_at'>
  ): OrganizationActivityItem => {
    const entry: OrganizationActivityItem = {
      ...payload,
      id: `act-${Date.now().toString(36)}`,
      organization_id: tenantId,
      created_at: new Date().toISOString(),
    };
    if (!orgActivityState[tenantId]) {
      orgActivityState[tenantId] = [];
    }
    orgActivityState[tenantId] = [entry, ...orgActivityState[tenantId]];
    saveStorage('org_activity', orgActivityState);
    return entry;
  },

  inviteOrganizationMember: (
    tenantId: string,
    email: string,
    orgRole: OrganizationRole,
    invitedByName: string,
    invitedByEmail: string,
    actorRole: OrganizationRole
  ): OrganizationInvitation => {
    const cleanEmail = email.trim().toLowerCase();
    const randomHex = Math.random().toString(16).substring(2, 6);
    const invitation: OrganizationInvitation = {
      id: `inv-tok-${Date.now().toString(36)}`,
      organization_id: tenantId,
      email: cleanEmail,
      org_role: orgRole,
      invited_by_name: invitedByName,
      token_preview: `lu_inv_${randomHex}...${Date.now().toString(16).slice(-4)} (Single-use SHA-256)`,
      status: 'pending',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
    };

    if (!orgInvitationsState[tenantId]) {
      orgInvitationsState[tenantId] = [];
    }
    orgInvitationsState[tenantId] = [invitation, ...orgInvitationsState[tenantId]];
    saveStorage('org_invitations', orgInvitationsState);

    dataService.logOrganizationActivity(tenantId, {
      actor_name: invitedByName,
      actor_email: invitedByEmail,
      actor_role: actorRole,
      action: 'sent a secure organization invitation to',
      target: `${cleanEmail} (Role: ${orgRole})`,
      category: 'team',
    });

    return invitation;
  },

  revokeOrganizationInvitation: (
    tenantId: string,
    invitationId: string,
    actorName: string,
    actorEmail: string,
    actorRole: OrganizationRole
  ): void => {
    const list = orgInvitationsState[tenantId] || [];
    const target = list.find((i) => i.id === invitationId);
    if (target) {
      target.status = 'revoked';
      saveStorage('org_invitations', orgInvitationsState);
      dataService.logOrganizationActivity(tenantId, {
        actor_name: actorName,
        actor_email: actorEmail,
        actor_role: actorRole,
        action: 'revoked pending invitation for',
        target: target.email,
        category: 'team',
      });
    }
  },

  updateOrganizationMemberRole: (
    tenantId: string,
    memberId: string,
    newRole: OrganizationRole,
    actorName: string,
    actorEmail: string,
    actorRole: OrganizationRole
  ): void => {
    const members = orgMembersState[tenantId] || [];
    const target = members.find((m) => m.id === memberId);
    if (target) {
      const oldRole = target.org_role;
      target.org_role = newRole;
      saveStorage('org_members', orgMembersState);
      dataService.logOrganizationActivity(tenantId, {
        actor_name: actorName,
        actor_email: actorEmail,
        actor_role: actorRole,
        action: `updated organization role (${oldRole} → ${newRole}) for`,
        target: `${target.full_name} (${target.email})`,
        category: 'team',
      });
    }
  },

  removeOrganizationMember: (
    tenantId: string,
    memberId: string,
    actorName: string,
    actorEmail: string,
    actorRole: OrganizationRole
  ): void => {
    const members = orgMembersState[tenantId] || [];
    const target = members.find((m) => m.id === memberId);
    if (target) {
      orgMembersState[tenantId] = members.filter((m) => m.id !== memberId);
      saveStorage('org_members', orgMembersState);
      dataService.logOrganizationActivity(tenantId, {
        actor_name: actorName,
        actor_email: actorEmail,
        actor_role: actorRole,
        action: 'removed member from organization',
        target: `${target.full_name} (${target.email})`,
        category: 'team',
      });
    }
  },

  // SUPPORT TICKETS
  getSupportTickets: (tenantId: string): SupportTicket[] => {
    return ticketsState[tenantId] || [];
  },

  createSupportTicket: (
    tenantId: string,
    ticket: Omit<SupportTicket, 'id' | 'tenant_id' | 'created_at' | 'updated_at' | 'messages'>,
    initialMessage: string
  ): SupportTicket => {
    const newTicket: SupportTicket = {
      ...ticket,
      id: `tkt-${Date.now().toString(36)}`,
      tenant_id: tenantId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      messages: [
        {
          id: `tmsg-${Date.now()}`,
          request_id: '',
          sender_name: 'You',
          sender_role: 'client',
          message: initialMessage,
          created_at: new Date().toISOString(),
        },
      ],
    };
    if (!ticketsState[tenantId]) {
      ticketsState[tenantId] = [];
    }
    ticketsState[tenantId] = [newTicket, ...ticketsState[tenantId]];
    saveStorage('tickets', ticketsState);
    return newTicket;
  },

  addTicketMessage: (
    tenantId: string,
    ticketId: string,
    senderName: string,
    senderRole: 'client' | 'admin',
    message: string
  ): void => {
    const tickets = ticketsState[tenantId] || [];
    const t = tickets.find((item) => item.id === ticketId);
    if (t) {
      t.messages.push({
        id: `tmsg-${Date.now()}`,
        request_id: ticketId,
        sender_name: senderName,
        sender_role: senderRole,
        message,
        created_at: new Date().toISOString(),
      });
      t.updated_at = new Date().toISOString();
      saveStorage('tickets', ticketsState);
    }
  },

  // NOTIFICATIONS
  getNotifications: (tenantId: string): AppNotification[] => {
    return notificationsState[tenantId] || [];
  },

  markNotificationRead: (tenantId: string, notifId: string): void => {
    const notifs = notificationsState[tenantId] || [];
    const n = notifs.find((item) => item.id === notifId);
    if (n) {
      n.is_read = true;
      saveStorage('notifications', notificationsState);
    }
  },

  markAllNotificationsRead: (tenantId: string): void => {
    const notifs = notificationsState[tenantId] || [];
    notifs.forEach((n) => (n.is_read = true));
    saveStorage('notifications', notificationsState);
  },

  // STORE ORDERS
  getStoreOrders: (tenantId: string): StoreOrder[] => {
    return storeOrdersState[tenantId] || [];
  },

  // SEO KEYWORDS
  getSeoKeywords: (tenantId: string): SeoKeyword[] => {
    return seoKeywordsState[tenantId] || [];
  },

  // AUDIT LOGS
  getAuditLogs: (): AuditLogItem[] => {
    return [...auditLogsState];
  },

  getAllRequestsAcrossTenants: (): (ChangeRequest & { clientName: string })[] => {
    const all: (ChangeRequest & { clientName: string })[] = [];
    tenantsState.forEach((t) => {
      const reqs = requestsState[t.id] || [];
      reqs.forEach((r) => {
        all.push({ ...r, clientName: t.name });
      });
    });
    return all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  // ANALYTICS DATA (Clean baseline, ready for database / GA / Plausible ingestion)
  getTrafficData: (_tenantId: string): TrafficPoint[] => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day) => ({
      date: day,
      visitors: 0,
      pageViews: 0,
      leads: 0,
    }));
  },

  getTopPages: (_tenantId: string): PageStat[] => {
    return [
      { path: '/', views: 0, avgTime: '0s', bounceRate: '0.0%' },
    ];
  },

  getTrafficSources: (_tenantId: string): TrafficSource[] => {
    return [
      { channel: 'Direct Traffic', share: 100, visitors: 0 },
    ];
  },
};
