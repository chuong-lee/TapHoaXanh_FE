"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { profileService } from "../lib/profileService";
import { useAuth } from "../context/AuthContext";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";

export default function LogoutButton() {
  const { setProfile } = useAuth();
  const { setCart } = useCart();
  const router = useRouter();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLogoutLoading(true);
    setLogoutError(null);
    try {
      await profileService.logout();
      setProfile(null);
      localStorage.removeItem("token");
      localStorage.removeItem("cart_local");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("checkout_user_info");
      setCart([]);
      router.push("/login");
    } catch {
      toast.error("Đăng xuất thất bại. Vui lòng thử lại!");
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className="text-center">
      <div
        className="dropdown-item"
        style={{
          cursor: logoutLoading ? "not-allowed" : "pointer",
          opacity: logoutLoading ? 0.6 : 1,
          color: logoutLoading ? "#6b7280" : "#333",
          fontWeight: "600",
          fontSize: "16px",
          padding: "8px 16px",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          if (!logoutLoading) {
            e.currentTarget.style.backgroundColor = "#f8f9fa";
            e.currentTarget.style.color = "var(--primary-green)";
          }
        }}
        onMouseLeave={(e) => {
          if (!logoutLoading) {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#333";
          }
        }}
        onClick={logoutLoading ? undefined : handleLogout}
      >
        {logoutLoading ? "Đang đăng xuất..." : "Đăng xuất"}
      </div>
      {logoutError && (
        <div className="text-danger mt-2 small">{logoutError}</div>
      )}
    </div>
  );
}
