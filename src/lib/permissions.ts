// =======================================================================
// LEVELUP DASHBOARD - CENTRALIZED PERMISSION & RBAC ARCHITECTURE
// Hierarchy: AUTHENTICATED USER -> ORGANIZATION MEMBERSHIP -> ORG ROLE -> PERMISSION
// Note: UI permission checks are for UX only. Authoritative enforcement
// occurs in Supabase RLS policies and server-side endpoints.
// =======================================================================

import { OrganizationRole, Permission, OrganizationMember } from '../types';

export const ROLE_LABELS: Record<OrganizationRole, string> = {
  OWNER: 'Owner',
  ADMIN: 'Admin',
  MEMBER: 'Member',
  VIEWER: 'Viewer',
};

export const ROLE_DESCRIPTIONS: Record<OrganizationRole, string> = {
  OWNER:
    'Full organization control including billing, subscriptions, team roles, websites, and ownership transfer.',
  ADMIN:
    'Operational management across websites, team invitations, requests, leads, bookings, analytics, and billing.',
  MEMBER:
    'Standard operational access to websites, requests, leads, bookings, analytics, and support. No billing or role management.',
  VIEWER:
    'Read-only access to permitted websites, analytics, reports, and organization activity.',
};

export const ROLE_PERMISSIONS: Record<OrganizationRole, Permission[]> = {
  OWNER: [
    'organization.view',
    'organization.update',
    'organization.delete',
    'team.view',
    'team.invite',
    'team.update',
    'team.remove',
    'website.view',
    'website.update',
    'website.delete',
    'analytics.view',
    'leads.view',
    'leads.manage',
    'bookings.view',
    'bookings.manage',
    'requests.create',
    'requests.view',
    'requests.manage',
    'billing.view',
    'billing.manage',
    'support.create',
    'support.view',
  ],
  ADMIN: [
    'organization.view',
    'organization.update',
    'team.view',
    'team.invite',
    'team.update',
    'team.remove',
    'website.view',
    'website.update',
    'analytics.view',
    'leads.view',
    'leads.manage',
    'bookings.view',
    'bookings.manage',
    'requests.create',
    'requests.view',
    'requests.manage',
    'billing.view',
    'support.create',
    'support.view',
  ],
  MEMBER: [
    'organization.view',
    'team.view',
    'website.view',
    'analytics.view',
    'leads.view',
    'leads.manage',
    'bookings.view',
    'bookings.manage',
    'requests.create',
    'requests.view',
    'support.create',
    'support.view',
  ],
  VIEWER: [
    'organization.view',
    'team.view',
    'website.view',
    'analytics.view',
    'leads.view',
    'bookings.view',
    'requests.view',
    'support.view',
  ],
};

export function hasPermission(role: OrganizationRole, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role] || [];
  return perms.includes(permission);
}

/**
 * Role Escalation Protection:
 * - Only OWNER can assign or modify OWNER role.
 * - ADMIN can invite/update MEMBER or VIEWER, not OWNER.
 * - MEMBER and VIEWER cannot change roles.
 */
export function canAssignRole(actorRole: OrganizationRole, targetRole: OrganizationRole): boolean {
  if (actorRole === 'OWNER') {
    return true;
  }
  if (actorRole === 'ADMIN') {
    return targetRole === 'ADMIN' || targetRole === 'MEMBER' || targetRole === 'VIEWER';
  }
  return false;
}

/**
 * Owner Protection:
 * Prevents removing or demoting the last OWNER of an organization.
 */
export function canModifyOrRemoveMember(
  actorRole: OrganizationRole,
  targetMember: OrganizationMember,
  allMembers: OrganizationMember[],
  newRole?: OrganizationRole
): { allowed: boolean; reason?: string } {
  if (!hasPermission(actorRole, 'team.update') && !hasPermission(actorRole, 'team.remove')) {
    return { allowed: false, reason: 'Your role does not have permission to manage team members.' };
  }

  const activeOwners = allMembers.filter((m) => m.org_role === 'OWNER' && m.status === 'active');

  if (targetMember.org_role === 'OWNER') {
    if (actorRole !== 'OWNER') {
      return {
        allowed: false,
        reason: 'Only an Organization Owner can modify or remove another Owner.',
      };
    }
    if (activeOwners.length <= 1 && (!newRole || newRole !== 'OWNER')) {
      return {
        allowed: false,
        reason:
          'Owner protection: You cannot remove or demote the last Owner of the organization. Transfer ownership first.',
      };
    }
  }

  if (newRole && !canAssignRole(actorRole, newRole)) {
    return {
      allowed: false,
      reason: `Role escalation blocked: ${actorRole} cannot assign ${newRole} privileges.`,
    };
  }

  return { allowed: true };
}
