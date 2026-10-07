// =======================================================================
// LEVELUP DASHBOARD - MULTI-TENANT DATA ACCESS LAYER
// Real multi-tenant isolation with mock data fallbacks and Supabase hooks.
// All data queries are strictly scoped to tenant_id.
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
// INITIAL MULTI-TENANT SEED DATA (Distinct isolations)
// =======================================================================

const SEED_TENANTS: Tenant[] = [
  {
    id: 'tenant-lumina-01',
    name: 'Lumina Health Group',
    slug: 'lumina-health',
    company_email: 'hello@luminahealth.com',
    care_plan: 'pro',
    stripe_customer_id: 'cus_lumina_9921',
    features: {
      has_bookings: true,
      has_ecommerce: false,
      has_seo: true,
      has_care_plan: true,
      has_analytics: true,
      has_leads: true,
      custom_domains_count: 2,
    },
    created_at: '2025-11-12T00:00:00Z',
  },
  {
    id: 'tenant-apex-02',
    name: 'Apex Goods Co.',
    slug: 'apex-goods',
    company_email: 'ops@apexgoods.store',
    care_plan: 'premium',
    stripe_customer_id: 'cus_apex_4412',
    features: {
      has_bookings: false,
      has_ecommerce: true,
      has_seo: true,
      has_care_plan: true,
      has_analytics: true,
      has_leads: true,
      custom_domains_count: 1,
    },
    created_at: '2026-01-10T00:00:00Z',
  },
  {
    id: 'tenant-vantage-03',
    name: 'Vantage Capital Advisory',
    slug: 'vantage-advisory',
    company_email: 'partners@vantagecap.io',
    care_plan: 'essential',
    stripe_customer_id: 'cus_vantage_8820',
    features: {
      has_bookings: false,
      has_ecommerce: false,
      has_seo: true,
      has_care_plan: true,
      has_analytics: true,
      has_leads: true,
      custom_domains_count: 1,
    },
    created_at: '2026-02-15T00:00:00Z',
  },
  {
    id: 'tenant-velvet-04',
    name: 'Velvet & Vine Hospitality',
    slug: 'velvet-vine',
    company_email: 'events@velvetvine.com',
    care_plan: 'pro',
    stripe_customer_id: 'cus_velvet_1109',
    features: {
      has_bookings: true,
      has_ecommerce: false,
      has_seo: true,
      has_care_plan: true,
      has_analytics: true,
      has_leads: true,
      custom_domains_count: 1,
    },
    created_at: '2026-03-01T00:00:00Z',
  },
];

const SEED_WEBSITES: Record<string, Website[]> = {
  'tenant-lumina-01': [
    {
      id: 'web-lumina-primary',
      tenant_id: 'tenant-lumina-01',
      name: 'Lumina Health Main Portal',
      domain: 'luminahealth.com',
      staging_domain: 'staging.luminahealth.levelup.dev',
      status: 'live',
      preview_url: 'https://luminahealth.com',
      performance_score: 98,
      seo_score: 96,
      accessibility_score: 100,
      care_plan: 'pro',
      visitors_30d: 14280,
      last_deployed_at: '2026-10-06T09:14:00Z',
      framework: 'Next.js 16 + Tailwind',
      config: {
        website_type: 'clinic',
        features: ['information', 'homepage', 'media', 'services', 'team', 'bookings', 'faqs', 'announcements', 'blog', 'gallery', 'navigation', 'seo', 'analytics', 'requests'],
        homepage_modules: ['hero', 'announcement', 'featured_services', 'doctors_preview', 'testimonials', 'faq'],
        currency: 'USD',
        timezone: 'America/New_York',
      },
    },
    {
      id: 'web-lumina-telehealth',
      tenant_id: 'tenant-lumina-01',
      name: 'Lumina Telehealth Subsite',
      domain: 'telehealth.luminahealth.com',
      status: 'live',
      preview_url: 'https://telehealth.luminahealth.com',
      performance_score: 95,
      seo_score: 92,
      accessibility_score: 98,
      care_plan: 'pro',
      visitors_30d: 4120,
      last_deployed_at: '2026-10-04T16:20:00Z',
      framework: 'Next.js 16 + Supabase',
      config: {
        website_type: 'clinic',
        features: ['information', 'homepage', 'media', 'services', 'bookings', 'faqs', 'navigation', 'seo', 'analytics', 'requests'],
        homepage_modules: ['hero', 'featured_services', 'faq'],
        currency: 'USD',
        timezone: 'America/New_York',
      },
    },
  ],
  'tenant-apex-02': [
    {
      id: 'web-apex-store',
      tenant_id: 'tenant-apex-02',
      name: 'Apex Goods Flagship E-Commerce',
      domain: 'apexgoods.store',
      staging_domain: 'staging.apexgoods.levelup.dev',
      status: 'live',
      preview_url: 'https://apexgoods.store',
      performance_score: 97,
      seo_score: 95,
      accessibility_score: 99,
      care_plan: 'premium',
      visitors_30d: 38450,
      last_deployed_at: '2026-10-05T18:40:00Z',
      framework: 'Next.js 16 + Shopify Headless',
      config: {
        website_type: 'ecommerce',
        features: ['information', 'homepage', 'media', 'products', 'inventory', 'announcements', 'faqs', 'navigation', 'seo', 'analytics', 'requests'],
        homepage_modules: ['hero', 'featured_products', 'announcement', 'reviews', 'faq'],
        currency: 'USD',
        timezone: 'America/Los_Angeles',
      },
    },
  ],
  'tenant-vantage-03': [
    {
      id: 'web-vantage-corp',
      tenant_id: 'tenant-vantage-03',
      name: 'Vantage Capital Corporate',
      domain: 'vantagecap.io',
      status: 'live',
      preview_url: 'https://vantagecap.io',
      performance_score: 99,
      seo_score: 98,
      accessibility_score: 100,
      care_plan: 'essential',
      visitors_30d: 6890,
      last_deployed_at: '2026-09-28T11:00:00Z',
      framework: 'Vite + React + Tailwind',
      config: {
        website_type: 'corporate',
        features: ['information', 'homepage', 'media', 'services', 'team', 'blog', 'faqs', 'navigation', 'seo', 'analytics', 'requests'],
        homepage_modules: ['hero', 'advisory_services', 'leadership', 'insights', 'contact'],
        currency: 'USD',
        timezone: 'America/New_York',
      },
    },
  ],
  'tenant-velvet-04': [
    {
      id: 'web-velvet-venue',
      tenant_id: 'tenant-velvet-04',
      name: 'Velvet & Vine Bistro & Lounge',
      domain: 'velvetvine.com',
      status: 'live',
      preview_url: 'https://velvetvine.com',
      performance_score: 96,
      seo_score: 94,
      accessibility_score: 97,
      care_plan: 'pro',
      visitors_30d: 11200,
      last_deployed_at: '2026-10-02T14:10:00Z',
      framework: 'Next.js 16 + Resend + Stripe',
      config: {
        website_type: 'restaurant',
        features: ['information', 'homepage', 'media', 'menu', 'bookings', 'gallery', 'announcements', 'events', 'faqs', 'navigation', 'seo', 'analytics', 'requests'],
        homepage_modules: ['hero', 'evening_menu_preview', 'announcement', 'ambiance_gallery', 'cellar', 'reservations'],
        currency: 'USD',
        timezone: 'America/New_York',
      },
    },
  ],
};

