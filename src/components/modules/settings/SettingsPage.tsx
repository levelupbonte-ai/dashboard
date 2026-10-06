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
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

export const SettingsPage: React.FC = () => {
  const { currentTenant } = useTenant();
  const { user, setUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'sessions'>('profile');

  // Profile Form
  const [fullName, setFullName] = useState(user.full_name);
  const [email, setEmail] = useState(user.email);
  const [profileSaved, setProfileSaved] = useState(false);

  // Security Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ ...user, full_name: fullName, email });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
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
        <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">Account & Security</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Access credentials, active sessions, and notification routes.
        </p>
      </div>

      {/* Settings Navigation Tabs (Scrollable on mobile) */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-border/80">
        {(
          [
            { id: 'profile', label: 'Profile', icon: <User className="size-3.5" /> },
            { id: 'security', label: 'Security & 2FA', icon: <Shield className="size-3.5" /> },
            { id: 'sessions', label: 'Sessions', icon: <Smartphone className="size-3.5" /> },
            { id: 'notifications', label: 'Notifications', icon: <Bell className="size-3.5" /> },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap min-h-[36px] ${
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

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="max-w-xl space-y-3.5 bg-card border border-border rounded-lg p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-3 pb-3 border-b border-border">
            <div className="size-10 rounded-lg bg-secondary text-secondary-foreground border border-border flex items-center justify-center text-foreground text-base font-bold font-mono">
              {fullName.charAt(0)}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">{fullName}</h2>
              <p className="text-xs text-muted-foreground font-mono">{email}</p>
              <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                Workspace: {currentTenant.name}
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
            label="Organization"
            value={currentTenant.name}
            disabled
            helperText="Organization boundary fixed by LevelUp multi-tenant provisioning."
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

      {/* Tab: Security & 2FA */}
      {activeTab === 'security' && (
        <div className="max-w-xl space-y-4">
          <form onSubmit={handleUpdatePassword} className="bg-card border border-border rounded-lg p-4 sm:p-5 shadow-xs space-y-3.5">
            <h2 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
              <Key className="size-4 text-muted-foreground" />
              Update Password
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

          {/* 2FA Card */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2">
                  <Lock className="size-3.5 text-muted-foreground" />
                  Two-Factor Authentication (2FA)
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Protect client data with time-based one-time password (TOTP) verification.
                </p>
              </div>

              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded border transition-colors shrink-0 min-h-[32px] ${
                  twoFactorEnabled
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700'
                    : 'bg-muted text-muted-foreground border-border hover:text-foreground'
                }`}
              >
                {twoFactorEnabled ? '2FA ENABLED' : 'ENABLE 2FA'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Sessions */}
      {activeTab === 'sessions' && (
        <div className="max-w-xl bg-card border border-border rounded-lg p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-border">
            <div>
              <h2 className="text-xs sm:text-sm font-semibold text-foreground">Authorized Sessions</h2>
              <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                Revoke unrecognized devices.
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

      {/* Tab: Notifications */}
      {activeTab === 'notifications' && (
        <div className="max-w-xl bg-card border border-border rounded-lg p-4 sm:p-5 shadow-xs space-y-3">
          <h2 className="text-xs sm:text-sm font-semibold text-foreground pb-2.5 border-b border-border">
            Event Alert Routes
          </h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-0.5 rounded border-border" />
              <div>
                <div className="font-medium text-foreground">Change Request Staging Deployments</div>
                <div className="text-muted-foreground text-[11px]">Email alert when changes hit staging.levelup.dev.</div>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-0.5 rounded border-border" />
              <div>
                <div className="font-medium text-foreground">Inbound Lead Captures</div>
                <div className="text-muted-foreground text-[11px]">Instant alert when a prospective client completes a website form.</div>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-0.5 rounded border-border" />
              <div>
                <div className="font-medium text-foreground">Monthly Core Web Vitals Audit Report</div>
                <div className="text-muted-foreground text-[11px]">Monthly PDF summary of uptime and performance scores.</div>
              </div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
