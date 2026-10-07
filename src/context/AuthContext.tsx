import React, { createContext, useContext, useState, useMemo } from 'react';
import { UserProfile, UserRole, OrganizationRole, Permission } from '../types';
import { hasPermission } from '../lib/permissions';

interface AuthContextType {
  user: UserProfile;
  orgRole: OrganizationRole;
  setOrgRole: (orgRole: OrganizationRole) => void;
  can: (permission: Permission) => boolean;
  // Kept for compatibility with existing components
  role: UserRole;
  setRole: (role: UserRole) => void;
  setUser: (user: UserProfile) => void;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const ROLE_PERSONAS: Record<OrganizationRole, { id: string; full_name: string; email: string; mfa_enabled: boolean }> = {
  OWNER: {
    id: 'usr-lumina-dr-lin',
    full_name: 'Dr. Sarah Lin',
    email: 'dr.lin@luminahealth.com',
    mfa_enabled: true,
  },
  ADMIN: {
    id: 'usr-lumina-marcus',
    full_name: 'Marcus Chen',
    email: 'm.chen@luminahealth.com',
    mfa_enabled: true,
  },
  MEMBER: {
    id: 'usr-lumina-david',
    full_name: 'David Wilson',
    email: 'd.wilson@luminahealth.com',
    mfa_enabled: false,
  },
  VIEWER: {
    id: 'usr-lumina-emma',
    full_name: 'Emma Davis',
    email: 'e.davis@luminahealth.com',
    mfa_enabled: false,
  },
};

const DEFAULT_USER: UserProfile = {
  id: 'usr-lumina-dr-lin',
  tenant_id: 'tenant-lumina-01',
  email: 'dr.lin@luminahealth.com',
  full_name: 'Dr. Sarah Lin',
  role: 'client',
  org_role: 'OWNER',
  mfa_enabled: true,
  avatar_url: 'https://images.unsplash.com/photo-1594824813639-450700d23485?w=150&auto=format&fit=crop&q=80',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [orgRole, setOrgRoleState] = useState<OrganizationRole>('OWNER');

  const setOrgRole = (newOrgRole: OrganizationRole) => {
    setOrgRoleState(newOrgRole);
    const persona = ROLE_PERSONAS[newOrgRole];
    setUser((prev) => ({
      ...prev,
      id: persona.id,
      full_name: persona.full_name,
      email: persona.email,
      org_role: newOrgRole,
      mfa_enabled: persona.mfa_enabled,
      role: 'client',
    }));
  };

  const setRole = (_newRole: UserRole) => {
    // Client-Only Portal: All organization members operate within client organization roles
    setOrgRole('OWNER');
  };

  const can = (permission: Permission) => hasPermission(orgRole, permission);

  const value = useMemo(
    () => ({
      user,
      orgRole,
      setOrgRole,
      can,
      role: 'client' as UserRole,
      setRole,
      setUser,
      // Client-Only Architecture: Never expose LevelUp internal platform admin flags
      isAdmin: false,
      isSuperAdmin: false,
    }),
    [user, orgRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
