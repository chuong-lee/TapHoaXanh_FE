'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { profileService } from '../lib/profileService';
import { useAuth } from '../context/AuthContext';

export default function LogoutButton() {
  const { setProfile } = useAuth();
  const router = useRouter();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLogoutLoading(true);
    setLogoutError(null);
    try {
      await profileService.logout();
      setProfile(null);
      router.push('/login');
    } catch {
      setLogoutError('Đăng xuất thất bại. Vui lòng thử lại!');
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className="text-center">
      <button className="btn btn-warning" onClick={handleLogout} disabled={logoutLoading}>
        {logoutLoading ? 'Đang đăng xuất...' : 'Đăng xuất'}
      </button>
      {logoutError && <div className="text-danger mt-3">{logoutError}</div>}
    </div>
  );
}
