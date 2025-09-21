"use client";

import { usePathname, useRouter } from "next/navigation";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { profileService, ProfileDto } from "../lib/profileService";

interface AuthContextType {
  profile: ProfileDto | null;
  setProfile: React.Dispatch<React.SetStateAction<ProfileDto | null>>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileDto | null>(null);

  const refreshProfile = useCallback(async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data);
    } catch {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      refreshProfile();
    }
  }, [refreshProfile]);

  useEffect(() => {
    if (profile) {
      if (pathname === "/login" || pathname === "/register") {
        router.push("/");
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
  if (!ctx) throw new Error("useAuth phải được sử dụng trong AuthProvider");
  return ctx;
};