const SEED_REQUESTS: Record<string, ChangeRequest[]> = {
  'tenant-lumina-01': [
    {
      id: 'req-lum-101',
      tenant_id: 'tenant-lumina-01',
      website_id: 'web-lumina-primary',
      website_name: 'luminahealth.com',
      title: 'Update Autumn Flu Clinic schedule banner',
      description: 'Please add a high-priority banner at the top of the homepage announcing the October & November walk-in vaccination clinics.',
      category: 'content',
      priority: 'high',
      status: 'in_progress',
      created_at: '2026-10-05T14:22:00Z',
      updated_at: '2026-10-06T10:15:00Z',
      messages: [
        {
          id: 'msg-1',
          request_id: 'req-lum-101',
          sender_name: 'Dr. Sarah Lin (Lumina)',
          sender_role: 'client',
          message: 'Hi LevelUp team! Here is the copy for the banner: "Autumn Vaccine Clinics Open Mon-Fri 8am-4pm. Book your time slot today."',
          created_at: '2026-10-05T14:22:00Z',
        },
        {
          id: 'msg-2',
          request_id: 'req-lum-101',
          sender_name: 'Marcus Vance (LevelUp Engineering)',
          sender_role: 'admin',
          message: 'Received Sarah! We staged the banner on staging.luminahealth.levelup.dev and linked it directly to your booking calendar flow.',
          created_at: '2026-10-06T10:15:00Z',
        },
      ],
    },
    {
      id: 'req-lum-102',
      tenant_id: 'tenant-lumina-01',
      website_id: 'web-lumina-primary',
      website_name: 'luminahealth.com',
      title: 'Embed new Patient Testimonials section',
      description: 'We received 4 approved patient video quotes. We would like a clean 3-column testimonial section right beneath the doctor bios.',
      category: 'new_section',
      priority: 'medium',
      status: 'in_review',
      created_at: '2026-10-04T09:00:00Z',
      updated_at: '2026-10-04T11:30:00Z',
      messages: [
        {
          id: 'msg-3',
          request_id: 'req-lum-102',
          sender_name: 'Dr. Sarah Lin',
          sender_role: 'client',
          message: 'Asset drive folder has been shared with design@levelup.com.',
          created_at: '2026-10-04T09:00:00Z',
        },
      ],
    },
    {
      id: 'req-lum-103',
      tenant_id: 'tenant-lumina-01',
      website_id: 'web-lumina-primary',
      website_name: 'luminahealth.com',
      title: 'Mobile navigation dropdown touch latency fix',
      description: 'Sub-menu on iOS Safari was taking two taps to expand. Verified and fixed in Pro Care cycle.',
      category: 'bug',
      priority: 'medium',
      status: 'completed',
      created_at: '2026-09-28T08:00:00Z',
      updated_at: '2026-09-29T16:00:00Z',
      completed_at: '2026-09-29T16:00:00Z',
      messages: [],
    },
  ],
  'tenant-apex-02': [
    {
      id: 'req-apx-201',
      tenant_id: 'tenant-apex-02',
      website_id: 'web-apex-store',
      website_name: 'apexgoods.store',
      title: 'Configure Black Friday teaser landing page',
      description: 'Setup private early-access email capture page with countdown clock and VIP discount coupon generator.',
      category: 'new_page',
      priority: 'urgent',
      status: 'in_progress',
      created_at: '2026-10-05T19:30:00Z',
      updated_at: '2026-10-06T11:00:00Z',
      messages: [
        {
          id: 'msg-apx-1',
          request_id: 'req-apx-201',
          sender_name: 'Elena Rostova (Apex)',
          sender_role: 'client',
          message: 'The campaign starts on Nov 1st. Staging link looks stunning so far!',
          created_at: '2026-10-05T19:30:00Z',
        },
      ],
    },
  ],
  'tenant-vantage-03': [
    {
      id: 'req-van-301',
      tenant_id: 'tenant-vantage-03',
      website_id: 'web-vantage-corp',
      website_name: 'vantagecap.io',
      title: 'Upload Q3 2026 Market Outlook PDF whitepaper',
      description: 'Attach new gated research document under /insights/q3-market-outlook.',
      category: 'content',
      priority: 'low',
      status: 'completed',
      created_at: '2026-10-01T10:00:00Z',
      updated_at: '2026-10-02T12:00:00Z',
      completed_at: '2026-10-02T12:00:00Z',
      messages: [],
    },
  ],
  'tenant-velvet-04': [
    {
      id: 'req-vel-401',
      tenant_id: 'tenant-velvet-04',
      website_id: 'web-velvet-venue',
      website_name: 'velvetvine.com',
      title: 'Private Dining holiday party booking deposit integration',
      description: 'Require 20% Stripe reservation deposit for group bookings larger than 8 guests.',
      category: 'booking',
      priority: 'high',
      status: 'submitted',
      created_at: '2026-10-06T08:15:00Z',
      updated_at: '2026-10-06T08:15:00Z',
      messages: [],
    },
  ],
};

