import React, { useState } from 'react';
import {
  CreditCard,
  Download,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileText,
  Lock,
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';
import { dataService } from '../../../services/dataService';
import { CARE_PLANS, stripeService } from '../../../services/stripeService';
import { Button } from '../../ui/Button';
import { StatusBadge } from '../../ui/StatusBadge';
import { formatCurrency, formatDate } from '../../../lib/utils';
import { CarePlanTier } from '../../../types';

interface BillingPageProps {
  onNavigateTab: (tabId: string) => void;
}

export const BillingPage: React.FC<BillingPageProps> = ({ onNavigateTab }) => {
  const { currentTenant } = useTenant();
  const invoices = dataService.getInvoices(currentTenant.id);

  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const plan = CARE_PLANS[currentTenant.care_plan] || CARE_PLANS.pro;

  const handleOpenStripePortal = async () => {
    setIsLoadingPortal(true);
    try {
      const { url } = await stripeService.createCustomerPortalSession(
        currentTenant.id,
        currentTenant.stripe_customer_id
      );
      alert(`[Stripe Customer Portal Redirect]\nStripe session generated: ${url}\nIn production, client securely updates credit card and tax details on Stripe's hosted portal.`);
    } catch (err: any) {
      alert(err.message || 'Error opening billing portal');
    } finally {
      setIsLoadingPortal(false);
    }
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    setDownloadingId(invoiceId);
    setTimeout(() => {
      setDownloadingId(null);
      alert(`[LevelUp Invoice Download]\nDownloading official PDF receipt for ${invoiceId}.\nVerified via Stripe cryptographically signed invoice token.`);
    }, 500);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">Billing & Subscriptions</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            LevelUp Website Care subscriptions, tax invoices, and Stripe-managed payments.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleOpenStripePortal}
          disabled={isLoadingPortal}
          icon={<ExternalLink className="w-3.5 h-3.5" />}
        >
          {isLoadingPortal ? 'Connecting...' : 'Stripe Customer Portal'}
        </Button>
      </div>

      {/* Subscription Status Card: Clean Vercel Pro Style */}
      <div className="bg-[#0b0c10] border border-zinc-800 rounded-lg p-4 sm:p-5 shadow-xs relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-violet-400 font-bold">
                SUBSCRIPTION ACTIVE
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] text-zinc-400 font-mono">Renews monthly</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              LevelUp {plan.name}
            </h2>
            <p className="text-xs text-zinc-400 max-w-lg leading-relaxed">
              {plan.description}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-300 font-mono">
              <div>
                Amount:{' '}
                <strong className="text-white font-mono text-sm">
                  ${plan.priceMonthly}/mo
                </strong>
              </div>
              <span className="text-zinc-600">·</span>
              <div>
                Next Period:{' '}
                <strong className="text-white">Nov 1, 2026</strong>
              </div>
              <span className="text-zinc-600">·</span>
              <div className="text-[11px] text-zinc-400 truncate max-w-[200px]">
                ID: {currentTenant.stripe_customer_id || 'cus_live_configured'}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0 pt-2 md:pt-0">
            <Button
              variant="violet"
              size="sm"
              onClick={() => onNavigateTab('care')}
            >
              Compare All Plans
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenStripePortal}
              icon={<CreditCard className="w-3.5 h-3.5" />}
            >
              Update Payment Method
            </Button>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="p-3.5 rounded-lg border border-zinc-800 bg-[#090a0e] flex items-start gap-2.5 text-xs text-zinc-400">
        <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-zinc-300">
            Encrypted Stripe-Native Settlement
          </span>
          <p className="mt-0.5 text-[11px] leading-relaxed">
            Credit card tokens remain on Stripe’s vault. Subscriptions and invoices update via signed webhooks.
          </p>
        </div>
      </div>

      {/* Invoices Ledger (Card list on mobile, Table on tablet/desktop) */}
      <div className="bg-[#0b0c10] border border-zinc-800 rounded-lg overflow-hidden shadow-xs">
        <div className="p-3.5 sm:p-4 border-b border-zinc-800 bg-[#0e0f14] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-violet-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 font-mono">
              Invoices & Payment History
            </h2>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">
            {invoices.length} Invoices
          </span>
        </div>

        {/* Mobile View */}
        <div className="sm:hidden divide-y divide-zinc-800/60">
          {invoices.map((inv) => (
            <div key={inv.id} className="p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-white">{inv.invoice_number}</span>
                <StatusBadge status={inv.status} />
              </div>
              <p className="text-xs text-zinc-300">{inv.description}</p>
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-1">
                <span>{formatDate(inv.due_date)}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">{formatCurrency(inv.amount, inv.currency)}</span>
                  <button
                    onClick={() => handleDownloadInvoice(inv.invoice_number)}
                    className="text-violet-400 hover:text-white px-2 py-0.5 border border-zinc-800 rounded text-[10px]"
                  >
                    PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tablet & Desktop View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-mono uppercase text-[10px]">
                <th className="py-2.5 px-4 font-medium">Invoice Number</th>
                <th className="py-2.5 px-4 font-medium">Description</th>
                <th className="py-2.5 px-4 font-medium">Due Date</th>
                <th className="py-2.5 px-4 font-medium">Amount</th>
                <th className="py-2.5 px-4 font-medium">Status</th>
                <th className="py-2.5 px-4 font-medium text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-white">
                    {inv.invoice_number}
                  </td>
                  <td className="py-3 px-4 text-zinc-300">{inv.description}</td>
                  <td className="py-3 px-4 font-mono text-zinc-400 text-[11px]">
                    {formatDate(inv.due_date)}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-white tabular-nums">
                    {formatCurrency(inv.amount, inv.currency)}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadInvoice(inv.invoice_number)}
                      icon={<Download className="w-3 h-3" />}
                    >
                      {downloadingId === inv.invoice_number ? 'Exporting...' : 'PDF'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
