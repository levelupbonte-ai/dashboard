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
    name: 'No plan',
    priceMonthly: 0,
    stripePriceId: '',
    description: 'Hosting without monthly website updates.',
    highlights: ['Standard website hosting', 'SSL certificate'],
    recommendedFor: 'Static websites',
  },
  essential: {
    id: 'essential',
    name: 'Essential',
    priceMonthly: 39,
    stripePriceId: 'price_levelup_essential_monthly',
    description: 'Hosting, security updates, and daily backups.',
    highlights: [
      'Weekly security updates',
      'Uptime and SSL monitoring',
      'Daily backups (30-day history)',
      '1 website update request per month',
      'Email support (within 48 hours)',
    ],
    recommendedFor: 'Standard business websites',
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 99,
    stripePriceId: 'price_levelup_pro_monthly',
    description: 'Regular website updates, form monitoring, and priority support.',
    highlights: [
      'Everything in Essential',
      'Up to 4 website update requests per month',
      'Monthly website speed and search review',
      'Contact form and booking checks',
      'Priority support (within 12 hours)',
      'Preview link for changes',
    ],
    recommendedFor: 'Active businesses & booking websites',
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    priceMonthly: 199,
    stripePriceId: 'price_levelup_premium_monthly',
    description: 'Unlimited content updates and fastest response times.',
    highlights: [
      'Everything in Pro',
      'Unlimited content and text updates',
      'Quarterly website review',
      'Direct support channel',
      'Same-day urgent fixes (within 4 hours)',
      'Online store and checkout monitoring',
    ],
    recommendedFor: 'Online stores & high-traffic businesses',
  },
};

export const stripeService = {
  createCustomerPortalSession: async (tenantId: string, stripeCustomerId?: string): Promise<{ url: string }> => {
    if (!stripeCustomerId) {
      throw new Error('No billing account found for this organization.');
    }
    return {
      url: `https://billing.stripe.com/p/session/test_${tenantId}_${Date.now()}`,
    };
  },

  createCheckoutSession: async (
    tenantId: string,
    tier: CarePlanTier
  ): Promise<{ checkoutUrl: string; sessionId: string }> => {
    const plan = CARE_PLANS[tier];
    if (!plan || !plan.stripePriceId) {
      throw new Error(`Invalid plan selected: ${tier}`);
    }

    return {
      checkoutUrl: `https://checkout.stripe.com/c/pay/cs_test_${tenantId}_${plan.id}`,
      sessionId: `cs_test_${Date.now()}`,
    };
  },
};
