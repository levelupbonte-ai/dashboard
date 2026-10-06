import React, { useState } from 'react';
import {
  ShieldCheck,
  Check,
  Zap,
  Clock,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';
import { CARE_PLANS, stripeService } from '../../../services/stripeService';
import { Button } from '../../ui/Button';
import { CarePlanTier } from '../../../types';
import { dataService } from '../../../services/dataService';

export const CarePage: React.FC = () => {
  const { currentTenant } = useTenant();
  const [upgradingTier, setUpgradingTier] = useState<CarePlanTier | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const requests = dataService.getRequests(currentTenant.id);
  const thisMonthRequests = requests.filter((r) => {
    const d = new Date(r.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const tiers: CarePlanTier[] = ['essential', 'pro', 'premium'];

  const handleUpgrade = async (tier: CarePlanTier) => {
    setUpgradingTier(tier);
    try {
      const { checkoutUrl } = await stripeService.createCheckoutSession(currentTenant.id, tier);
      setActionNotice(
        `Stripe Checkout initiated for LevelUp ${CARE_PLANS[tier].name} ($${CARE_PLANS[tier].priceMonthly}/mo). Checkout URL generated: ${checkoutUrl}`
      );
    } catch (err: any) {
      setActionNotice(err.message || 'Error creating checkout session');
    } finally {
      setUpgradingTier(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="pb-3 sm:pb-4 border-b border-border">
        <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">Website Care & Maintenance</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Proactive security updates, SLA response guarantees, and change request quotas.
        </p>
      </div>

      {/* Action Notice */}
      {actionNotice && (
        <div className="p-3 rounded-lg border border-border bg-card flex items-start justify-between gap-3 text-xs text-foreground animate-in fade-in duration-150">
          <div className="flex items-start gap-2.5">
            <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{actionNotice}</p>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-muted-foreground hover:text-foreground text-xs font-mono shrink-0 ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Quota & Health Box */}
      <div className="bg-card border border-border rounded-lg p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-border/80">
          <div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider font-mono">
              Enrolled Tier
            </div>
            <div className="text-base sm:text-lg font-bold text-foreground mt-0.5">
              LevelUp {CARE_PLANS[currentTenant.care_plan]?.name || 'Pro Care'} Plan
            </div>
          </div>

          <div className="px-2.5 py-1 rounded bg-muted border border-border text-emerald-500 text-xs font-mono font-medium flex items-center gap-1.5 self-start sm:self-auto">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            24/7 Edge Telemetry Active
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="p-3 sm:p-3.5 rounded-md bg-muted/40 border border-border space-y-1">
            <div className="text-[10px] text-muted-foreground font-mono uppercase">Quota Usage</div>
            <div className="text-xl font-bold text-foreground font-mono tabular-nums">
              {thisMonthRequests.length} / {currentTenant.care_plan === 'essential' ? '1' : currentTenant.care_plan === 'pro' ? '4' : 'Unlimited'}
            </div>
            <p className="text-[10px] text-muted-foreground font-mono">Cycle resets Nov 1, 2026</p>
          </div>

          <div className="p-3 sm:p-3.5 rounded-md bg-muted/40 border border-border space-y-1">
            <div className="text-[10px] text-muted-foreground font-mono uppercase">Turnaround SLA</div>
            <div className="text-xl font-bold text-foreground font-mono tabular-nums">
              {currentTenant.care_plan === 'premium' ? '< 4h' : currentTenant.care_plan === 'pro' ? '< 12h' : '< 48h'}
            </div>
            <p className="text-[10px] text-muted-foreground font-mono">Engineering queue priority</p>
          </div>

          <div className="p-3 sm:p-3.5 rounded-md bg-muted/40 border border-border space-y-1">
            <div className="text-[10px] text-muted-foreground font-mono uppercase">Snapshots & Backups</div>
            <div className="text-xl font-bold text-foreground font-mono tabular-nums">
              30 Days
            </div>
            <p className="text-[10px] text-muted-foreground font-mono">Encrypted multi-region</p>
          </div>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-1">
        {tiers.map((tierKey) => {
          const t = CARE_PLANS[tierKey];
          const isCurrent = currentTenant.care_plan === tierKey;
          const isPro = tierKey === 'pro';

          return (
            <div
              key={tierKey}
              className={`rounded-lg p-5 flex flex-col justify-between transition-colors relative ${
                isCurrent
                  ? 'bg-card border-2 border-foreground shadow-xs'
                  : 'bg-card border border-border hover:border-border/80'
              }`}
            >
              {isCurrent && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-foreground text-background text-[10px] font-mono uppercase font-bold">
                  Enrolled
                </div>
              )}

              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                  {t.recommendedFor}
                </div>
                <h3 className="text-base font-bold text-foreground mt-1">{t.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed min-h-[32px]">
                  {t.description}
                </p>

                <div className="my-4 flex items-baseline gap-1 font-mono">
                  <span className="text-2xl sm:text-3xl font-extrabold text-foreground tabular-nums">${t.priceMonthly}</span>
                  <span className="text-xs text-muted-foreground">/ month</span>
                </div>

                <div className="space-y-2 pt-3 border-t border-border/80">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                    Service Scope
                  </div>
                  {t.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="size-3.5 text-foreground shrink-0 mt-0.5" />
                      <span className="text-foreground">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-border/80">
                {isCurrent ? (
                  <Button variant="secondary" size="md" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    variant={isPro ? 'primary' : 'outline'}
                    size="md"
                    className="w-full"
                    onClick={() => handleUpgrade(tierKey)}
                    disabled={upgradingTier === tierKey}
                  >
                    {upgradingTier === tierKey ? 'Connecting...' : `Select ${t.name}`}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
