import React, { useState } from 'react';
import {
  Users2,
  UserPlus,
  ShieldCheck,
  Mail,
  Clock,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Activity,
  KeyRound,
  Check,
  X,
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';
import { useAuth } from '../../../context/AuthContext';
import { dataService } from '../../../services/dataService';
import {
  OrganizationMember,
  OrganizationRole,
  Permission,
} from '../../../types';
import {
  ROLE_LABELS,
  ROLE_DESCRIPTIONS,
  ROLE_PERMISSIONS,
  canAssignRole,
  canModifyOrRemoveMember,
} from '../../../lib/permissions';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Modal';
import { Input } from '../../ui/Input';
import { formatTimeAgo, formatDate } from '../../../lib/utils';

export const TeamPage: React.FC = () => {
  const { currentTenant } = useTenant();
  const { user, orgRole, can } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState<'members' | 'invitations' | 'activity' | 'permissions'>('members');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<OrganizationRole>('MEMBER');
  const [bannerMessage, setBannerMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [memberToConfirmRemove, setMemberToConfirmRemove] = useState<OrganizationMember | null>(null);
  const [, setTick] = useState(0);

  const members = dataService.getOrganizationMembers(currentTenant.id);
  const invitations = dataService.getOrganizationInvitations(currentTenant.id);
  const activities = dataService.getOrganizationActivity(currentTenant.id);

  const canInvite = can('team.invite');
  const canUpdateTeam = can('team.update');
  const canRemoveTeam = can('team.remove');

  const forceRefresh = () => setTick((t) => t + 1);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setBannerMessage(null);

    if (!canInvite) {
      setBannerMessage({
        type: 'error',
        text: 'Unauthorized: Your organization role does not have team.invite permission.',
      });
      return;
    }

    if (!canAssignRole(orgRole, inviteRole)) {
      setBannerMessage({
        type: 'error',
        text: `Role escalation blocked: ${orgRole} cannot invite a user with ${inviteRole} role.`,
      });
      return;
    }

    const cleanEmail = inviteEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setBannerMessage({ type: 'error', text: 'Please enter a valid work email address.' });
      return;
    }

    if (members.some((m) => m.email.toLowerCase() === cleanEmail)) {
      setBannerMessage({
        type: 'error',
        text: `${cleanEmail} is already a member of ${currentTenant.name}.`,
      });
      return;
    }

    dataService.inviteOrganizationMember(
      currentTenant.id,
      cleanEmail,
      inviteRole,
      user.full_name,
      user.email,
      orgRole
    );

    setInviteEmail('');
    setInviteRole('MEMBER');
    setIsInviteModalOpen(false);
    setActiveSubTab('invitations');
    setBannerMessage({
      type: 'success',
      text: `Single-use expiring invitation sent to ${cleanEmail} (${ROLE_LABELS[inviteRole]}). Tied strictly to organization ${currentTenant.name}.`,
    });
    forceRefresh();
  };

  const handleRoleChange = (member: OrganizationMember, newRole: OrganizationRole) => {
    setBannerMessage(null);
    const check = canModifyOrRemoveMember(orgRole, member, members, newRole);
    if (!check.allowed) {
      setBannerMessage({ type: 'error', text: check.reason || 'Operation not permitted.' });
      return;
    }

    dataService.updateOrganizationMemberRole(
      currentTenant.id,
      member.id,
      newRole,
      user.full_name,
      user.email,
      orgRole
    );
    setBannerMessage({
      type: 'success',
      text: `Updated ${member.full_name}'s role to ${ROLE_LABELS[newRole]}. Logged in organization activity.`,
    });
    forceRefresh();
  };

  const handleConfirmRemoveMember = () => {
    if (!memberToConfirmRemove) return;
    const check = canModifyOrRemoveMember(orgRole, memberToConfirmRemove, members);
    if (!check.allowed) {
      setBannerMessage({ type: 'error', text: check.reason || 'Cannot remove member.' });
      setMemberToConfirmRemove(null);
      return;
    }

    dataService.removeOrganizationMember(
      currentTenant.id,
      memberToConfirmRemove.id,
      user.full_name,
      user.email,
      orgRole
    );
    setBannerMessage({
      type: 'success',
      text: `Removed ${memberToConfirmRemove.full_name} from ${currentTenant.name}.`,
    });
    setMemberToConfirmRemove(null);
    forceRefresh();
  };

  const handleRevokeInvite = (invitationId: string) => {
    if (!canInvite) return;
    dataService.revokeOrganizationInvitation(
      currentTenant.id,
      invitationId,
      user.full_name,
      user.email,
      orgRole
    );
    setBannerMessage({
      type: 'success',
      text: 'Invitation token revoked and invalidated.',
    });
    forceRefresh();
  };

  const getRoleBadgeStyle = (r: OrganizationRole) => {
    switch (r) {
      case 'OWNER':
        return 'bg-primary text-primary-foreground border-primary font-bold';
      case 'ADMIN':
        return 'bg-accent text-accent-foreground border-border font-semibold';
      case 'MEMBER':
        return 'bg-muted text-foreground border-border';
      case 'VIEWER':
        return 'bg-muted/50 text-muted-foreground border-border';
    }
  };

  const allPermissionsList: { id: Permission; label: string; group: string }[] = [
    { id: 'organization.view', label: 'View organization profile', group: 'Organization' },
    { id: 'organization.update', label: 'Update organization settings', group: 'Organization' },
    { id: 'organization.delete', label: 'Delete / transfer organization', group: 'Organization' },
    { id: 'team.view', label: 'View team members & activity', group: 'Team' },
    { id: 'team.invite', label: 'Invite new members', group: 'Team' },
    { id: 'team.update', label: 'Manage member roles', group: 'Team' },
    { id: 'team.remove', label: 'Remove members', group: 'Team' },
    { id: 'website.view', label: 'View organization websites', group: 'Websites & Requests' },
    { id: 'website.update', label: 'Manage website configurations', group: 'Websites & Requests' },
    { id: 'requests.create', label: 'Create website change requests', group: 'Websites & Requests' },
    { id: 'requests.manage', label: 'Approve / manage requests', group: 'Websites & Requests' },
    { id: 'leads.view', label: 'View inbound leads & bookings', group: 'Business & Analytics' },
    { id: 'leads.manage', label: 'Update lead & booking statuses', group: 'Business & Analytics' },
    { id: 'analytics.view', label: 'View traffic & SEO telemetry', group: 'Business & Analytics' },
    { id: 'billing.view', label: 'View invoices & subscription', group: 'Billing & Support' },
    { id: 'billing.manage', label: 'Pay invoices & upgrade plan', group: 'Billing & Support' },
    { id: 'support.create', label: 'Create & reply to support tickets', group: 'Billing & Support' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Team</h1>
            <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded-md bg-muted border border-border text-foreground">
              {members.length} {members.length === 1 ? 'member' : 'members'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage organization members, role-based permissions, invitations, and activity for{' '}
            <strong className="text-foreground">{currentTenant.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1.5 rounded-lg bg-card border border-border text-xs font-mono text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-primary" />
            <span>Your Role:</span>
            <strong className="text-foreground">{ROLE_LABELS[orgRole]}</strong>
          </div>

          {canInvite && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsInviteModalOpen(true)}
              icon={<UserPlus className="size-3.5" />}
            >
              Invite member
            </Button>
          )}
        </div>
      </div>

      {/* Feedback Banner */}
      {bannerMessage && (
        <div
          className={`p-3 rounded-lg border flex items-start justify-between gap-3 text-xs animate-in fade-in duration-150 ${
            bannerMessage.type === 'error'
              ? 'bg-destructive/10 border-destructive/30 text-destructive'
              : 'bg-card border-border text-foreground'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {bannerMessage.type === 'error' ? (
              <AlertTriangle className="size-4 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            )}
            <span className="leading-relaxed">{bannerMessage.text}</span>
          </div>
          <button
            onClick={() => setBannerMessage(null)}
            className="text-muted-foreground hover:text-foreground font-mono"
          >
            ✕
          </button>
        </div>
      )}

      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-border/80 scrollbar-none">
        {(
          [
            { id: 'members', label: `Organization Members (${members.length})`, icon: Users2 },
            {
              id: 'invitations',
              label: `Pending Invitations (${invitations.filter((i) => i.status === 'pending').length})`,
              icon: Mail,
            },
            { id: 'activity', label: `Team Activity (${activities.length})`, icon: Activity },
            { id: 'permissions', label: 'Role Permissions Matrix', icon: KeyRound },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap min-h-[36px] ${
                isActive
                  ? 'bg-accent text-accent-foreground font-semibold shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="size-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: MEMBERS */}
      {activeSubTab === 'members' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-xs divide-y divide-border/70">
            {members.map((member) => {
              const isLastOwner =
                member.org_role === 'OWNER' &&
                members.filter((m) => m.org_role === 'OWNER').length <= 1;

              return (
                <div
                  key={member.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <Users2 className="size-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-foreground">
                          {member.full_name}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded border ${getRoleBadgeStyle(
                            member.org_role
                          )}`}
                        >
                          {ROLE_LABELS[member.org_role]}
                        </span>
                        {member.mfa_enabled && (
                          <span className="px-1.5 py-0.5 text-[10px] font-mono text-emerald-500 bg-emerald-500/10 rounded flex items-center gap-1">
                            <Lock className="size-2.5" /> MFA
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-mono text-muted-foreground truncate">
                        {member.email} {member.title ? `· ${member.title}` : ''}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        Joined {formatDate(member.joined_at)} · Active {formatTimeAgo(member.last_active_at)}
                      </div>
                    </div>
                  </div>

                  {/* Role & Member Controls */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {canUpdateTeam ? (
                      <select
                        value={member.org_role}
                        onChange={(e) =>
                          handleRoleChange(member, e.target.value as OrganizationRole)
                        }
                        disabled={isLastOwner && orgRole !== 'OWNER'}
                        className="bg-background border border-border rounded-md px-2.5 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:border-primary min-h-[34px]"
                        title="Change organization role"
                      >
                        {(['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'] as OrganizationRole[]).map(
                          (r) => (
                            <option
                              key={r}
                              value={r}
                              disabled={!canAssignRole(orgRole, r)}
                            >
                              {ROLE_LABELS[r]}
                            </option>
                          )
                        )}
                      </select>
                    ) : (
                      <span className="text-xs font-mono text-muted-foreground px-2">
                        {ROLE_LABELS[member.org_role]}
                      </span>
                    )}

                    {canRemoveTeam && (
                      <button
                        onClick={() => setMemberToConfirmRemove(member)}
                        disabled={isLastOwner}
                        className={`p-2 rounded-md border transition-colors min-h-[34px] ${
                          isLastOwner
                            ? 'border-border/40 text-muted-foreground/40 cursor-not-allowed'
                            : 'border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/10'
                        }`}
                        title={
                          isLastOwner
                            ? 'Owner protection: Cannot remove the last Owner of the organization'
                            : `Remove ${member.full_name}`
                        }
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Security & Isolation Notice */}
          <div className="p-3.5 rounded-lg border border-border bg-card flex items-start gap-2.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground">
                Organization Boundary & Owner Protection
              </span>
              <p className="mt-0.5 text-[11px] leading-relaxed">
                All team members are strictly scoped to <strong>{currentTenant.name}</strong> via PostgreSQL Row Level Security. The last Organization Owner cannot be removed or demoted without transferring ownership first.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INVITATIONS */}
      {activeSubTab === 'invitations' && (
        <div className="space-y-4">
          {invitations.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-8 text-center space-y-2">
              <Mail className="size-6 text-muted-foreground mx-auto" />
              <div className="text-sm font-semibold text-foreground">No invitations sent</div>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Invite colleagues to collaborate on {currentTenant.name} websites, leads, requests, and analytics.
              </p>
              {canInvite && (
                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsInviteModalOpen(true)}
                    icon={<UserPlus className="size-3.5" />}
                  >
                    Invite member
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-xs divide-y divide-border/70">
              {invitations.map((inv) => (
                <div
                  key={inv.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-mono font-semibold text-foreground">
                        {inv.email}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded border ${getRoleBadgeStyle(
                          inv.org_role
                        )}`}
                      >
                        {ROLE_LABELS[inv.org_role]}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded ${
                          inv.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-muted-foreground">
                      Invited by {inv.invited_by_name} · Token: {inv.token_preview}
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3" />
                      <span>Expires {formatDate(inv.expires_at)} (Single-use organization link)</span>
                    </div>
                  </div>

                  {inv.status === 'pending' && canInvite && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevokeInvite(inv.id)}
                      className="text-destructive hover:text-destructive self-end sm:self-center"
                    >
                      Revoke Invitation
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TEAM ACTIVITY HISTORY */}
      {activeSubTab === 'activity' && (
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-xs">
          <div className="p-3.5 sm:p-4 border-b border-border bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-primary" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
                Organization Activity Log (WHO · DID WHAT · TO WHAT · WHEN)
              </h2>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              Immutable Audit Trail
            </span>
          </div>

          <div className="divide-y divide-border/60">
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-accent/20 transition-colors"
              >
                <div className="space-y-0.5 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <strong className="text-foreground font-semibold">{act.actor_name}</strong>
                    <span className="px-1.5 py-0.2 text-[9px] font-mono uppercase rounded bg-muted border border-border text-muted-foreground">
                      {act.actor_role}
                    </span>
                    <span className="text-muted-foreground">{act.action}</span>
                    <strong className="text-foreground font-mono">{act.target}</strong>
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground">
                    Actor: {act.actor_email} · Organization: {currentTenant.name}
                  </div>
                </div>
                <div className="text-[11px] font-mono text-muted-foreground shrink-0">
                  {formatTimeAgo(act.created_at)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PERMISSIONS MATRIX */}
      {activeSubTab === 'permissions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'] as OrganizationRole[]).map((r) => (
              <div
                key={r}
                className={`p-4 rounded-lg border bg-card space-y-1.5 ${
                  orgRole === r ? 'border-primary ring-1 ring-primary/30' : 'border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded border ${getRoleBadgeStyle(
                      r
                    )}`}
                  >
                    {ROLE_LABELS[r]}
                  </span>
                  {orgRole === r && (
                    <span className="text-[10px] font-mono text-primary font-semibold">
                      Active Role
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {ROLE_DESCRIPTIONS[r]}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-lg overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 font-mono text-[10px] uppercase text-muted-foreground">
                  <th className="py-2.5 px-4">Permission Scope</th>
                  <th className="py-2.5 px-4 text-center">Owner</th>
                  <th className="py-2.5 px-4 text-center">Admin</th>
                  <th className="py-2.5 px-4 text-center">Member</th>
                  <th className="py-2.5 px-4 text-center">Viewer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {allPermissionsList.map((perm) => (
                  <tr key={perm.id} className="hover:bg-accent/20">
                    <td className="py-2.5 px-4">
                      <div className="font-medium text-foreground">{perm.label}</div>
                      <div className="text-[10px] font-mono text-muted-foreground">{perm.id}</div>
                    </td>
                    {(['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'] as OrganizationRole[]).map((r) => {
                      const allowed = ROLE_PERMISSIONS[r].includes(perm.id);
                      return (
                        <td key={r} className="py-2.5 px-4 text-center">
                          {allowed ? (
                            <Check className="size-4 text-emerald-500 mx-auto" />
                          ) : (
                            <X className="size-3.5 text-muted-foreground/30 mx-auto" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title={`Invite Member to ${currentTenant.name}`}
        description="Send a cryptographically signed, single-use invitation link scoped to your organization."
        maxWidth="md"
      >
        <form onSubmit={handleSendInvite} className="space-y-4">
          <Input
            label="Colleague Email Address"
            type="email"
            placeholder="colleague@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Organization Role
            </label>
            <div className="space-y-2">
              {(['ADMIN', 'MEMBER', 'VIEWER', 'OWNER'] as OrganizationRole[]).map((r) => {
                const assignable = canAssignRole(orgRole, r);
                return (
                  <label
                    key={r}
                    className={`flex items-start gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                      !assignable
                        ? 'opacity-50 cursor-not-allowed border-border bg-muted/20'
                        : inviteRole === r
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-card hover:bg-accent/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="inviteRole"
                      value={r}
                      checked={inviteRole === r}
                      disabled={!assignable}
                      onChange={() => setInviteRole(r)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        <span>{ROLE_LABELS[r]}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">({r})</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        {ROLE_DESCRIPTIONS[r]}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-md bg-muted/40 border border-border text-[11px] text-muted-foreground font-mono">
            Invitation links expire in 72 hours, are single-use, and bind the recipient strictly to{' '}
            <strong className="text-foreground">{currentTenant.name}</strong>.
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsInviteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" icon={<Mail className="size-3.5" />}>
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Destructive Member Removal Modal */}
      <Modal
        isOpen={Boolean(memberToConfirmRemove)}
        onClose={() => setMemberToConfirmRemove(null)}
        title="Confirm Member Removal"
        description="This action immediately revokes all organization sessions and resource access."
        maxWidth="sm"
      >
        {memberToConfirmRemove && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive space-y-1">
              <div className="font-semibold">
                Remove {memberToConfirmRemove.full_name} ({memberToConfirmRemove.email})?
              </div>
              <p className="text-[11px]">
                They will no longer have access to {currentTenant.name} websites, requests, or analytics.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setMemberToConfirmRemove(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleConfirmRemoveMember}
              >
                Confirm Removal
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
