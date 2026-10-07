import React from 'react';
import { ShoppingBag, PackageCheck, DollarSign } from 'lucide-react';
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
      <div className="pb-3 sm:pb-4 border-b border-border">
        <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">Orders</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Orders and revenue for {currentTenant.name}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <MetricCard
          title="Revenue"
          value={formatCurrency(totalRevenue || 48290)}
          subValue="this month"
          change="↑ 24.6% vs last month"
          changeType="positive"
          icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Orders"
          value="184"
          subValue="placed this month"
          change="↑ 18.2% vs last month"
          changeType="positive"
          icon={<ShoppingBag className="w-4 h-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Conversion rate"
          value="4.8%"
          subValue="completed checkouts"
          change="↑ 0.6% vs last month"
          changeType="positive"
          icon={<PackageCheck className="w-4 h-4 text-muted-foreground" />}
        />
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-xs">
        <div className="p-3.5 sm:p-4 border-b border-border bg-muted/30">
          <h2 className="text-xs sm:text-sm font-semibold text-foreground">
            Recent orders
          </h2>
        </div>

        {/* Mobile View */}
        <div className="sm:hidden divide-y divide-border/60">
          {orders.map((ord) => (
            <div key={ord.id} className="p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">{ord.order_number}</span>
                <StatusBadge status={ord.status} />
              </div>
              <div className="text-xs text-muted-foreground">{ord.customer_name}</div>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span>{ord.items_count} items</span>
                <span className="font-semibold text-foreground">{formatCurrency(ord.total)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tablet & Desktop View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground bg-muted/20">
                <th className="py-2.5 px-4 font-medium">Order</th>
                <th className="py-2.5 px-4 font-medium">Customer</th>
                <th className="py-2.5 px-4 font-medium">Items</th>
                <th className="py-2.5 px-4 font-medium">Total</th>
                <th className="py-2.5 px-4 font-medium">Date</th>
                <th className="py-2.5 px-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-accent/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-foreground">{ord.order_number}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-foreground">{ord.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{ord.customer_email}</div>
                  </td>
                  <td className="py-3 px-4 text-foreground">{ord.items_count} items</td>
                  <td className="py-3 px-4 font-semibold text-foreground tabular-nums">
                    {formatCurrency(ord.total)}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
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
