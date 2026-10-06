// =======================================================================
// LEVELUP DASHBOARD - STRIPE-READY BILLING INTEGRATION ARCHITECTURE
// Server-side authorization & checkout session creation protocol.
// Sensitive keys must NEVER be in client-side code.
// =======================================================================

import { CarePlanTier } from '../types';

export interface PlanConfig {
  id: CarePlanTier;
  name: string;
  priceMonthly: number;
  stripePriceId: string;
  description: string;
  highlights: string[];
  recommendedFor: string;
}

export const CARE_PLANS: Record<CarePlanTier, PlanConfig> = {
  none: {
    id: 'none',
    name: 'No Care Plan',
    priceMonthly: 0,
    stripePriceId: '',
    description: 'Self-managed hosting without LevelUp maintenance SLA.',
    highlights: ['Community documentation', 'Standard hosting SLA'],
    recommendedFor: 'Archived or static staging projects',
  },
  essential: {
    id: 'essential',
    name: 'Essential Care',
    priceMonthly: 39,
    stripePriceId: 'price_levelup_essential_monthly',
    description: 'Core reliability, uptime monitoring, and weekly security updates.',
    highlights: [
      'Weekly automated security & dependency updates',
      '24/7 Uptime & SSL certificate monitoring',
      'Daily cloud backups (30-day retention)',
      '1 content change request per month',
      'Standard email support (48h SLA)',
    ],
    recommendedFor: 'Solopreneurs & simple business websites',
  },
  pro: {
    id: 'pro',
    name: 'Pro Care',
    priceMonthly: 99,
    stripePriceId: 'price_levelup_pro_monthly',
    description: 'Active maintenance, performance audits, and high-priority turnaround.',
    highlights: [
      'Everything in Essential Care',
      'Up to 4 content & design change requests / month',
      'Monthly Core Web Vitals speed & SEO audit',
      'Form & booking workflow telemetry health checks',
      'High-priority support queue (12h SLA)',
      'Staging preview environment',
    ],
    recommendedFor: 'Growing professional businesses & booking portals',
  },
  premium: {
    id: 'premium',
    name: 'Premium Care & Growth',
    priceMonthly: 199,
    stripePriceId: 'price_levelup_premium_monthly',
    description: 'Dedicated engineering partner, unlimited minor revisions, and conversion optimization.',
    highlights: [
      'Everything in Pro Care',
      'Unlimited minor content & asset updates',
      'Quarterly conversion rate & landing page optimization',
      'Dedicated Slack/Teams engineering channel',
      'Urgent bug hotfix guarantee (4h SLA)',
      'Custom API & e-commerce checkout telemetry',
    ],
    recommendedFor: 'High-traffic e-commerce & mission-critical corporate platforms',
  },
};

export const stripeService = {
  /**
   * Generates a Stripe Customer Portal redirect URL.
   * In a live deployment, this calls your Next.js / Express backend endpoint
   * POST /api/billing/create-portal-session with user JWT.
   */
  createCustomerPortalSession: async (tenantId: string, stripeCustomerId?: string): Promise<{ url: string }> => {
    // Architectural pattern: Client invokes server endpoint, server queries Stripe with secret key
    if (!stripeCustomerId) {
      throw new Error('Tenant has no attached Stripe Customer ID. Contact LevelUp billing.');
    }
    // Simulation for preview sandbox
    return {
      url: `https://billing.stripe.com/p/session/test_${tenantId}_${Date.now()}`,
    };
  },

  /**
   * Initiates a Stripe Checkout session for plan upgrades.
   * Server validates tenant session and generates session URL with line_items.
   */
  createCheckoutSession: async (
    tenantId: string,
    tier: CarePlanTier
  ): Promise<{ checkoutUrl: string; sessionId: string }> => {
    const plan = CARE_PLANS[tier];
    if (!plan || !plan.stripePriceId) {
      throw new Error(`Invalid plan tier selected: ${tier}`);
    }

    return {
      checkoutUrl: `https://checkout.stripe.com/c/pay/cs_test_${tenantId}_${plan.id}`,
      sessionId: `cs_test_${Date.now()}`,
    };
  },
};
