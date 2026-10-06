import React, { createContext, useContext, useState, useMemo } from 'react';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile;
  role: UserRole;
  setRole: (role: UserRole) => void;
  setUser: (user: UserProfile) => void;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-lumina-dr-lin',
  tenant_id: 'tenant-lumina-01',
  email: 'dr.lin@luminahealth.com',
  full_name: 'Dr. Sarah Lin',
  role: 'client',
  avatar_url: 'https://images.unsplash.com/photo-1594824813639-450700d23485?w=150&auto=format&fit=crop&q=80',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [role, setRoleState] = useState<UserRole>('client');

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'admin' || newRole === 'super_admin') {
      setUser((prev) => ({
        ...prev,
        email: 'devon@levelup.ecosystem',
        full_name: 'Devon Vance (Agency Lead)',
        role: newRole,
      }));
    } else {
      setUser((prev) => ({
        ...prev,
        email: 'dr.lin@luminahealth.com',
        full_name: 'Dr. Sarah Lin',
        role: 'client',
      }));
    }
  };

  const isAdmin = role === 'admin' || role === 'super_admin';
  const isSuperAdmin = role === 'super_admin';

  const value = useMemo(
    () => ({
      user,
      role,
      setRole,
      setUser,
      isAdmin,
      isSuperAdmin,
    }),
    [user, role, isAdmin, isSuperAdmin]
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
