// =======================================================================
// LEVELUP DASHBOARD - TYPE SYSTEM & DOMAIN DEFINITIONS
// Client-Only Multi-Tenant Organization Architecture
// =======================================================================

export type OrganizationRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

// Legacy alias kept for message sender tagging ('client' vs LevelUp support staff 'support_engineer')
export type UserRole = 'client' | 'admin' | 'super_admin';

export type Permission =
  | 'organization.view'
  | 'organization.update'
  | 'organization.delete'
  | 'team.view'
  | 'team.invite'
  | 'team.update'
  | 'team.remove'
  | 'website.view'
  | 'website.update'
  | 'website.delete'
  | 'analytics.view'
  | 'leads.view'
  | 'leads.manage'
  | 'bookings.view'
  | 'bookings.manage'
  | 'requests.create'
  | 'requests.view'
  | 'requests.manage'
  | 'billing.view'
  | 'billing.manage'
  | 'support.create'
  | 'support.view';

export type CarePlanTier = 'none' | 'essential' | 'pro' | 'premium';

export type WebsiteType =
  | 'restaurant'
  | 'clinic'
  | 'ecommerce'
  | 'corporate'
  | 'portfolio'
  | 'event';

export type WebsiteFeature =
  | 'information'
  | 'homepage'
  | 'media'
  | 'services'
  | 'menu'
  | 'products'
  | 'bookings'
  | 'team'
  | 'gallery'
  | 'announcements'
  | 'events'
  | 'blog'
  | 'faqs'
  | 'navigation'
  | 'seo'
  | 'analytics'
  | 'requests'
  | 'inventory'
  | 'discounts';

export type ContentStatus = 'published' | 'draft' | 'archived';

export interface WebsiteConfig {
  website_type: WebsiteType;
  features: WebsiteFeature[];
  homepage_modules: string[];
  currency: string;
  timezone: string;
}

export interface DayHours {
  open: string;
  close: string;
  is_closed: boolean;
}

export interface WebsiteInformation {
  website_id: string;
  business_name: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  opening_hours: Record<string, DayHours>;
  social_links: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    google_maps?: string;
  };
  logo_url: string;
  favicon_url: string;
  seo_title: string;
  seo_description: string;
  og_image_url: string;
  updated_at: string;
  updated_by: string;
}

export interface HomepageContent {
  website_id: string;
  hero_badge: string;
  hero_headline: string;
  hero_description: string;
  primary_cta_label: string;
  primary_cta_link: string;
  secondary_cta_label: string;
  secondary_cta_link: string;
  hero_image_url: string;
  announcement_banner_active: boolean;
  announcement_banner_text: string;
  featured_services_enabled: boolean;
  featured_products_enabled: boolean;
  testimonials_enabled: boolean;
  gallery_preview_enabled: boolean;
  faq_section_enabled: boolean;
  updated_at: string;
  updated_by: string;
}

export interface MediaItem {
  id: string;
  website_id: string;
  organization_id: string;
  name: string;
  url: string;
  category: 'heroes' | 'gallery' | 'services' | 'products' | 'team' | 'brand';
  size_kb: number;
  mime_type: string;
  alt_text: string;
  caption?: string;
  created_at: string;
  created_by: string;
}

