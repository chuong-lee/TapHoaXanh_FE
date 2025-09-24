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
import { Address } from "@/types";
import LoadingPage from "@/components/LoadingPage";

interface AuthContextType {
  address: Address[];
  profile: ProfileDto | null;
  setProfile: React.Dispatch<React.SetStateAction<ProfileDto | null>>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [address, setAddress] = useState<Address[]>([]);
  const refreshProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await profileService.getProfile();
      const addressData = await profileService.getAddress();

      setAddress(addressData);
      setProfile(data);
    } catch {
      setProfile(null);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      refreshProfile();
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [refreshProfile]);

  useEffect(() => {
    if (profile) {
      if (["/login", "/register"].includes(pathname)) {
        router.push("/");
      }
    }
  }, [pathname, profile, router]);

  useEffect(() => {
    if (!profile) {
      if (["/checkout", "/cart"].includes(pathname)) {
        router.push("/login");
      }
    }
  }, [pathname, profile, router]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <AuthContext.Provider
      value={{ address, profile, setProfile, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải được sử dụng trong AuthProvider");
  return ctx;
};
