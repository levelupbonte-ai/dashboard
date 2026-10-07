-- =======================================================================
-- LEVELUP ECOSYSTEM DASHBOARD - PRODUCTION POSTGRESQL & SUPABASE SCHEMA
-- Multi-Tenant Database Architecture with Row Level Security (RLS)
-- =======================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE organization_role AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'VIEWER');
CREATE TYPE user_role AS ENUM ('client', 'admin', 'super_admin');
CREATE TYPE request_status AS ENUM ('submitted', 'in_review', 'in_progress', 'waiting_for_client', 'completed');
CREATE TYPE request_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE request_category AS ENUM ('content', 'design', 'bug', 'feature', 'seo', 'booking', 'ecommerce', 'care');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'lost');
CREATE TYPE booking_status AS ENUM ('confirmed', 'pending', 'completed', 'cancelled');
CREATE TYPE care_plan_tier AS ENUM ('none', 'essential', 'pro', 'premium');
CREATE TYPE invoice_status AS ENUM ('draft', 'open', 'paid', 'uncollectible', 'void');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'waiting', 'resolved');

-- 2. ORGANIZATIONS / TENANTS TABLE (Primary Tenant Boundary)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    company_email TEXT NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    care_plan care_plan_tier DEFAULT 'pro',
    stripe_customer_id TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- 3. PROFILES TABLE (Linked to auth.users in Supabase)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role user_role DEFAULT 'client',
    org_role organization_role DEFAULT 'MEMBER',
    mfa_enabled BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- 3B. ORGANIZATION MEMBERS TABLE (Multi-user organization membership + role)
CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    org_role organization_role NOT NULL DEFAULT 'MEMBER',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (organization_id, user_id)
);

-- 3C. ORGANIZATION INVITATIONS TABLE (Single-use, expiring, org-bound tokens)
CREATE TABLE organization_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    org_role organization_role NOT NULL DEFAULT 'MEMBER',
    token_hash TEXT UNIQUE NOT NULL,
    invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, expired, revoked
    expires_at TIMESTAMPTZ NOT NULL,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3D. SUBSCRIPTIONS TABLE (Organization-scoped Stripe billing; NO raw card storage)
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE UNIQUE,
    stripe_customer_id TEXT NOT NULL,
    stripe_subscription_id TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    plan_id care_plan_tier NOT NULL DEFAULT 'pro',
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. WEBSITES TABLE (One tenant can have multiple websites)
CREATE TABLE websites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    domain TEXT NOT NULL,
    staging_domain TEXT,
    status TEXT DEFAULT 'live', -- live, building, maintenance, suspended
    preview_url TEXT,
    performance_score INTEGER DEFAULT 96,
    seo_score INTEGER DEFAULT 94,
    accessibility_score INTEGER DEFAULT 98,
    care_plan care_plan_tier DEFAULT 'pro',
    visitors_30d INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. WEBSITE FEATURES & ENTITLEMENTS TABLE
CREATE TABLE website_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE UNIQUE,
    has_bookings BOOLEAN DEFAULT FALSE,
    has_ecommerce BOOLEAN DEFAULT FALSE,
    has_seo BOOLEAN DEFAULT TRUE,
    has_care_plan BOOLEAN DEFAULT TRUE,
    has_analytics BOOLEAN DEFAULT TRUE,
    has_leads BOOLEAN DEFAULT TRUE,
    custom_domains_count INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CHANGE REQUESTS TABLE
