import React, { useState } from 'react';
import {
  User,
  Shield,
  Bell,
  Key,
  Smartphone,
  Save,
  CheckCircle,
  AlertTriangle,
  Lock,
  Building2,
  Users2,
  CreditCard,
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';
import { useAuth } from '../../../context/AuthContext';
import { ROLE_LABELS, ROLE_DESCRIPTIONS } from '../../../lib/permissions';
import { dataService } from '../../../services/dataService';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

export const SettingsPage: React.FC = () => {
  const { currentTenant } = useTenant();
  const { user, setUser, orgRole, can } = useAuth();

  const canViewBilling = can('billing.view');
  const canUpdateOrg = can('organization.update');

  const [activeTab, setActiveTab] = useState<
    'profile' | 'security' | 'notifications' | 'sessions' | 'organization' | 'billing-settings'
  >('profile');

  // My Account: Profile Form
  const [fullName, setFullName] = useState(user.full_name);
  const [email, setEmail] = useState(user.email);
  const [profileSaved, setProfileSaved] = useState(false);

  // Organization Profile Form
  const [orgName, setOrgName] = useState(currentTenant.name);
  const [orgEmail, setOrgEmail] = useState(currentTenant.company_email);
  const [orgSaved, setOrgSaved] = useState(false);

  // Security Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(Boolean(user.mfa_enabled));
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Sessions
  const [sessions, setSessions] = useState([
    {
      id: 'sess-1',
      device: 'MacBook Pro · Chrome 129',
      ip: '72.19.144.102',
      location: 'Boston, MA (Current)',
      isCurrent: true,
      lastActive: 'Active now',
    },
    {
      id: 'sess-2',
      device: 'iPhone 16 Pro · Safari Mobile',
      ip: '172.56.21.9',
      location: 'Boston, MA',
      isCurrent: false,
      lastActive: '2 hours ago',
    },
  ]);

  const members = dataService.getOrganizationMembers(currentTenant.id);
  const invoices = dataService.getInvoices(currentTenant.id);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ ...user, full_name: fullName, email });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleSaveOrgProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canUpdateOrg) return;
    dataService.logOrganizationActivity(currentTenant.id, {
      actor_name: user.full_name,
      actor_email: user.email,
      actor_role: orgRole,
      action: 'updated organization profile settings for',
      target: orgName,
      category: 'security',
    });
    setOrgSaved(true);
    setTimeout(() => setOrgSaved(false), 2500);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (newPassword.length < 12) {
      setPasswordError('Password must be at least 12 characters');
      return;
    }
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 2500);
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="pb-3 sm:pb-4 border-b border-border">
        <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">Settings</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage your personal account, organization settings for{' '}
          <strong className="text-foreground">{currentTenant.name}</strong>, and authorized billing preferences.
        </p>
      </div>

      {/* Grouped Settings Navigation: MY ACCOUNT / ORGANIZATION / BILLING */}
      <div className="space-y-2 border-b border-border/80 pb-3">
        <div className="flex flex-wrap items-center gap-4">
          {/* Group 1: MY ACCOUNT */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-1">
              My Account
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {(
                [
                  { id: 'profile', label: 'Profile', icon: <User className="size-3.5" /> },
                  { id: 'security', label: 'Security & MFA', icon: <Shield className="size-3.5" /> },
                  { id: 'notifications', label: 'Notifications', icon: <Bell className="size-3.5" /> },
                  { id: 'sessions', label: 'Sessions', icon: <Smartphone className="size-3.5" /> },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap min-h-[34px] ${
                    activeTab === tab.id
                      ? 'bg-accent text-accent-foreground font-semibold shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Group 2: ORGANIZATION */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-1">
              Organization
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('organization')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap min-h-[34px] ${
                  activeTab === 'organization'
                    ? 'bg-accent text-accent-foreground font-semibold shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Building2 className="size-3.5" />
                <span>Organization & Permissions</span>
              </button>
            </div>
          </div>

          {/* Group 3: BILLING (Only shown if authorized) */}
          {canViewBilling && (
            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-1">
                Billing
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('billing-settings')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap min-h-[34px] ${
                    activeTab === 'billing-settings'
                      ? 'bg-accent text-accent-foreground font-semibold shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <CreditCard className="size-3.5" />
                  <span>Subscription & Payment Settings</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tab: My Account -> Profile */}
      {activeTab === 'profile' && (
        <form
          onSubmit={handleSaveProfile}
          className="max-w-xl space-y-3.5 bg-card border border-border rounded-lg p-4 sm:p-5 shadow-xs"
        >
          <div className="flex items-center gap-3 pb-3 border-b border-border">
            <div className="size-10 rounded-lg bg-secondary text-secondary-foreground border border-border flex items-center justify-center text-foreground text-base font-bold font-mono">
              {fullName.charAt(0)}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">{fullName}</h2>
              <p className="text-xs text-muted-foreground font-mono">{email}</p>
              <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                Organization: {currentTenant.name} · Role: {ROLE_LABELS[orgRole]}
              </div>
            </div>
          </div>

          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Organization Role"
            value={`${ROLE_LABELS[orgRole]} (${orgRole})`}
            disabled
            helperText={ROLE_DESCRIPTIONS[orgRole]}
          />

          <div className="flex items-center justify-between pt-2.5 border-t border-border">
            {profileSaved && (
              <span className="text-xs text-emerald-500 flex items-center gap-1 font-mono">
                <CheckCircle className="size-3.5" /> Saved
              </span>
            )}
            <div className="ml-auto">
              <Button type="submit" variant="primary" size="sm" icon={<Save className="size-3.5" />}>
                Save Profile
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Tab: My Account -> Security & MFA */}
      {activeTab === 'security' && (
        <div className="max-w-xl space-y-4">
          <form
            onSubmit={handleUpdatePassword}
            className="bg-card border border-border rounded-lg p-4 sm:p-5 shadow-xs space-y-3.5"
          >
            <h2 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
              <Key className="size-4 text-muted-foreground" />
              Update Password (Supabase Auth)
            </h2>

            {passwordError && (
              <div className="p-2.5 rounded-md bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
                <AlertTriangle className="size-3.5 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <Input
              label="New Password"
              type="password"
              placeholder="Minimum 12 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between pt-2.5 border-t border-border">
              {passwordSuccess && (
                <span className="text-xs text-emerald-500 flex items-center gap-1 font-mono">
                  <CheckCircle className="size-3.5" /> Password updated
                </span>
              )}
              <div className="ml-auto">
                <Button type="submit" variant="primary" size="sm">
                  Update Password
                </Button>
              </div>
            </div>
          </form>

          {/* MFA Card */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2">
                  <Lock className="size-3.5 text-muted-foreground" />
                  Multi-Factor Authentication (MFA / TOTP)
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Required for sensitive organization operations (ownership transfer, security changes, billing updates).
                </p>
              </div>

              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded border transition-colors shrink-0 min-h-[32px] ${
                  twoFactorEnabled
                    ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/40'
                    : 'bg-muted text-muted-foreground border-border hover:text-foreground'
                }`}
              >
                {twoFactorEnabled ? 'MFA ENABLED' : 'ENABLE MFA'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: My Account -> Sessions */}
      {activeTab === 'sessions' && (
        <div className="max-w-xl bg-card border border-border rounded-lg p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-border">
            <div>
              <h2 className="text-xs sm:text-sm font-semibold text-foreground">
                Authorized Device Sessions
              </h2>
              <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                HTTPS-only · SameSite protected · Revoke unrecognized sessions immediately.
              </p>
            </div>
            {sessions.length > 1 && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setSessions(sessions.filter((s) => s.isCurrent))}
              >
                Revoke others
              </Button>
            )}
          </div>

          <div className="divide-y divide-border/50">
            {sessions.map((sess) => (
              <div key={sess.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <span>{sess.device}</span>
                    {sess.isCurrent && (
                      <span className="px-1 py-0.5 text-[9px] font-mono uppercase bg-muted text-emerald-500 border border-border rounded">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono">
                    {sess.location} · {sess.ip} · {sess.lastActive}
                  </div>
                </div>

                {!sess.isCurrent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRevokeSession(sess.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: My Account -> Notifications */}
      {activeTab === 'notifications' && (
        <div className="max-w-xl bg-card border border-border rounded-lg p-4 sm:p-5 shadow-xs space-y-3">
          <h2 className="text-xs sm:text-sm font-semibold text-foreground pb-2.5 border-b border-border">
            Permission-Scoped Notification Preferences
          </h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-0.5 rounded border-border" />
              <div>
                <div className="font-medium text-foreground">Website Request Updates</div>
                <div className="text-muted-foreground text-[11px]">
                  Notify when a website request is assigned or completed.
                </div>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-0.5 rounded border-border" />
              <div>
                <div className="font-medium text-foreground">Inbound Lead Captures</div>
                <div className="text-muted-foreground text-[11px]">
                  Instant alert when a prospective client submits a form on your website.
                </div>
              </div>
            </label>

            {canViewBilling && (
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded border-border" />
                <div>
                  <div className="font-medium text-foreground">
                    Organization Subscription & Invoice Alerts
                  </div>
                  <div className="text-muted-foreground text-[11px]">
                    Sent only to members with billing.view permission ({ROLE_LABELS[orgRole]}).
                  </div>
                </div>
              </label>
            )}
          </div>
        </div>
      )}

      {/* Tab: Organization -> Organization Profile & Team Summary */}
      {activeTab === 'organization' && (
        <div className="max-w-xl space-y-4">
          <form
            onSubmit={handleSaveOrgProfile}
            className="bg-card border border-border rounded-lg p-4 sm:p-5 shadow-xs space-y-3.5"
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-border">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Organization Profile</h2>
                <p className="text-[11px] text-muted-foreground font-mono">
                  Primary tenant boundary ({currentTenant.id})
                </p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase rounded bg-muted border border-border text-foreground">
                {members.length} Team Members
              </span>
            </div>

            <Input
              label="Organization Name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              disabled={!canUpdateOrg}
              required
            />

            <Input
              label="Organization Contact Email"
              type="email"
              value={orgEmail}
              onChange={(e) => setOrgEmail(e.target.value)}
              disabled={!canUpdateOrg}
              required
            />

            <Input
              label="Workspace Slug"
              value={currentTenant.slug}
              disabled
              helperText="Used for PostgreSQL Row Level Security tenant isolation."
            />

            {canUpdateOrg ? (
              <div className="flex items-center justify-between pt-2.5 border-t border-border">
                {orgSaved && (
                  <span className="text-xs text-emerald-500 flex items-center gap-1 font-mono">
                    <CheckCircle className="size-3.5" /> Organization updated
                  </span>
                )}
                <div className="ml-auto">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    icon={<Save className="size-3.5" />}
                  >
                    Save Organization
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-[11px] font-mono text-muted-foreground pt-2 border-t border-border">
                Read-only view: Only Organization Owners and Admins (`organization.update`) can modify organization settings.
              </div>
            )}
          </form>
        </div>
      )}

      {/* Tab: Billing -> Subscription & Invoices Summary */}
      {activeTab === 'billing-settings' && canViewBilling && (
        <div className="max-w-xl bg-card border border-border rounded-lg p-4 sm:p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-border">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Organization Billing Configuration
              </h2>
              <p className="text-[11px] text-muted-foreground font-mono">
                Associated with organization_id ({currentTenant.id}), never an individual user.
              </p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-mono uppercase rounded bg-emerald-500/10 text-emerald-500 font-bold">
              {currentTenant.care_plan.toUpperCase()} PLAN
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">Stripe Customer ID</span>
              <span className="font-mono text-foreground">
                {currentTenant.stripe_customer_id || 'cus_configured'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">Recorded Invoices</span>
              <span className="font-mono text-foreground">{invoices.length} invoices</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-muted-foreground">Card Storage Policy</span>
              <span className="font-mono text-emerald-500">Stripe Vault Only (No raw cards in DB)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
