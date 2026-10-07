import React, { useState } from 'react';
import {
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  Lock,
  Check,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';
import { useAuth } from '../../../context/AuthContext';
import { dataService } from '../../../services/dataService';
import { CARE_PLANS, stripeService } from '../../../services/stripeService';
import { Button } from '../../ui/Button';
import { StatusBadge } from '../../ui/StatusBadge';
import { Modal } from '../../ui/Modal';
import { formatCurrency, formatDate } from '../../../lib/utils';
import { Invoice } from '../../../types';
import { ROLE_LABELS } from '../../../lib/permissions';

interface BillingPageProps {
  onNavigateTab: (tabId: string) => void;
}

export const BillingPage: React.FC<BillingPageProps> = ({ onNavigateTab }) => {
  const { currentTenant } = useTenant();
  const { orgRole, can } = useAuth();

  const canViewBilling = can('billing.view');
  const canManageBilling = can('billing.manage');

  const invoices = dataService.getInvoices(currentTenant.id);

  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [selectedInvoiceForCheckout, setSelectedInvoiceForCheckout] = useState<Invoice | null>(null);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  if (!canViewBilling) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 rounded-xl border border-border bg-card text-center space-y-3 shadow-xs">
        <div className="size-10 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <Lock className="size-5" />
        </div>
        <h2 className="text-base font-bold text-foreground">Billing access restricted</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your role (<strong>{ROLE_LABELS[orgRole]}</strong>) does not have permission to view billing or invoices for{' '}
          <strong>{currentTenant.name}</strong>.
        </p>
        <div className="pt-2">
          <Button variant="secondary" size="sm" onClick={() => onNavigateTab('overview')}>
            Back to overview
          </Button>
        </div>
      </div>
    );
  }

  const plan = CARE_PLANS[currentTenant.care_plan] || CARE_PLANS.pro;
  const openInvoices = invoices.filter((inv) => inv.status === 'open' || inv.status === 'overdue');

  const handleOpenStripePortal = async () => {
    if (!canManageBilling) {
      setActionNotice(
        `Your role (${ROLE_LABELS[orgRole]}) has view-only billing access. Only an Owner can update payment methods.`
      );
      return;
    }
    setIsLoadingPortal(true);
    try {
      const { url } = await stripeService.createCustomerPortalSession(
        currentTenant.id,
        currentTenant.stripe_customer_id
      );
      setActionNotice(`Billing portal opened (${url}).`);
    } catch (err: any) {
      setActionNotice(err.message || 'Unable to open billing portal');
    } finally {
      setIsLoadingPortal(false);
    }
  };

  const handleInitiateInvoiceCheckout = async (invoice: Invoice) => {
    setIsCreatingCheckout(true);
    try {
      const { checkoutUrl } = await stripeService.createCheckoutSession(
        currentTenant.id,
        currentTenant.care_plan
      );
      setSelectedInvoiceForCheckout(null);
      setActionNotice(
        `Payment session opened for invoice ${invoice.invoice_number} (${checkoutUrl}).`
      );
    } catch (err: any) {
      setActionNotice(err.message || 'Unable to start payment session');
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    setDownloadingId(invoiceId);
    setTimeout(() => {
      setDownloadingId(null);
      setActionNotice(`Invoice ${invoiceId} downloaded.`);
    }, 600);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-border">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            Billing
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Subscription and invoices for <strong className="text-foreground">{currentTenant.name}</strong>
          </p>
        </div>
        {canManageBilling && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleOpenStripePortal}
            disabled={isLoadingPortal}
            icon={<ExternalLink className="size-3.5" />}
          >
            {isLoadingPortal ? 'Opening...' : 'Payment methods'}
          </Button>
        )}
      </div>

      {/* Action Notification Banner */}
      {actionNotice && (
        <div className="p-3 rounded-lg border border-border bg-card flex items-start justify-between gap-3 text-xs text-foreground animate-in fade-in duration-150">
          <div className="flex items-start gap-2.5">
            <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{actionNotice}</p>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-muted-foreground hover:text-foreground text-xs shrink-0 ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Open Invoice Banner */}
      {openInvoices.length > 0 && (
        <div className="p-4 rounded-lg border border-primary/40 bg-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs text-primary font-semibold">
              <AlertTriangle className="size-3.5" />
              <span>Invoice due</span>
            </div>
            <div className="text-sm font-semibold text-foreground">
              {openInvoices[0].invoice_number} — {openInvoices[0].description} (
              {formatCurrency(openInvoices[0].amount, openInvoices[0].currency)})
            </div>
            <div className="text-xs text-muted-foreground">
              Due {formatDate(openInvoices[0].due_date)}
            </div>
          </div>

          {canManageBilling && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setSelectedInvoiceForCheckout(openInvoices[0])}
              icon={<CreditCard className="size-3.5" />}
            >
              Pay invoice ({formatCurrency(openInvoices[0].amount, openInvoices[0].currency)})
            </Button>
          )}
        </div>
      )}

      {/* Subscription Status Card */}
      <div className="bg-card border border-border rounded-lg p-4 sm:p-5 shadow-xs relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-emerald-500">
                Active subscription
              </span>
              <span className="size-1 rounded-full bg-muted-foreground" />
              <span className="text-xs text-muted-foreground">Billed monthly</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              {plan.name} Plan
            </h2>
            <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
              {plan.description}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-foreground">
              <div>
                Monthly amount:{' '}
                <strong className="text-foreground text-sm">
                  ${plan.priceMonthly}/month
                </strong>
              </div>
              <span className="text-border">·</span>
              <div>
                Account:{' '}
                <strong className="text-foreground">{currentTenant.name}</strong>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0 pt-2 md:pt-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigateTab('care')}
            >
              View subscription details
            </Button>
            {canManageBilling && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenStripePortal}
                icon={<CreditCard className="size-3.5" />}
              >
                Update payment method
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-xs">
        <div className="p-3.5 sm:p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="size-3.5 text-muted-foreground" />
            <h2 className="text-xs sm:text-sm font-semibold text-foreground">
              Invoices
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">
            {invoices.length} total
          </span>
        </div>

        {/* Mobile View */}
        <div className="sm:hidden divide-y divide-border/60">
          {invoices.map((inv) => (
            <div key={inv.id} className="p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">
                  {inv.invoice_number}
                </span>
                <StatusBadge status={inv.status} />
              </div>
              <p className="text-xs text-muted-foreground">{inv.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span>{formatDate(inv.due_date)}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">
                    {formatCurrency(inv.amount, inv.currency)}
                  </span>
                  {inv.status === 'open' && canManageBilling && (
                    <button
                      onClick={() => setSelectedInvoiceForCheckout(inv)}
                      className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs font-medium"
                    >
                      Pay
                    </button>
                  )}
                  <button
                    onClick={() => handleDownloadInvoice(inv.invoice_number)}
                    className="text-foreground hover:text-primary px-2 py-0.5 border border-border rounded text-xs"
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
              <tr className="border-b border-border text-muted-foreground bg-muted/20">
                <th className="py-2.5 px-4 font-medium">Invoice</th>
                <th className="py-2.5 px-4 font-medium">Description</th>
                <th className="py-2.5 px-4 font-medium">Date</th>
                <th className="py-2.5 px-4 font-medium">Amount</th>
                <th className="py-2.5 px-4 font-medium">Status</th>
                <th className="py-2.5 px-4 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-accent/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-foreground">
                    {inv.invoice_number}
                  </td>
                  <td className="py-3 px-4 text-foreground">{inv.description}</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {formatDate(inv.due_date)}
                  </td>
                  <td className="py-3 px-4 font-semibold text-foreground tabular-nums">
                    {formatCurrency(inv.amount, inv.currency)}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {inv.status === 'open' && canManageBilling && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setSelectedInvoiceForCheckout(inv)}
                        >
                          Pay invoice
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadInvoice(inv.invoice_number)}
                        icon={<Download className="size-3" />}
                      >
                        {downloadingId === inv.invoice_number ? 'Downloading...' : 'PDF'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Invoice Modal */}
      <Modal
        isOpen={Boolean(selectedInvoiceForCheckout)}
        onClose={() => setSelectedInvoiceForCheckout(null)}
        title="Pay invoice"
        description="Complete payment securely via Stripe."
        maxWidth="md"
      >
        {selectedInvoiceForCheckout && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-lg bg-muted/40 border border-border space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Account</span>
                <strong className="text-foreground">{currentTenant.name}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Invoice</span>
                <span className="font-semibold text-foreground">
                  {selectedInvoiceForCheckout.invoice_number}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Due date</span>
                <span className="text-foreground">{formatDate(selectedInvoiceForCheckout.due_date)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="font-semibold text-foreground">Amount due</span>
                <span className="text-base font-bold text-foreground tabular-nums">
                  {formatCurrency(
                    selectedInvoiceForCheckout.amount,
                    selectedInvoiceForCheckout.currency
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedInvoiceForCheckout(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={isCreatingCheckout}
                onClick={() => handleInitiateInvoiceCheckout(selectedInvoiceForCheckout)}
                icon={<ArrowRight className="size-3.5" />}
              >
                {isCreatingCheckout ? 'Opening...' : 'Continue to payment'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
