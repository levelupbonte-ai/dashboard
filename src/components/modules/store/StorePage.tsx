import React from 'react';
import { ShoppingBag, TrendingUp, PackageCheck, DollarSign, Clock } from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';
import { dataService } from '../../../services/dataService';
import { MetricCard } from '../../shared/MetricCard';
import { StatusBadge } from '../../ui/StatusBadge';
import { formatCurrency, formatDateTime } from '../../../lib/utils';

export const StorePage: React.FC = () => {
  const { currentTenant } = useTenant();
  const orders = dataService.getStoreOrders(currentTenant.id);

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="pb-3 sm:pb-4 border-b border-zinc-800">
        <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">Store & Checkouts</h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Headless e-commerce telemetry, order fulfillment, and transaction logs.
        </p>
      </div>

      {/* KPI Cards (3 cols tablet/desktop, 1 col mobile) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <MetricCard
          title="Revenue (30d)"
          value={formatCurrency(totalRevenue || 48290)}
          subValue="Processed via Stripe"
          change="+24.6%"
          changeType="positive"
          icon={<DollarSign className="w-3.5 h-3.5 text-emerald-400" />}
        />
        <MetricCard
          title="Orders"
          value="184"
          subValue="Avg value $262"
          change="+18.2%"
          changeType="positive"
          icon={<ShoppingBag className="w-3.5 h-3.5 text-sky-400" />}
        />
        <MetricCard
          title="Fulfillment"
          value="99.4%"
          subValue="Zero backlog"
          change="Optimal"
          changeType="positive"
          icon={<PackageCheck className="w-3.5 h-3.5 text-violet-400" />}
        />
      </div>

      {/* Orders Ledger (Responsive: Card list on mobile, Table on tablet/desktop) */}
      <div className="bg-[#0b0c10] border border-zinc-800 rounded-lg overflow-hidden shadow-xs">
        <div className="p-3.5 sm:p-4 border-b border-zinc-800 bg-[#0e0f14]">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 font-mono">
            Recent Store Orders
          </h2>
        </div>

        {/* Mobile View */}
        <div className="sm:hidden divide-y divide-zinc-800/60">
          {orders.map((ord) => (
            <div key={ord.id} className="p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-white">{ord.order_number}</span>
                <StatusBadge status={ord.status} />
              </div>
              <div className="text-xs text-zinc-300">{ord.customer_name}</div>
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-1">
                <span>{ord.items_count} items</span>
                <span className="font-bold text-emerald-400 text-xs">{formatCurrency(ord.total)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tablet & Desktop View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-mono uppercase text-[10px]">
                <th className="py-2.5 px-4 font-medium">Order #</th>
                <th className="py-2.5 px-4 font-medium">Customer</th>
                <th className="py-2.5 px-4 font-medium">Items</th>
                <th className="py-2.5 px-4 font-medium">Total</th>
                <th className="py-2.5 px-4 font-medium">Date</th>
                <th className="py-2.5 px-4 font-medium text-right">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-white">{ord.order_number}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-zinc-200">{ord.customer_name}</div>
                    <div className="text-[10px] text-zinc-400 font-mono">{ord.customer_email}</div>
                  </td>
                  <td className="py-3 px-4 text-zinc-300 font-mono">{ord.items_count} items</td>
                  <td className="py-3 px-4 font-mono font-semibold text-emerald-400 tabular-nums">
                    {formatCurrency(ord.total)}
                  </td>
                  <td className="py-3 px-4 text-zinc-400 font-mono text-[11px]">
                    {formatDateTime(ord.created_at)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <StatusBadge status={ord.status} />
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
