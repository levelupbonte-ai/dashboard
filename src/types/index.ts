// =======================================================================
// LEVELUP DASHBOARD - TYPE SYSTEM & DOMAIN DEFINITIONS
// =======================================================================

export type UserRole = 'client' | 'admin' | 'super_admin';

export type CarePlanTier = 'none' | 'essential' | 'pro' | 'premium';

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
  features: TenantFeatures;
  created_at: string;
}

export interface UserProfile {
  id: string;
  tenant_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
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