CREATE TABLE change_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    website_id UUID REFERENCES websites(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category request_category DEFAULT 'content',
    priority request_priority DEFAULT 'medium',
    status request_status DEFAULT 'submitted',
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 7. REQUEST MESSAGES TABLE
CREATE TABLE request_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES change_requests(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    sender_role user_role DEFAULT 'client',
    message TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. LEADS TABLE (Inbound captures from client websites)
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    website_id UUID REFERENCES websites(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    source TEXT DEFAULT 'Contact Form',
    status lead_status DEFAULT 'new',
    notes TEXT,
    value NUMERIC(10,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. BOOKINGS TABLE (For clients with appointment / booking system)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    website_id UUID REFERENCES websites(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    service_name TEXT NOT NULL,
    booking_time TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status booking_status DEFAULT 'confirmed',
    notes TEXT,
    price NUMERIC(10,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. BILLING & INVOICES TABLE (Stripe-ready ledger)
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status invoice_status DEFAULT 'paid',
    due_date DATE NOT NULL,
    paid_at TIMESTAMPTZ,
    pdf_url TEXT,
    stripe_invoice_id TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. SUPPORT TICKETS TABLE
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    priority request_priority DEFAULT 'medium',
    status ticket_status DEFAULT 'open',
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. SUPPORT MESSAGES TABLE
CREATE TABLE support_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    sender_role user_role DEFAULT 'client',
    message TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    category TEXT DEFAULT 'system', -- updates, leads, billing, system
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. AUDIT LOGS TABLE
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    ip_address TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Multi-Tenant Isolation: A client can only query their own tenant data.
-- Admin/SuperAdmin can manage across all tenants.
-- =======================================================================

-- Helper function to get current user's tenant_id and role
CREATE OR REPLACE FUNCTION get_auth_tenant_id()
RETURNS UUID AS $$
BEGIN
    RETURN (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::UUID;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin_or_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tenant-owned tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Tenants Policies
CREATE POLICY "Tenants: Client read own, Admin read all" ON tenants
    FOR SELECT USING (id = get_auth_tenant_id() OR is_admin_or_superadmin());

CREATE POLICY "Tenants: Admin manage all" ON tenants
    FOR ALL USING (is_admin_or_superadmin());

-- Websites Policies
CREATE POLICY "Websites: Scoped to tenant or admin" ON websites
    FOR ALL USING (tenant_id = get_auth_tenant_id() OR is_admin_or_superadmin());

-- Features Policies
CREATE POLICY "Features: Scoped to tenant or admin" ON website_features
    FOR SELECT USING (tenant_id = get_auth_tenant_id() OR is_admin_or_superadmin());

CREATE POLICY "Features: Admin update" ON website_features
    FOR ALL USING (is_admin_or_superadmin());

-- Change Requests Policies
CREATE POLICY "Change Requests: Scoped to tenant or admin" ON change_requests
    FOR ALL USING (tenant_id = get_auth_tenant_id() OR is_admin_or_superadmin());

-- Leads Policies
CREATE POLICY "Leads: Scoped to tenant or admin" ON leads
    FOR ALL USING (tenant_id = get_auth_tenant_id() OR is_admin_or_superadmin());

-- Bookings Policies
CREATE POLICY "Bookings: Scoped to tenant or admin" ON bookings
    FOR ALL USING (tenant_id = get_auth_tenant_id() OR is_admin_or_superadmin());

-- Invoices Policies
CREATE POLICY "Invoices: Scoped to tenant or admin" ON invoices
    FOR SELECT USING (tenant_id = get_auth_tenant_id() OR is_admin_or_superadmin());

CREATE POLICY "Invoices: Admin insert and update" ON invoices
    FOR ALL USING (is_admin_or_superadmin());

-- Notifications Policies
CREATE POLICY "Notifications: Scoped to tenant" ON notifications
    FOR ALL USING (tenant_id = get_auth_tenant_id() OR is_admin_or_superadmin());

-- INDEXES FOR SCALE
CREATE INDEX idx_websites_tenant ON websites(tenant_id);
CREATE INDEX idx_requests_tenant ON change_requests(tenant_id, status);
CREATE INDEX idx_leads_tenant ON leads(tenant_id, status);
CREATE INDEX idx_bookings_tenant ON bookings(tenant_id, booking_time);
CREATE INDEX idx_invoices_tenant ON invoices(tenant_id, due_date);
CREATE INDEX idx_notifications_tenant_read ON notifications(tenant_id, is_read);
