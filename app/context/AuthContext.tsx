'use client';

import { usePathname, useRouter } from 'next/navigation'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { profileService, ProfileDto } from '../lib/profileService';

interface AuthContextType {
  profile: ProfileDto | null;
  setProfile: React.Dispatch<React.SetStateAction<ProfileDto | null>>;
  refreshProfile: () => Promise<void>;
  // You can add more auth-related state/methods here (token, logout, etc.)
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const refreshProfile = async () => {
    try {
      console.log('AuthContext - Refreshing profile...');
      const data = await profileService.getProfile();
      console.log('AuthContext - Profile loaded:', data);
      setProfile(data);
    } catch (error) {
      console.error('AuthContext - Error loading profile:', error);
      setProfile(null);
    }
  };

  useEffect(() => { 
    const authToken = localStorage.getItem('authToken');
    const accessToken = localStorage.getItem('access_token');
    const token = localStorage.getItem('token');
    
    console.log('AuthContext - Checking tokens:', { authToken: !!authToken, accessToken: !!accessToken, token: !!token });
    
    if (authToken || accessToken || token) {
      console.log('AuthContext - Token found, refreshing profile...');
      refreshProfile();
    } else {
      console.log('AuthContext - No token found');
    }
  }, []);

  useEffect(() => {
    if (profile) {
      if (pathname === '/login' || pathname === '/register') {
        router.push('/');
      }
    }
  }, [pathname, profile, router]);

  return (
    <AuthContext.Provider value={{ profile, setProfile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải được sử dụng trong AuthProvider');
  return ctx;
};