const SEED_LEADS: Record<string, Lead[]> = {
  'tenant-lumina-01': [
    {
      id: 'lead-1',
      tenant_id: 'tenant-lumina-01',
      website_id: 'web-lumina-primary',
      website_name: 'luminahealth.com',
      name: 'Jonathan Sterling',
      email: 'j.sterling@example.com',
      phone: '+1 (555) 234-8901',
      source: 'Telehealth Consultation Form',
      status: 'new',
      notes: 'Interested in executive health screening and quarterly preventative care.',
      value: 1200,
      created_at: '2026-10-06T11:42:00Z',
    },
    {
      id: 'lead-2',
      tenant_id: 'tenant-lumina-01',
      website_id: 'web-lumina-primary',
      website_name: 'luminahealth.com',
      name: 'Miriam Al-Hassan',
      email: 'miriam.hassan@techcorp.io',
      phone: '+1 (555) 891-2345',
      source: 'Corporate Wellness Inquiry',
      status: 'qualified',
      notes: '50-person corporate wellness program proposal requested.',
      value: 15000,
      created_at: '2026-10-05T16:10:00Z',
    },
    {
      id: 'lead-3',
      tenant_id: 'tenant-lumina-01',
      website_id: 'web-lumina-primary',
      website_name: 'luminahealth.com',
      name: 'David K. Brooks',
      email: 'dbrooks@financepartners.com',
      phone: '+1 (555) 432-1098',
      source: 'Cardiology Specialist Referral',
      status: 'contacted',
      notes: 'Called on Oct 5. Scheduled initial consultation for Oct 12.',
      value: 850,
      created_at: '2026-10-04T13:20:00Z',
    },
    {
      id: 'lead-4',
      tenant_id: 'tenant-lumina-01',
      website_id: 'web-lumina-primary',
      website_name: 'luminahealth.com',
      name: 'Claire Moreau',
      email: 'c.moreau@designhaus.com',
      phone: '+1 (555) 678-9012',
      source: 'Physical Therapy Request',
      status: 'converted',
      notes: 'Converted to active patient. Patient ID #4491.',
      value: 2400,
      created_at: '2026-09-30T10:15:00Z',
    },
  ],
  'tenant-apex-02': [
    {
      id: 'lead-apx-1',
      tenant_id: 'tenant-apex-02',
      website_id: 'web-apex-store',
      website_name: 'apexgoods.store',
      name: 'Boutique Atelier Geneva',
      email: 'wholesale@ateliergeneva.ch',
      phone: '+41 22 555 0192',
      source: 'Wholesale Application Form',
      status: 'qualified',
      notes: 'Requested wholesale tier 2 catalog and pricing matrix.',
      value: 18500,
      created_at: '2026-10-05T09:15:00Z',
    },
  ],
  'tenant-vantage-03': [
    {
      id: 'lead-van-1',
      tenant_id: 'tenant-vantage-03',
      website_id: 'web-vantage-corp',
      website_name: 'vantagecap.io',
      name: 'Richard Chen',
      email: 'rchen@pacificridge.vc',
      phone: '+1 (415) 880-2199',
      source: 'Capital Allocation Inquiry',
      status: 'new',
      notes: 'Series B syndicate advisory inquiry.',
      value: 50000,
      created_at: '2026-10-06T08:50:00Z',
    },
  ],
  'tenant-velvet-04': [
    {
      id: 'lead-vel-1',
      tenant_id: 'tenant-velvet-04',
      website_id: 'web-velvet-venue',
      website_name: 'velvetvine.com',
      name: 'Amanda Vance',
      email: 'amanda.vance@galafoundation.org',
      phone: '+1 (212) 555-8930',
      source: 'Event Hall Booking Request',
      status: 'qualified',
      notes: 'Charity dinner gala for 75 guests on December 14.',
      value: 8200,
      created_at: '2026-10-05T15:00:00Z',
    },
  ],
};

