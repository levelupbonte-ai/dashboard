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
    id: 'usr-owner',
    full_name: 'Workspace Owner',
    email: 'owner@levelup.dev',
    mfa_enabled: true,
  },
  ADMIN: {
    id: 'usr-admin',
    full_name: 'Workspace Admin',
    email: 'admin@levelup.dev',
    mfa_enabled: true,
  },
  MEMBER: {
    id: 'usr-member',
    full_name: 'Team Member',
    email: 'member@levelup.dev',
    mfa_enabled: false,
  },
  VIEWER: {
    id: 'usr-viewer',
    full_name: 'Workspace Viewer',
    email: 'viewer@levelup.dev',
    mfa_enabled: false,
  },
};

const DEFAULT_USER: UserProfile = {
  id: 'usr-admin',
  tenant_id: 'tenant-main',
  email: 'admin@levelup.dev',
  full_name: 'Workspace Admin',
  role: 'client',
  org_role: 'OWNER',
  mfa_enabled: true,
  avatar_url: '',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [orgRole, setOrgRoleState] = useState<OrganizationRole>('OWNER');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('levelup_auth') === 'true';
  });

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

    if (typeof window !== 'undefined') {
      localStorage.setItem('levelup_auth', 'true');
      localStorage.setItem('levelup_user_email', cleanEmail);
    }

    // Determine user persona based on real email input
    const userPrefix = cleanEmail.split('@')[0] || '';
    const matchedName = userPrefix
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ') || 'Workspace Admin';
    const matchedTenant = tenantId || 'tenant-main';

    setUser({
      id: `usr-${Date.now().toString(36)}`,
      tenant_id: matchedTenant,
      email: cleanEmail || 'admin@levelup.dev',
      full_name: matchedName,
      role: 'client',
      org_role: 'OWNER',
      mfa_enabled: true,
      avatar_url: '',
    });
    setOrgRoleState('OWNER');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('levelup_auth');
      localStorage.removeItem('levelup_user_email');
    }
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
