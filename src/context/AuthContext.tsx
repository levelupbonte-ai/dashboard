import React, { createContext, useContext, useState, useMemo } from 'react';
import { UserProfile, UserRole, OrganizationRole, Permission } from '../types';
import { hasPermission } from '../lib/permissions';

interface AuthContextType {
  user: UserProfile;
  orgRole: OrganizationRole;
  setOrgRole: (orgRole: OrganizationRole) => void;
  can: (permission: Permission) => boolean;
  // Authentication & session management
  isAuthenticated: boolean;
  login: (email: string, password?: string, tenantId?: string) => Promise<boolean>;
  logout: () => void;
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

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

  const login = async (email: string, _password?: string, tenantId?: string): Promise<boolean> => {
    // Authenticate user session
    setIsAuthenticated(true);
    const cleanEmail = email.trim().toLowerCase();

    // Determine user persona based on email domain or target tenant
    let matchedName = 'Client Administrator';
    let matchedTenant = tenantId || 'tenant-lumina-01';

    if (cleanEmail.includes('lumina')) {
      matchedName = 'Dr. Sarah Lin';
      matchedTenant = 'tenant-lumina-01';
    } else if (cleanEmail.includes('apex')) {
      matchedName = 'Elena Rostova';
      matchedTenant = 'tenant-apex-02';
    } else if (cleanEmail.includes('vantage')) {
      matchedName = 'Richard Chen';
      matchedTenant = 'tenant-vantage-03';
    } else if (cleanEmail.includes('velvet')) {
      matchedName = 'Lawrence King';
      matchedTenant = 'tenant-velvet-04';
    }

    setUser({
      id: `usr-${Date.now().toString(36)}`,
      tenant_id: matchedTenant,
      email: cleanEmail || 'admin@clientportal.levelup.dev',
      full_name: matchedName,
      role: 'client',
      org_role: 'OWNER',
      mfa_enabled: true,
      avatar_url: 'https://images.unsplash.com/photo-1594824813639-450700d23485?w=150&auto=format&fit=crop&q=80',
    });
    setOrgRoleState('OWNER');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
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
      isAuthenticated,
      login,
      logout,
      role: 'client' as UserRole,
      setRole,
      setUser,
      // Client-Only Architecture: Never expose LevelUp internal platform admin flags
      isAdmin: false,
      isSuperAdmin: false,
    }),
    [user, orgRole, isAuthenticated]
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