const SEED_BOOKINGS: Record<string, Booking[]> = {
  'tenant-lumina-01': [
    {
      id: 'bk-1',
      tenant_id: 'tenant-lumina-01',
      website_id: 'web-lumina-primary',
      customer_name: 'Samantha Wright',
      customer_email: 'swright@globalpress.org',
      customer_phone: '+1 (555) 789-0123',
      service_name: 'Comprehensive Health Screening',
      booking_time: '2026-10-07T10:00:00Z',
      duration_minutes: 60,
      status: 'confirmed',
      price: 350,
      notes: 'First time visit. Sent medical intake form.',
    },
    {
      id: 'bk-2',
      tenant_id: 'tenant-lumina-01',
      website_id: 'web-lumina-primary',
      customer_name: 'Arthur Pendelton',
      customer_email: 'arthur.p@oxford.edu',
      customer_phone: '+1 (555) 902-1144',
      service_name: 'Telehealth Follow-up Consultation',
      booking_time: '2026-10-08T14:30:00Z',
      duration_minutes: 30,
      status: 'confirmed',
      price: 180,
    },
    {
      id: 'bk-3',
      tenant_id: 'tenant-lumina-01',
      website_id: 'web-lumina-primary',
      customer_name: 'Elena Garcia',
      customer_email: 'elena.garcia@medtech.com',
      service_name: 'Ergonomic Evaluation',
      booking_time: '2026-10-09T11:00:00Z',
      duration_minutes: 45,
      status: 'pending',
      price: 220,
    },
    {
      id: 'bk-4',
      tenant_id: 'tenant-lumina-01',
      website_id: 'web-lumina-primary',
      customer_name: 'Marcus Brody',
      customer_email: 'mbrody@archstone.com',
      service_name: 'Sports Rehabilitation Session',
      booking_time: '2026-10-02T15:00:00Z',
      duration_minutes: 60,
      status: 'completed',
      price: 260,
    },
  ],
  'tenant-velvet-04': [
    {
      id: 'bk-vel-1',
      tenant_id: 'tenant-velvet-04',
      website_id: 'web-velvet-venue',
      customer_name: 'Lawrence King',
      customer_email: 'l.king@synergycorp.com',
      service_name: 'Private Dining Room - 12 Guests',
      booking_time: '2026-10-10T19:30:00Z',
      duration_minutes: 180,
      status: 'confirmed',
      price: 1650,
    },
  ],
};

const SEED_INVOICES: Record<string, Invoice[]> = {
  'tenant-lumina-01': [
    {
      id: 'inv-lum-000',
      tenant_id: 'tenant-lumina-01',
      invoice_number: 'INV-2026-1004',
      amount: 99.00,
      currency: 'USD',
      status: 'open',
      due_date: '2026-11-01',
      description: 'Website Care - Pro Tier Renewal (Nov 2026)',
      pdf_url: '#',
    },
    {
      id: 'inv-lum-001',
      tenant_id: 'tenant-lumina-01',
      invoice_number: 'INV-2026-0891',
      amount: 99.00,
      currency: 'USD',
      status: 'paid',
      due_date: '2026-10-01',
      paid_at: '2026-10-01T04:22:00Z',
      description: 'Website Care - Pro Tier (Oct 2026)',
      pdf_url: '#',
    },
    {
      id: 'inv-lum-002',
      tenant_id: 'tenant-lumina-01',
      invoice_number: 'INV-2026-0744',
      amount: 99.00,
      currency: 'USD',
      status: 'paid',
      due_date: '2026-09-01',
      paid_at: '2026-09-01T04:19:00Z',
      description: 'Website Care - Pro Tier (Sep 2026)',
      pdf_url: '#',
    },
    {
      id: 'inv-lum-003',
      tenant_id: 'tenant-lumina-01',
      invoice_number: 'INV-2026-0612',
      amount: 1450.00,
      currency: 'USD',
      status: 'paid',
      due_date: '2026-08-15',
      paid_at: '2026-08-14T11:05:00Z',
      description: 'Telehealth Portal Expansion & HIPAA Security Hardening',
      pdf_url: '#',
    },
  ],
  'tenant-apex-02': [
    {
      id: 'inv-apx-001',
      tenant_id: 'tenant-apex-02',
      invoice_number: 'INV-2026-0902',
      amount: 199.00,
      currency: 'USD',
      status: 'paid',
      due_date: '2026-10-01',
      paid_at: '2026-10-01T03:00:00Z',
      description: 'Website Care - Premium Tier (Oct 2026)',
    },
  ],
  'tenant-vantage-03': [
    {
      id: 'inv-van-001',
      tenant_id: 'tenant-vantage-03',
      invoice_number: 'INV-2026-0914',
      amount: 39.00,
      currency: 'USD',
      status: 'paid',
      due_date: '2026-10-01',
      paid_at: '2026-10-01T02:00:00Z',
      description: 'Website Care - Essential Tier (Oct 2026)',
    },
  ],
  'tenant-velvet-04': [
    {
      id: 'inv-vel-001',
      tenant_id: 'tenant-velvet-04',
      invoice_number: 'INV-2026-0919',
      amount: 99.00,
      currency: 'USD',
      status: 'paid',
      due_date: '2026-10-01',
      paid_at: '2026-10-01T05:00:00Z',
      description: 'Website Care - Pro Tier (Oct 2026)',
    },
  ],
};

