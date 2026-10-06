import React, { useState } from 'react';
import {
  ShieldAlert,
  Users2,
  FileCode2,
  DollarSign,
  Server,
  ArrowRight,
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';
import { useAuth } from '../../../context/AuthContext';
import { dataService } from '../../../services/dataService';
import { Button } from '../../ui/Button';
import { StatusBadge } from '../../ui/StatusBadge';
import { MetricCard } from '../../shared/MetricCard';
import { Tenant, RequestStatus } from '../../../types';
import { formatDateTime } from '../../../lib/utils';

interface AdminPageProps {
  onSwitchToTenant: (tenantId: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onSwitchToTenant }) => {
  const { tenants, refreshTenantData } = useTenant();
  const { role } = useAuth();

  const [activeAdminTab, setActiveAdminTab] = useState<'roster' | 'queue' | 'audit'>('roster');

  const allRequests = dataService.getAllRequestsAcrossTenants();
  const auditLogs = dataService.getAuditLogs();

  const handleToggleFeature = (tenantId: string, featureKey: keyof Tenant['features'], currentValue: boolean) => {
    dataService.updateTenantFeatures(tenantId, {
      [featureKey]: !currentValue,
    });
    refreshTenantData();
  };

  const handleAdminStatusUpdate = (tenantId: string, requestId: string, newStatus: RequestStatus) => {
    dataService.updateRequestStatus(tenantId, requestId, newStatus);
    refreshTenantData();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary font-bold">
            <ShieldAlert className="size-3.5" />
            <span>LevelUp Agency Master Console</span>
            <span className="px-1.5 py-0.5 rounded bg-muted border border-border text-foreground font-semibold">
              {role.toUpperCase()}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight mt-1">
            Global Agency Operations
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cross-tenant entitlement toggles, master change queue, and audit ledger.
          </p>
        </div>
      </div>

      {/* Admin KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        <MetricCard
          title="Clients"
          value={tenants.length.toString()}
          subValue="Isolated databases"
          change="100% active"
          changeType="positive"
          icon={<Users2 className="size-3.5 text-foreground" />}
        />
        <MetricCard
          title="Care MRR"
          value="$5,340"
          subValue="Monthly run-rate"
          change="+14.8%"
          changeType="positive"
          icon={<DollarSign className="size-3.5 text-emerald-500" />}
        />
        <MetricCard
          title="Master Queue"
          value={allRequests.filter((r) => r.status !== 'completed').length.toString()}
          subValue="Across all tenants"
          change="3 in progress"
          changeType="neutral"
          icon={<FileCode2 className="size-3.5 text-foreground" />}
        />
        <MetricCard
          title="Security"
          value="ENFORCED"
          subValue="PostgreSQL RLS"
          change="Passed"
          changeType="positive"
          icon={<Server className="size-3.5 text-emerald-500" />}
        />
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-border/80">
        <button
          onClick={() => setActiveAdminTab('roster')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap min-h-[36px] ${
            activeAdminTab === 'roster'
              ? 'bg-accent text-accent-foreground font-semibold shadow-2xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users2 className="size-3.5" />
          <span>Client Roster & Feature Flags</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('queue')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap min-h-[36px] ${
            activeAdminTab === 'queue'
              ? 'bg-accent text-accent-foreground font-semibold shadow-2xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileCode2 className="size-3.5" />
          <span>Cross-Tenant Queue ({allRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('audit')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap min-h-[36px] ${
            activeAdminTab === 'audit'
              ? 'bg-accent text-accent-foreground font-semibold shadow-2xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Server className="size-3.5" />
          <span>Security Audit Ledger</span>
        </button>
      </div>

      {/* Tab: Client Roster & Feature Flags */}
      {activeAdminTab === 'roster' && (
        <div className="space-y-3">
          <div className="p-3 rounded-md bg-muted/40 border border-border text-xs text-foreground">
            <strong>Dynamic Entitlement Engine:</strong> Toggling services below immediately reconfigures the client's navigation bar and database permissions.
          </div>

          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-xs">
            {/* Mobile View */}
            <div className="sm:hidden divide-y divide-border/60">
              {tenants.map((t) => (
                <div key={t.id} className="p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-foreground text-xs">{t.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{t.slug}</div>
                    </div>
                    <span className="text-[10px] font-mono uppercase text-foreground px-1.5 py-0.5 bg-muted border border-border rounded">
                      {t.care_plan}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      onClick={() => handleToggleFeature(t.id, 'has_bookings', t.features.has_bookings)}
                      className={`px-2 py-1 text-[10px] font-mono rounded border transition-colors ${
                        t.features.has_bookings
                          ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30 font-bold'
                          : 'bg-muted text-muted-foreground border-border'
                      }`}
                    >
                      Bookings: {t.features.has_bookings ? 'ON' : 'OFF'}
                    </button>
                    <button
                      onClick={() => handleToggleFeature(t.id, 'has_ecommerce', t.features.has_ecommerce)}
                      className={`px-2 py-1 text-[10px] font-mono rounded border transition-colors ${
                        t.features.has_ecommerce
                          ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30 font-bold'
                          : 'bg-muted text-muted-foreground border-border'
                      }`}
                    >
                      Store: {t.features.has_ecommerce ? 'ON' : 'OFF'}
                    </button>
                    <button
                      onClick={() => handleToggleFeature(t.id, 'has_seo', t.features.has_seo)}
                      className={`px-2 py-1 text-[10px] font-mono rounded border transition-colors ${
                        t.features.has_seo
                          ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30 font-bold'
                          : 'bg-muted text-muted-foreground border-border'
                      }`}
                    >
                      SEO: {t.features.has_seo ? 'ON' : 'OFF'}
                    </button>
                    <button
                      onClick={() => handleToggleFeature(t.id, 'has_care_plan', t.features.has_care_plan)}
                      className={`px-2 py-1 text-[10px] font-mono rounded border transition-colors ${
                        t.features.has_care_plan
                          ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30 font-bold'
                          : 'bg-muted text-muted-foreground border-border'
                      }`}
                    >
                      Care: {t.features.has_care_plan ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onSwitchToTenant(t.id)}
                      icon={<ArrowRight className="size-3" />}
                    >
                      Switch to Workspace
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Tablet & Desktop View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-mono uppercase text-[10px]">
                    <th className="py-2.5 px-3.5 font-medium">Organization</th>
                    <th className="py-2.5 px-3.5 font-medium">Care Tier</th>
                    <th className="py-2.5 px-3.5 font-medium">Bookings</th>
                    <th className="py-2.5 px-3.5 font-medium">Store</th>
                    <th className="py-2.5 px-3.5 font-medium">SEO</th>
                    <th className="py-2.5 px-3.5 font-medium">Care</th>
                    <th className="py-2.5 px-3.5 font-medium text-right">Switch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {tenants.map((t) => (
                    <tr key={t.id} className="hover:bg-accent/40 transition-colors">
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-foreground">{t.name}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{t.slug}</div>
                      </td>

                      <td className="py-3 px-3.5 font-mono uppercase text-foreground font-semibold">
                        {t.care_plan}
                      </td>

                      <td className="py-3 px-3.5">
                        <button
                          onClick={() => handleToggleFeature(t.id, 'has_bookings', t.features.has_bookings)}
                          className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-colors ${
                            t.features.has_bookings
                              ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30 font-bold'
                              : 'bg-muted text-muted-foreground border-border hover:text-foreground'
                          }`}
                        >
                          {t.features.has_bookings ? 'ON' : 'OFF'}
                        </button>
                      </td>

                      <td className="py-3 px-3.5">
                        <button
                          onClick={() => handleToggleFeature(t.id, 'has_ecommerce', t.features.has_ecommerce)}
                          className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-colors ${
                            t.features.has_ecommerce
                              ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30 font-bold'
                              : 'bg-muted text-muted-foreground border-border hover:text-foreground'
                          }`}
                        >
                          {t.features.has_ecommerce ? 'ON' : 'OFF'}
                        </button>
                      </td>

                      <td className="py-3 px-3.5">
                        <button
                          onClick={() => handleToggleFeature(t.id, 'has_seo', t.features.has_seo)}
                          className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-colors ${
                            t.features.has_seo
                              ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30 font-bold'
                              : 'bg-muted text-muted-foreground border-border hover:text-foreground'
                          }`}
                        >
                          {t.features.has_seo ? 'ON' : 'OFF'}
                        </button>
                      </td>

                      <td className="py-3 px-3.5">
                        <button
                          onClick={() => handleToggleFeature(t.id, 'has_care_plan', t.features.has_care_plan)}
                          className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-colors ${
                            t.features.has_care_plan
                              ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30 font-bold'
                              : 'bg-muted text-muted-foreground border-border hover:text-foreground'
                          }`}
                        >
                          {t.features.has_care_plan ? 'ON' : 'OFF'}
                        </button>
                      </td>

                      <td className="py-3 px-3.5 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onSwitchToTenant(t.id)}
                          icon={<ArrowRight className="size-3" />}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Cross-Tenant Queue */}
      {activeAdminTab === 'queue' && (
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-xs">
          {/* Mobile Card List */}
          <div className="sm:hidden divide-y divide-border/60">
            {allRequests.map((req) => (
              <div key={req.id} className="p-3.5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-foreground text-xs">{req.title}</div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                      {req.clientName} · {req.website_name}
                    </div>
                  </div>
                  <StatusBadge status={req.status} />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground">
                    {req.priority}
                  </span>
                  <select
                    value={req.status}
                    onChange={(e) =>
                      handleAdminStatusUpdate(req.tenant_id, req.id, e.target.value as RequestStatus)
                    }
                    className="bg-card text-xs text-foreground border border-border rounded px-2 py-1 font-mono"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="in_review">In Review</option>
                    <option value="in_progress">In Progress</option>
                    <option value="waiting_for_client">Waiting for Client</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Tablet/Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-mono uppercase text-[10px]">
                  <th className="py-2.5 px-4 font-medium">Request</th>
                  <th className="py-2.5 px-4 font-medium">Client</th>
                  <th className="py-2.5 px-4 font-medium">Priority</th>
                  <th className="py-2.5 px-4 font-medium">Status</th>
                  <th className="py-2.5 px-4 font-medium">Created</th>
                  <th className="py-2.5 px-4 font-medium text-right">Triage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {allRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-accent/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground">{req.title}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{req.website_name}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">{req.clientName}</td>
                    <td className="py-3 px-4 font-mono uppercase text-foreground font-semibold">
                      {req.priority}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="py-3 px-4 font-mono text-muted-foreground text-[11px]">
                      {formatDateTime(req.created_at)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={req.status}
                        onChange={(e) =>
                          handleAdminStatusUpdate(req.tenant_id, req.id, e.target.value as RequestStatus)
                        }
                        className="bg-card text-xs text-foreground border border-border rounded px-2 py-1 font-mono"
                      >
                        <option value="submitted">Submitted</option>
                        <option value="in_review">In Review</option>
                        <option value="in_progress">In Progress</option>
                        <option value="waiting_for_client">Waiting for Client</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Security Audit */}
      {activeAdminTab === 'audit' && (
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-xs">
          <div className="p-3.5 border-b border-border bg-muted/40 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
              Security Event Ledger
            </h2>
            <span className="text-[10px] font-mono text-emerald-500">
              CRYPTOGRAPHIC SEQUENCE
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-mono uppercase text-[10px] bg-muted/20">
                  <th className="py-2.5 px-4 font-medium">Timestamp</th>
                  <th className="py-2.5 px-4 font-medium">Actor</th>
                  <th className="py-2.5 px-4 font-medium">Action</th>
                  <th className="py-2.5 px-4 font-medium">Target</th>
                  <th className="py-2.5 px-4 font-medium font-mono">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-accent/40 transition-colors">
                    <td className="py-2.5 px-4 font-mono text-muted-foreground text-[11px]">
                      {formatDateTime(log.timestamp)}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-foreground">{log.actor_name}</td>
                    <td className="py-2.5 px-4 font-mono text-emerald-500 font-bold">
                      {log.action}
                    </td>
                    <td className="py-2.5 px-4 text-muted-foreground font-mono text-[11px]">
                      {log.target}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-muted-foreground text-[11px]">
                      {log.ip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
