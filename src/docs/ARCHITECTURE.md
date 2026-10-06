# LEVELUP DASHBOARD — ARCHITECTURE SPECIFICATION

## 1. System Architecture Overview
LevelUp Dashboard is an enterprise-grade, multi-tenant digital operations platform built specifically for LevelUp Ecosystem (web design, custom dashboards, client portals, e-commerce, and digital solutions).

### Architectural Model: Shared Database, Isolated Tenant Records (RLS Enforced)
- **Tenancy Boundary**: Every client account represents a tenant organization with a UUID (`tenant_id` / `client_id`).
- **Data Isolation Guarantee**: PostgreSQL Row Level Security (RLS) ensures that all queries executed on behalf of a tenant automatically filter rows by `auth.jwt() ->> 'tenant_id' = tenant_id`. Client A can never view, update, or delete Client B's records at the database engine level.
- **Dynamic Service Entitlement Engine**: Tenants only see modules corresponding to purchased services (e.g. Booking Systems, E-Commerce Stores, SEO Search Visibility, Website Care Plans). Feature flags are bound to the client tenant record and enforced on both frontend rendering and backend authorization checks.
- **Dual Perspective**:
  1. **Client Workspace**: Isolated views strictly scoped to the tenant's websites, leads, bookings, change requests, invoices, and performance metrics.
  2. **LevelUp Agency Admin (RBAC)**: Distinct operational interface for agency admins (`role = 'admin'` or `role = 'super_admin'`) across all client accounts, global change queues, care plan health, and system audit logs. Admin is never just hidden client UI—it has dedicated permissions and server-side authorization enforcement.

---

## 2. Folder Structure
```text
/src
  ├── assets/                 # Brand assets, SVGs, and visual elements
  ├── components/
  │   ├── layout/             # Shell components: Sidebar, Topbar, MobileNav
  │   ├── ui/                 # Reusable atomic UI (Button, Input, Dropdown, Modal, Drawer, etc.)
  │   ├── command/            # ⌘K Command Palette (Search across all resources)
  │   ├── notifications/      # Notification slide-over & badge triggers
  │   ├── shared/             # StatCard, StatusBadge, EmptyState, PageHeader, TabularValue
  │   └── modules/            # Feature-specific modules:
  │       ├── overview/       # Analytics summary, live status, metric cards, quick actions
  │       ├── websites/       # Website management, multi-domain switcher, health cards
  │       ├── requests/       # "Request a Change" workflow, priority queue, conversation log
  │       ├── leads/          # Mini-CRM lead pipeline, notes, status changes, contact card
  │       ├── bookings/       # Booking calendar, service appointment ledger, slots
  │       ├── analytics/      # Traffic charts, top pages, traffic channels, device breakdown
  │       ├── store/          # E-Commerce store overview, orders, revenue (conditional)
  │       ├── seo/            # Search visibility, keyword ranks, indexing health (conditional)
  │       ├── billing/        # Stripe-ready subscription management, invoice ledger, Care Plan
  │       ├── care/           # Website Care plans (Essential $39, Pro $99, Premium $199)
  │       ├── support/        # Ticket center, threaded responses, attachments
  │       ├── settings/       # Profile, Security (Password, 2FA, Active Sessions), Preferences
  │       └── admin/          # LevelUp Agency Admin console (Tenants, Global Requests, Audit)
  ├── context/
  │   ├── AuthContext.tsx     # Session management, role resolution, tenant switching
  │   └── TenantContext.tsx   # Active tenant state, enabled feature flags, service entitlements
  ├── db/
  │   └── schema.sql          # Full PostgreSQL / Supabase migration script with RLS policies
  ├── docs/
  │   └── ARCHITECTURE.md     # System architecture specification
  ├── lib/
  │   ├── supabase.ts         # Supabase client wrapper & configuration
  │   └── utils.ts            # Formatting (currency, tabular numbers, dates, cn)
  ├── services/
  │   ├── dataService.ts      # Multi-tenant data access layer (Supabase + In-Memory demo store)
  │   └── stripeService.ts    # Stripe Customer Portal & Checkout session definitions
  ├── types/
  │   └── index.ts            # TypeScript domain models, schemas, and RBAC definitions
  ├── App.tsx                 # Root application controller & router
  ├── index.css               # Tailwind CSS rules & dark/violet visual theme
  └── main.tsx                # React DOM entry point
```

---

## 3. Database Schema & Relational Model

```text
[tenants/clients]
       | 1:N
       +---------------------------------------------------------------+
       |                               |                               |
  [websites]                      [profiles/members]              [subscriptions]
       | 1:N                           | 1:N                           | 1:N
   +---+---+                           |                          [invoices]
   |       |                           |
[leads] [bookings]             [audit_logs]
   |       |
[requests] [support_tickets]
   |           |
[request_msgs] [ticket_msgs]
```