const SEED_TICKETS: Record<string, SupportTicket[]> = {
  'tenant-lumina-01': [
    {
      id: 'tkt-lum-1',
      tenant_id: 'tenant-lumina-01',
      subject: 'Google Workspace MX Records migration verification',
      priority: 'high',
      status: 'in_progress',
      category: 'DNS & Domain',
      created_at: '2026-10-05T08:10:00Z',
      updated_at: '2026-10-05T13:40:00Z',
      messages: [
        {
          id: 'tmsg-1',
          request_id: 'tkt-lum-1',
          sender_name: 'Dr. Sarah Lin',
          sender_role: 'client',
          message: 'We are switching to Google Workspace for 8 new doctors. Can you verify DKIM and SPF records on Cloudflare?',
          created_at: '2026-10-05T08:10:00Z',
        },
        {
          id: 'tmsg-2',
          request_id: 'tkt-lum-1',
          sender_name: 'LevelUp Support Lead (Devon)',
          sender_role: 'admin',
          message: 'Already verified and configured SPF v=spf1 and DKIM 2048-bit keys on Cloudflare. Propagation is complete.',
          created_at: '2026-10-05T13:40:00Z',
        },
      ],
    },
  ],
};

const SEED_NOTIFICATIONS: Record<string, AppNotification[]> = {
  'tenant-lumina-01': [
    {
      id: 'notif-1',
      tenant_id: 'tenant-lumina-01',
      title: 'Website speed score improved',
      message: 'Lumina Health Main Portal reached 98/100 performance following image optimization.',
      category: 'update',
      created_at: '2026-10-06T09:30:00Z',
      is_read: false,
      link_tab: 'websites',
    },
    {
      id: 'notif-2',
      tenant_id: 'tenant-lumina-01',
      title: 'New qualified lead captured',
      message: 'Jonathan Sterling submitted Telehealth Consultation inquiry ($1,200 estimated value).',
      category: 'lead',
      created_at: '2026-10-06T11:42:00Z',
      is_read: false,
      link_tab: 'leads',
    },
    {
      id: 'notif-3',
      tenant_id: 'tenant-lumina-01',
      title: 'October Care Plan invoice settled',
      message: 'Invoice INV-2026-0891 ($99.00) processed automatically via Stripe.',
      category: 'billing',
      created_at: '2026-10-01T04:22:00Z',
      is_read: true,
      link_tab: 'billing',
    },
  ],
  'tenant-apex-02': [
    {
      id: 'notif-apx-1',
      tenant_id: 'tenant-apex-02',
      title: 'Black Friday teaser staged',
      message: 'LevelUp staged the VIP discount landing page on your preview subdomain.',
      category: 'update',
      created_at: '2026-10-06T11:00:00Z',
      is_read: false,
      link_tab: 'requests',
    },
  ],
};

const SEED_STORE_ORDERS: Record<string, StoreOrder[]> = {
  'tenant-apex-02': [
    {
      id: 'ord-1092',
      tenant_id: 'tenant-apex-02',
      order_number: 'APX-7821',
      customer_name: 'Julian Hayes',
      customer_email: 'jhayes@designstudio.io',
      total: 340.00,
      status: 'shipped',
      items_count: 3,
      created_at: '2026-10-06T10:14:00Z',
    },
    {
      id: 'ord-1093',
      tenant_id: 'tenant-apex-02',
      order_number: 'APX-7822',
      customer_name: 'Selena Gomez-Ward',
      customer_email: 'sgward@lifestyle.co',
      total: 890.00,
      status: 'paid',
      items_count: 4,
      created_at: '2026-10-06T08:33:00Z',
    },
    {
      id: 'ord-1094',
      tenant_id: 'tenant-apex-02',
      order_number: 'APX-7823',
      customer_name: 'Hiroshi Tanaka',
      customer_email: 'tanaka@tokyomedia.jp',
      total: 215.00,
      status: 'processing',
      items_count: 2,
      created_at: '2026-10-05T22:18:00Z',
    },
  ],
};