export interface WebsiteService {
  id: string;
  website_id: string;
  organization_id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  duration_minutes: number;
  image_url?: string;
  is_booking_enabled: boolean;
  is_featured: boolean;
  status: ContentStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface WebsiteMenuCategory {
  id: string;
  website_id: string;
  name: string;
  description?: string;
  sort_order: number;
}

export interface WebsiteMenuItem {
  id: string;
  website_id: string;
  organization_id: string;
  category_id: string;
  category_name: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  dietary: ('vegetarian' | 'vegan' | 'gluten_free' | 'chef_special')[];
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
  status: ContentStatus;
  updated_at: string;
}

export interface WebsiteProduct {
  id: string;
  website_id: string;
  organization_id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  description: string;
  price: number;
  compare_at_price?: number;
  inventory_count: number;
  track_inventory: boolean;
  low_stock_threshold: number;
  image_url: string;
  is_featured: boolean;
  status: ContentStatus;
  variants_count?: number;
  updated_at: string;
}

export interface WebsiteTeamMember {
  id: string;
  website_id: string;
  organization_id: string;
  name: string;
  role: string;
  bio: string;
  photo_url: string;
  email?: string;
  phone?: string;
  specialties: string[];
  sort_order: number;
  status: ContentStatus;
  updated_at: string;
}

export interface WebsiteGalleryItem {
  id: string;
  website_id: string;
  organization_id: string;
  title: string;
  image_url: string;
  category: string;
  caption?: string;
  alt_text: string;
  sort_order: number;
  status: ContentStatus;
  updated_at: string;
}

export interface WebsiteAnnouncement {
  id: string;
  website_id: string;
  organization_id: string;
  title: string;
  message: string;
  badge_label: string;
  badge_type: 'notice' | 'offer' | 'update' | 'alert';
  link_url?: string;
  link_label?: string;
  starts_at?: string;
  ends_at?: string;
  status: ContentStatus;
  updated_at: string;
}

export interface WebsiteEvent {
  id: string;
  website_id: string;
  organization_id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  time: string;
  location: string;
  cover_image: string;
  rsvp_url?: string;
  ticket_url?: string;
  capacity?: number;
  rsvp_count: number;
  status: ContentStatus;
  updated_at: string;
}

export interface WebsiteBlogPost {
  id: string;
  website_id: string;
  organization_id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author_name: string;
  author_avatar?: string;
  category: string;
  tags: string[];
  read_time_minutes: number;
  seo_title: string;
  seo_description: string;
  status: ContentStatus;
  published_at: string;
  updated_at: string;
}

export interface WebsiteFaq {
  id: string;
  website_id: string;
  organization_id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  status: ContentStatus;
  updated_at: string;
}

export interface WebsiteNavItem {
  id: string;
  website_id: string;
  label: string;
  path: string;
  is_external: boolean;
  sort_order: number;
  location: 'header' | 'footer' | 'both';
  status: ContentStatus;
}

export interface WebsiteReview {
  id: string;
  website_id: string;
  author_name: string;
  author_title?: string;
  rating: number;
  quote: string;
  avatar_url?: string;
  source: 'google' | 'trustpilot' | 'direct';
  is_featured: boolean;
  status: ContentStatus;
  created_at: string;
}

export interface QuickActionItem {
  id: string;
  label: string;
  action_tab: string;
  sub_tab?: string;
  icon: string;
  description: string;
}

export interface PrioritizedAttentionItem {
  id: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  action_tab: string;
  sub_tab?: string;
  action_label: string;
}

export interface DashboardNavTab {
  id: string;
  title: string;
  icon: string;
  badge?: string | number;
  badgeColor?: string;
}

export interface DashboardNavGroup {
  label: string;
  items: DashboardNavTab[];
}

export interface DashboardEngineConfig {
  websiteType: WebsiteType;
  businessCategoryName: string;
  navGroups: DashboardNavGroup[];
  quickActions: QuickActionItem[];
  priorities: PrioritizedAttentionItem[];
  overviewMetrics: {
    key: string;
    label: string;
    value: string | number;
    change?: string;
    subtext?: string;
    isPositive?: boolean;
  }[];
}

export interface TenantFeatures {
  has_bookings: boolean;
  has_ecommerce: boolean;
  has_seo: boolean;
  has_care_plan: boolean;
  has_analytics: boolean;
  has_leads: boolean;
  custom_domains_count: number;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  company_email: string;
  logo_url?: string;
  care_plan: CarePlanTier;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  subscription_status?: 'active' | 'past_due' | 'canceled' | 'trialing';
  features: TenantFeatures;
  created_at: string;
}

export interface UserProfile {
  id: string;
  tenant_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  org_role: OrganizationRole;
  mfa_enabled?: boolean;
  avatar_url?: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  full_name: string;
  email: string;
  org_role: OrganizationRole;
  title?: string;
  mfa_enabled: boolean;
  status: 'active' | 'suspended';
  joined_at: string;
  last_active_at: string;
}

export interface OrganizationInvitation {
  id: string;
  organization_id: string;
  email: string;
  org_role: OrganizationRole;
  invited_by_name: string;
  token_preview: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  created_at: string;
  expires_at: string;
}

export interface OrganizationActivityItem {
  id: string;
  organization_id: string;
  actor_name: string;
  actor_email: string;
  actor_role: OrganizationRole;
  action: string;
  target: string;
  category: 'team' | 'website' | 'request' | 'billing' | 'security' | 'support';
  created_at: string;
}

export interface Website {
  id: string;
  tenant_id: string;
  name: string;
  domain: string;
  staging_domain?: string;
  status: 'live' | 'building' | 'maintenance' | 'offline';
  preview_url: string;
  performance_score: number;
  seo_score: number;
  accessibility_score: number;
  care_plan: CarePlanTier;
  visitors_30d: number;
  last_deployed_at: string;
  framework: string;
  config?: WebsiteConfig;
}

export type RequestStatus = 
  | 'submitted' 
  | 'in_review' 
  | 'in_progress' 
  | 'waiting_for_client' 
  | 'completed';

export type RequestPriority = 'low' | 'medium' | 'high' | 'urgent';

export type RequestCategory = 
  | 'content' 
  | 'design' 
  | 'new_section' 
  | 'new_page' 
  | 'bug' 
  | 'seo' 
  | 'booking' 
  | 'ecommerce' 
  | 'general';

export interface RequestMessage {
  id: string;
  request_id: string;
  sender_name: string;
  sender_role: UserRole;
  message: string;
  created_at: string;
  attachments?: string[];
}

export interface ChangeRequest {
  id: string;
  tenant_id: string;
  website_id: string;
  website_name: string;
  title: string;
  description: string;
  category: RequestCategory;
  priority: RequestPriority;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  messages: RequestMessage[];
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

export interface Lead {
  id: string;
  tenant_id: string;
  website_id: string;
  website_name: string;
  name: string;
  email: string;
  phone?: string;
  source: string;
  status: LeadStatus;
  notes?: string;
  value?: number;
  created_at: string;
}

export type BookingStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  tenant_id: string;
  website_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  service_name: string;
  booking_time: string;
  duration_minutes: number;
  status: BookingStatus;
  price: number;
  notes?: string;
}

export type InvoiceStatus = 'paid' | 'open' | 'overdue' | 'void';

export interface Invoice {
  id: string;
  tenant_id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  due_date: string;
  paid_at?: string;
  description: string;
  pdf_url?: string;
}

export type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved';

export interface SupportTicket {
  id: string;
  tenant_id: string;
  subject: string;
  priority: RequestPriority;
  status: TicketStatus;
  category: string;
  created_at: string;
  updated_at: string;
  messages: RequestMessage[];
}

export interface AppNotification {
  id: string;
  tenant_id: string;
  title: string;
  message: string;
  category: 'update' | 'lead' | 'booking' | 'billing' | 'system';
  created_at: string;
  is_read: boolean;
  link_tab?: string;
}

export interface AnalyticsMetric {
  visitors: number;
  sessions: number;
  page_views: number;
  bounce_rate: string;
  avg_duration: string;
  conversion_rate: string;
  leads_count: number;
}

export interface TrafficPoint {
  date: string;
  visitors: number;
  pageViews: number;
  leads: number;
}

export interface PageStat {
  path: string;
  views: number;
  avgTime: string;
  bounceRate: string;
}

export interface TrafficSource {
  channel: string;
  share: number;
  visitors: number;
}

// For E-Commerce enabled clients
export interface StoreOrder {
  id: string;
  tenant_id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: 'paid' | 'processing' | 'shipped' | 'refunded';
  items_count: number;
  created_at: string;
}

// For SEO enabled clients
export interface SeoKeyword {
  keyword: string;
  position: number;
  change: number; // e.g. +3 or -1
  volume: number;
  url: string;
}

export interface AuditLogItem {
  id: string;
  tenant_id: string;
  actor_name: string;
  actor_role: UserRole;
  action: string;
  target: string;
  timestamp: string;
  ip: string;
}
