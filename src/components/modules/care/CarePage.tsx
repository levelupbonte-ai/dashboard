import React, { useState } from 'react';
import {
  ShieldCheck,
  Check,
  Sparkles,
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
      alert(`[Stripe Checkout Flow]\nProceeding to Stripe Checkout for LevelUp ${CARE_PLANS[tier].name} ($${CARE_PLANS[tier].priceMonthly}/mo).\nSession URL: ${checkoutUrl}\nPayment confirmation handled via webhook.`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpgradingTier(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="pb-3 sm:pb-4 border-b border-zinc-800">
        <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">Website Care & Maintenance</h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Proactive security updates, SLA response guarantees, and change request quotas.
        </p>
      </div>

      {/* Quota & Health Box */}
      <div className="bg-[#0b0c10] border border-zinc-800 rounded-lg p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-zinc-800/80">
          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
              Enrolled Tier
            </div>
            <div className="text-base sm:text-lg font-bold text-white mt-0.5">
              LevelUp {CARE_PLANS[currentTenant.care_plan]?.name || 'Pro Care'} Plan
            </div>
          </div>

          <div className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-emerald-400 text-xs font-mono font-medium flex items-center gap-1.5 self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            24/7 Edge Telemetry Active
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="p-3 sm:p-3.5 rounded-md bg-[#0f1015] border border-zinc-800 space-y-1">
            <div className="text-[10px] text-zinc-400 font-mono uppercase">Quota Usage</div>
            <div className="text-xl font-bold text-white font-mono">
              {thisMonthRequests.length} / {currentTenant.care_plan === 'essential' ? '1' : currentTenant.care_plan === 'pro' ? '4' : 'Unlimited'}
            </div>
            <p className="text-[10px] text-zinc-400 font-mono">Cycle resets Nov 1, 2026</p>
          </div>

          <div className="p-3 sm:p-3.5 rounded-md bg-[#0f1015] border border-zinc-800 space-y-1">
            <div className="text-[10px] text-zinc-400 font-mono uppercase">Turnaround SLA</div>
            <div className="text-xl font-bold text-violet-300 font-mono">
              {currentTenant.care_plan === 'premium' ? '< 4h' : currentTenant.care_plan === 'pro' ? '< 12h' : '< 48h'}
            </div>
            <p className="text-[10px] text-zinc-400 font-mono">Engineering queue priority</p>
          </div>

          <div className="p-3 sm:p-3.5 rounded-md bg-[#0f1015] border border-zinc-800 space-y-1">
            <div className="text-[10px] text-zinc-400 font-mono uppercase">Snapshots & Backups</div>
            <div className="text-xl font-bold text-white font-mono">
              30 Days
            </div>
            <p className="text-[10px] text-zinc-400 font-mono">Encrypted multi-region</p>
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
                  ? 'bg-[#0e0f16] border border-violet-500/80 shadow-xs'
                  : 'bg-[#0b0c10] border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {isCurrent && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-800 text-[10px] font-mono uppercase font-bold">
                  Enrolled
                </div>
              )}

              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 font-mono">
                  {t.recommendedFor}
                </div>
                <h3 className="text-base font-bold text-white mt-1">{t.name}</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed min-h-[32px]">
                  {t.description}
                </p>

                <div className="my-4 flex items-baseline gap-1 font-mono">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">${t.priceMonthly}</span>
                  <span className="text-xs text-zinc-400">/ month</span>
                </div>

                <div className="space-y-2 pt-3 border-t border-zinc-800/80">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 font-mono">
                    Service Scope
                  </div>
                  {t.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                      <Check className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-zinc-800/80">
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