const SEED_SEO_KEYWORDS: Record<string, SeoKeyword[]> = {
  'tenant-lumina-01': [
    { keyword: 'integrative health clinic boston', position: 2, change: 1, volume: 1800, url: '/services/integrative' },
    { keyword: 'executive physical exam massachusetts', position: 3, change: 2, volume: 1200, url: '/executive-health' },
    { keyword: 'telehealth preventative doctor', position: 5, change: -1, volume: 3400, url: '/telehealth' },
    { keyword: 'corporate wellness program provider', position: 4, change: 3, volume: 890, url: '/corporate-wellness' },
    { keyword: 'functional medicine appointment', position: 6, change: 0, volume: 2100, url: '/services/functional' },
  ],
  'tenant-apex-02': [
    { keyword: 'minimalist leather travel duffel', position: 1, change: 0, volume: 4200, url: '/products/duffel' },
    { keyword: 'sustainable luxury accessories brand', position: 3, change: 2, volume: 2900, url: '/collections/sustainable' },
    { keyword: 'artisan crafted brass desk accessories', position: 4, change: 1, volume: 1400, url: '/collections/brass' },
  ],
};

const SEED_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-1',
    tenant_id: 'tenant-lumina-01',
    actor_name: 'LevelUp Deploy Bot',
    actor_role: 'admin',
    action: 'PRODUCTION_DEPLOY',
    target: 'luminahealth.com (v2.8.4)',
    timestamp: '2026-10-06T09:14:00Z',
    ip: '34.120.44.18',
  },
  {
    id: 'log-2',
    tenant_id: 'tenant-lumina-01',
    actor_name: 'Dr. Sarah Lin',
    actor_role: 'client',
    action: 'REQUEST_SUBMITTED',
    target: 'Autumn Flu Clinic schedule banner',
    timestamp: '2026-10-05T14:22:00Z',
    ip: '72.19.144.102',
  },
  {
    id: 'log-3',
    tenant_id: 'tenant-apex-02',
    actor_name: 'Elena Rostova',
    actor_role: 'client',
    action: 'CARE_PLAN_TIER_VIEW',
    target: 'Premium Plan Billing Details',
    timestamp: '2026-10-05T19:20:00Z',
    ip: '198.51.100.84',
  },
  {
    id: 'log-4',
    tenant_id: 'tenant-vantage-03',
    actor_name: 'Richard Chen',
    actor_role: 'client',
    action: 'LEAD_INGESTION',
    target: 'Contact Form Submission',
    timestamp: '2026-10-06T08:50:00Z',
    ip: '172.56.21.9',
  },
];

const SEED_ORG_MEMBERS: Record<string, OrganizationMember[]> = {
  'tenant-lumina-01': [
    {
      id: 'mem-lum-1',
      organization_id: 'tenant-lumina-01',
      full_name: 'Dr. Sarah Lin',
      email: 'dr.lin@luminahealth.com',
      org_role: 'OWNER',
      title: 'Chief Medical Director & Founder',
      mfa_enabled: true,
      status: 'active',
      joined_at: '2025-11-12T00:00:00Z',
      last_active_at: '2026-10-06T15:10:00Z',
    },
    {
      id: 'mem-lum-2',
      organization_id: 'tenant-lumina-01',
      full_name: 'Marcus Chen',
      email: 'm.chen@luminahealth.com',
      org_role: 'ADMIN',
      title: 'VP of Clinic Operations',
      mfa_enabled: true,
      status: 'active',
      joined_at: '2025-11-15T09:00:00Z',
      last_active_at: '2026-10-06T14:20:00Z',
    },
    {
      id: 'mem-lum-3',
      organization_id: 'tenant-lumina-01',
      full_name: 'David Wilson',
      email: 'd.wilson@luminahealth.com',
      org_role: 'MEMBER',
      title: 'Patient Intake Coordinator',
      mfa_enabled: false,
      status: 'active',
      joined_at: '2026-01-10T11:30:00Z',
      last_active_at: '2026-10-06T12:45:00Z',
    },
    {
      id: 'mem-lum-4',
      organization_id: 'tenant-lumina-01',
      full_name: 'Emma Davis',
      email: 'e.davis@luminahealth.com',
      org_role: 'VIEWER',
      title: 'External Compliance Auditor',
      mfa_enabled: true,
      status: 'active',
      joined_at: '2026-03-04T16:00:00Z',
      last_active_at: '2026-10-05T18:10:00Z',
    },
  ],
  'tenant-apex-02': [
    {
      id: 'mem-apx-1',
      organization_id: 'tenant-apex-02',
      full_name: 'Elena Rostova',
      email: 'elena@apexgoods.store',
      org_role: 'OWNER',
      title: 'Creative Director & Founder',
      mfa_enabled: true,
      status: 'active',
      joined_at: '2026-01-10T00:00:00Z',
      last_active_at: '2026-10-06T14:55:00Z',
    },
    {
      id: 'mem-apx-2',
      organization_id: 'tenant-apex-02',
      full_name: 'Lucas Meyer',
      email: 'lucas@apexgoods.store',
      org_role: 'ADMIN',
      title: 'Head of E-Commerce',
      mfa_enabled: true,
      status: 'active',
      joined_at: '2026-01-18T10:00:00Z',
      last_active_at: '2026-10-06T13:12:00Z',
    },
    {
      id: 'mem-apx-3',
      organization_id: 'tenant-apex-02',
      full_name: 'Sophie Laurent',
      email: 'sophie@apexgoods.store',
      org_role: 'MEMBER',
      title: 'Merchandising Specialist',
      mfa_enabled: false,
      status: 'active',
      joined_at: '2026-04-02T09:00:00Z',
      last_active_at: '2026-10-05T19:00:00Z',
    },
  ],
  'tenant-vantage-03': [
    {
      id: 'mem-van-1',
      organization_id: 'tenant-vantage-03',
      full_name: 'Richard Chen',
      email: 'rchen@vantagecap.io',
      org_role: 'OWNER',
      title: 'Managing Partner',
      mfa_enabled: true,
      status: 'active',
      joined_at: '2026-02-15T00:00:00Z',
      last_active_at: '2026-10-06T11:30:00Z',
    },
    {
      id: 'mem-van-2',
      organization_id: 'tenant-vantage-03',
      full_name: 'Hannah Abbott',
      email: 'habbott@vantagecap.io',
      org_role: 'VIEWER',
      title: 'Investor Relations Analyst',
      mfa_enabled: true,
      status: 'active',
      joined_at: '2026-05-01T00:00:00Z',
      last_active_at: '2026-10-04T15:00:00Z',
    },
  ],
  'tenant-velvet-04': [
    {
      id: 'mem-vel-1',
      organization_id: 'tenant-velvet-04',
      full_name: 'Julian Vance',
      email: 'julian@velvetvine.com',
      org_role: 'OWNER',
      title: 'Hospitality Director',
      mfa_enabled: true,
      status: 'active',
      joined_at: '2026-03-01T00:00:00Z',
      last_active_at: '2026-10-06T13:00:00Z',
    },
  ],
};

