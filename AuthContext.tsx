import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'driver' | 'owner' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  role: UserRole;
  isOnline?: boolean;
  kycStatus?: 'pending' | 'approved' | 'rejected';
  rating?: number;
  trustScore?: number;
  experience?: number;
  completionRate?: number;
  totalTrips?: number;
  walletBalance?: number;
  profileImage?: string;
  licenseUploaded?: boolean;
  aadhaarUploaded?: boolean;
  isVerified?: boolean;
  status?: 'active' | 'suspended' | 'blocked';
}

interface AuthContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  selectedRole: UserRole | null;
  setSelectedRole: (role: UserRole | null) => void;
  login: (profile: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_KEY = '@driver_setu_auth';
const ROLE_KEY = '@driver_setu_role';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRoleState] = useState<UserRole | null>(null);

  useEffect(() => {
    loadAuth();
  }, []);

  async function loadAuth() {
    try {
      const [authData, roleData] = await Promise.all([
        AsyncStorage.getItem(AUTH_KEY),
        AsyncStorage.getItem(ROLE_KEY),
      ]);
      if (authData) {
        setUser(JSON.parse(authData));
      }
      if (roleData) {
        setSelectedRoleState(roleData as UserRole);
      }
    } catch (e) {
      console.error('Failed to load auth:', e);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(profile: UserProfile) {
    setUser(profile);
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(profile));
    await AsyncStorage.setItem(ROLE_KEY, profile.role);
    setSelectedRoleState(profile.role);
  }

  async function logout() {
    setUser(null);
    setSelectedRoleState(null);
    await AsyncStorage.multiRemove([AUTH_KEY, ROLE_KEY]);
  }

  async function updateProfile(updates: Partial<UserProfile>) {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(updated));
  }

  function setSelectedRole(role: UserRole | null) {
    setSelectedRoleState(role);
    if (role) {
      AsyncStorage.setItem(ROLE_KEY, role);
    }
  }

  const value = useMemo(() => ({
    user,
    isLoading,
    isLoggedIn: !!user,
    selectedRole,
    setSelectedRole,
    login,
    logout,
    updateProfile,
  }), [user, isLoading, selectedRole]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