### Core Entities:
1. `tenants`: Primary tenant organization (`id`, `name`, `slug`, `plan`, `care_tier`, `created_at`, `features_enabled`).
2. `profiles`: User accounts linked to Supabase Auth (`id` = `auth.users.id`, `tenant_id`, `email`, `full_name`, `role` enum: `client`, `admin`, `super_admin`).
3. `websites`: Websites managed by LevelUp (`id`, `tenant_id`, `name`, `domain`, `status`, `environment`, `performance_score`, `seo_score`, `care_plan`, `last_deployed_at`).
4. `website_features`: Enabled service flags (`tenant_id`, `has_bookings`, `has_ecommerce`, `has_seo`, `has_care_plan`, `custom_domain_count`).
5. `change_requests`: Client modification tickets (`id`, `tenant_id`, `website_id`, `title`, `description`, `priority`, `status`, `category`, `created_at`).
6. `request_messages`: Threaded conversation per change request (`id`, `request_id`, `sender_id`, `sender_role`, `message`, `attachments`, `created_at`).
7. `leads`: Inbound lead captures from client websites (`id`, `tenant_id`, `website_id`, `name`, `email`, `phone`, `source`, `status`, `notes`, `created_at`).
8. `bookings`: Service booking records (`id`, `tenant_id`, `website_id`, `customer_name`, `customer_email`, `service_name`, `booking_time`, `status`, `price`).
9. `subscriptions`: Stripe billing records (`id`, `tenant_id`, `stripe_customer_id`, `stripe_subscription_id`, `plan_id`, `status`, `current_period_end`).
10. `invoices`: Stripe/LevelUp generated invoices (`id`, `tenant_id`, `invoice_number`, `amount_due`, `status`, `due_date`, `pdf_url`).
11. `support_tickets`: Direct LevelUp engineering support threads (`id`, `tenant_id`, `subject`, `priority`, `status`, `created_at`).
12. `notifications`: In-app event alerts (`id`, `tenant_id`, `title`, `body`, `type`, `read`, `created_at`).
13. `audit_logs`: Immutable security log (`id`, `tenant_id`, `actor_id`, `action`, `resource`, `ip_address`, `timestamp`).

---

## 4. Authentication & Authorization (RBAC)

### Auth Flow:
1. User authenticates via Supabase Auth (Email + Password or Magic Link).
2. Supabase Auth returns a JWT containing `sub` (User ID), `role`, and custom app claims `app_metadata.tenant_id` and `app_metadata.role`.
3. Client attaches the Bearer token on all database / backend interactions.
4. Roles:
   - `client`: Read & Write scoped strictly to the user's `tenant_id`.
   - `admin`: Full read & write across all tenants, change request management, feature toggling.
   - `super_admin`: Full access including billing overrides, developer keys, and audit log inspection.

---

## 5. Tenant Isolation Architecture

### Defense-in-Depth Isolation:
- **Layer 1: PostgreSQL Row Level Security (RLS)**:
  Every table contains a `tenant_id` foreign key. An RLS policy is enforced:
  ```sql
  CREATE POLICY tenant_isolation_policy ON change_requests
    FOR ALL
    USING (
      tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid
      OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
    );
  ```
- **Layer 2: Server-Side Authorization Middleware**:
  Any server-side proxy route or API endpoint validates that the incoming session's `tenant_id` matches the target entity before executing database calls.
- **Layer 3: UI-Level Dynamic Shell**:
  Navigation bar and routing dynamically hide features not provisioned in `website_features`.

---

## 6. Client-Side vs Server-Side Responsibilities

| Responsibility | Client-Side (Browser) | Server-Side (Next.js / Node API) | Supabase Engine |
| :--- | :--- | :--- | :--- |
| UI Rendering & Micro-interactions | Yes | No | No |
| ⌘K Command Palette Filtering | Yes (local cache) | Search API endpoint | No |
| Input Formatting & Validation | Yes (Zod/UX) | Yes (Mandatory strict check) | Column constraints |
| Session Token Storage | Yes (httpOnly cookie / storage) | Validates JWT signature | Validates JWT signature |
| Multi-tenant Filtering | State context | Auth checks | **RLS Policy Enforcement** |
| Stripe Checkout / Portal Session | No | **Yes (Secret Key)** | Webhook receiver |
| Stripe Webhook Verification | Never | **Yes (Signature validation)** | Syncs DB state |
| Secret API Keys Storage | Never | **Yes (.env server only)** | Secure Vault |

---

## 7. Security Risks & Mitigations

1. **Risk: IDOR (Insecure Direct Object Reference)**
   - *Threat*: Client A guesses request ID #1042 belonging to Client B.
   - *Mitigation*: RLS blocks the query at the DB layer, returning 0 rows even if the UUID is known. Server endpoints verify tenant match before acting.
2. **Risk: Frontend-Only Role Checks**
   - *Threat*: Malicious user modifies client JavaScript state to set `role = 'admin'`.
   - *Mitigation*: Role verification is cryptographically signed inside Supabase JWT or checked against `profiles.role` using `SECURITY DEFINER` database functions.
3. **Risk: Client-Side Payment Confirmation**
   - *Threat*: Attacker calls payment success callback without paying.
   - *Mitigation*: LevelUp Dashboard only upgrades care tiers or marks invoices as paid upon receiving signed Stripe webhooks with cryptographic timestamp validation.
4. **Risk: Leaked Service-Role Keys**
   - *Mitigation*: Service-role keys are strictly forbidden in client-side code (`VITE_` prefix forbidden for private keys).

---

## 8. Development State Markers
- `MOCK DATA`: Pre-seeded high-fidelity data used for testing multi-tenant isolation and switching in the preview environment.
- `FUTURE INTEGRATION`: Dedicated hooks for Google Calendar sync and live Stripe Webhook listeners.
- `PRODUCTION READY`: Supabase schema, RLS policies, RBAC type system, and responsive component tree.