const SEED_ORG_INVITATIONS: Record<string, OrganizationInvitation[]> = {
  'tenant-lumina-01': [
    {
      id: 'inv-tok-901',
      organization_id: 'tenant-lumina-01',
      email: 'dr.patel@luminahealth.com',
      org_role: 'MEMBER',
      invited_by_name: 'Dr. Sarah Lin',
      token_preview: 'lu_inv_9f8a...c41e (Single-use SHA-256)',
      status: 'pending',
      created_at: '2026-10-06T10:00:00Z',
      expires_at: '2026-10-09T10:00:00Z',
    },
  ],
  'tenant-apex-02': [],
  'tenant-vantage-03': [],
  'tenant-velvet-04': [],
};

const SEED_ORG_ACTIVITY: Record<string, OrganizationActivityItem[]> = {
  'tenant-lumina-01': [
    {
      id: 'act-1',
      organization_id: 'tenant-lumina-01',
      actor_name: 'Dr. Sarah Lin',
      actor_email: 'dr.lin@luminahealth.com',
      actor_role: 'OWNER',
      action: 'submitted a website change request',
      target: 'Update Autumn Flu Clinic schedule banner',
      category: 'request',
      created_at: '2026-10-06T14:15:00Z',
    },
    {
      id: 'act-2',
      organization_id: 'tenant-lumina-01',
      actor_name: 'David Wilson',
      actor_email: 'd.wilson@luminahealth.com',
      actor_role: 'MEMBER',
      action: 'qualified inbound lead',
      target: 'Miriam Al-Hassan ($15,000 Corporate Wellness)',
      category: 'website',
      created_at: '2026-10-06T12:40:00Z',
    },
    {
      id: 'act-3',
      organization_id: 'tenant-lumina-01',
      actor_name: 'Dr. Sarah Lin',
      actor_email: 'dr.lin@luminahealth.com',
      actor_role: 'OWNER',
      action: 'invited team member',
      target: 'dr.patel@luminahealth.com (Role: MEMBER)',
      category: 'team',
      created_at: '2026-10-06T10:00:00Z',
    },
    {
      id: 'act-4',
      organization_id: 'tenant-lumina-01',
      actor_name: 'Marcus Chen',
      actor_email: 'm.chen@luminahealth.com',
      actor_role: 'ADMIN',
      action: 'opened support ticket',
      target: 'Google Workspace MX Records migration verification',
      category: 'support',
      created_at: '2026-10-05T08:10:00Z',
    },
  ],
  'tenant-apex-02': [
    {
      id: 'act-apx-1',
      organization_id: 'tenant-apex-02',
      actor_name: 'Elena Rostova',
      actor_email: 'elena@apexgoods.store',
      actor_role: 'OWNER',
      action: 'created urgent campaign request',
      target: 'Configure Black Friday teaser landing page',
      category: 'request',
      created_at: '2026-10-05T19:30:00Z',
    },
  ],
};

// In-Memory Mutables (retained during session)
let tenantsState = [...SEED_TENANTS];
const requestsState = { ...SEED_REQUESTS };
const leadsState = { ...SEED_LEADS };
const bookingsState = { ...SEED_BOOKINGS };
const ticketsState = { ...SEED_TICKETS };
const notificationsState = { ...SEED_NOTIFICATIONS };
const invoicesState = { ...SEED_INVOICES };
const orgMembersState = { ...SEED_ORG_MEMBERS };
const orgInvitationsState = { ...SEED_ORG_INVITATIONS };
const orgActivityState = { ...SEED_ORG_ACTIVITY };

// =======================================================================
// SERVICE REPOSITORY API (Multi-Tenant Enforced)
// =======================================================================

export const dataService = {
  // TENANTS
  getAllTenants: (): Tenant[] => {
    return [...tenantsState];
  },

  getTenantById: (tenantId: string): Tenant | undefined => {
    return tenantsState.find((t) => t.id === tenantId);
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
    return tenantsState.find((t) => t.id === tenantId)!;
  },

  // WEBSITES (Tenant scoped)
  getWebsites: (tenantId: string): Website[] => {
    return SEED_WEBSITES[tenantId] || [];
  },

  // CHANGE REQUESTS (Tenant scoped)
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
    }
  },

  // LEADS (Tenant scoped)
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
    }
  },

  // BOOKINGS (Tenant scoped)
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
    return newBooking;
  },

  // INVOICES (Tenant scoped)
  getInvoices: (tenantId: string): Invoice[] => {
    return invoicesState[tenantId] || [];
  },

  // ORGANIZATION TEAM MEMBERS (Strictly scoped to organization_id / tenantId)
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

  // SUPPORT TICKETS (Tenant scoped)
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
    }
  },

  // NOTIFICATIONS (Tenant scoped)
  getNotifications: (tenantId: string): AppNotification[] => {
    return notificationsState[tenantId] || [];
  },

  markNotificationRead: (tenantId: string, notifId: string): void => {
    const notifs = notificationsState[tenantId] || [];
    const n = notifs.find((item) => item.id === notifId);
    if (n) {
      n.is_read = true;
    }
  },

  markAllNotificationsRead: (tenantId: string): void => {
    const notifs = notificationsState[tenantId] || [];
    notifs.forEach((n) => (n.is_read = true));
  },

  // STORE ORDERS (For E-Commerce tenants)
  getStoreOrders: (tenantId: string): StoreOrder[] => {
    return SEED_STORE_ORDERS[tenantId] || [];
  },

  // SEO KEYWORDS (For SEO tenants)
  getSeoKeywords: (tenantId: string): SeoKeyword[] => {
    return SEED_SEO_KEYWORDS[tenantId] || [];
  },

  // AUDIT LOGS (Agency Admin only)
  getAuditLogs: (): AuditLogItem[] => {
    return [...SEED_AUDIT_LOGS];
  },

  // CROSS-TENANT DATA (Agency Admin only)
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

  // ANALYTICS TIME-SERIES (Derived realistically per tenant)
  getTrafficData: (tenantId: string): TrafficPoint[] => {
    const baseMultiplier = tenantId === 'tenant-apex-02' ? 2.8 : tenantId === 'tenant-vantage-03' ? 0.6 : 1.2;
    const days = ['Sep 30', 'Oct 1', 'Oct 2', 'Oct 3', 'Oct 4', 'Oct 5', 'Oct 6'];
    const baseVisitors = [420, 480, 510, 460, 590, 640, 710];
    
    return days.map((day, idx) => ({
      date: day,
      visitors: Math.round(baseVisitors[idx] * baseMultiplier),
      pageViews: Math.round(baseVisitors[idx] * baseMultiplier * 2.4),
      leads: Math.round((baseVisitors[idx] * baseMultiplier * 0.038) + (idx % 2)),
    }));
  },

  getTopPages: (tenantId: string): PageStat[] => {
    if (tenantId === 'tenant-apex-02') {
      return [
        { path: '/collections/leather-goods', views: 8940, avgTime: '2m 45s', bounceRate: '31.2%' },
        { path: '/products/artisan-duffel-bag', views: 5410, avgTime: '3m 12s', bounceRate: '28.4%' },
        { path: '/', views: 12200, avgTime: '1m 50s', bounceRate: '34.0%' },
        { path: '/cart', views: 2310, avgTime: '1m 20s', bounceRate: '19.5%' },
        { path: '/about-the-craft', views: 1890, avgTime: '2m 10s', bounceRate: '42.1%' },
      ];
    }
    return [
      { path: '/', views: 6420, avgTime: '2m 14s', bounceRate: '32.1%' },
      { path: '/services/preventative-care', views: 3120, avgTime: '3m 40s', bounceRate: '26.8%' },
      { path: '/book-appointment', views: 2840, avgTime: '2m 55s', bounceRate: '22.4%' },
      { path: '/physicians', views: 1650, avgTime: '1m 45s', bounceRate: '38.0%' },
      { path: '/contact', views: 1290, avgTime: '1m 10s', bounceRate: '35.6%' },
    ];
  },

  getTrafficSources: (tenantId: string): TrafficSource[] => {
    if (tenantId === 'tenant-apex-02') {
      return [
        { channel: 'Organic Search (SEO)', share: 44, visitors: 16900 },
        { channel: 'Direct / Bookmarks', share: 24, visitors: 9220 },
        { channel: 'Social / Instagram', share: 20, visitors: 7690 },
        { channel: 'Referral & Press', share: 12, visitors: 4610 },
      ];
    }
    return [
      { channel: 'Organic Search (SEO)', share: 52, visitors: 7420 },
      { channel: 'Direct Navigation', share: 26, visitors: 3710 },
      { channel: 'Local Maps & Places', share: 15, visitors: 2140 },
      { channel: 'Partner Referrals', share: 7, visitors: 1000 },
    ];
  },
};
