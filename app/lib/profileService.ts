import { Address } from "@/types";
import api from "./axios";

export interface ProfileDto {
  name: string;
  phone: string;
  email: string;
  image: string;
}

export const profileService = {
  getAddress: async (): Promise<Address[]> => {
    const res = await api.get("/address/all");
    return res.data;
  },
  getProfile: async (): Promise<ProfileDto> => {
    const res = await api.get("/users/profile");
    return res.data as ProfileDto;
  },
  updateProfile: async (data: Partial<ProfileDto>): Promise<ProfileDto> => {
    const res = await api.put("/users", data);
    return res.data as ProfileDto;
  },
  updatePassword: async (data: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const res = await api.put("/users/password", data);
    return res.data;
  },
  logout: async () => {
    const res = await api.post("/auth/logout");
    return res.data;
  },
  uploadAvatar: async (
    file: File
  ): Promise<{ imageUrl: string; message: string }> => {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch("/users/avatar", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Upload không thành công");
    }

    const result = await res.json();

    // Sau khi upload thành công, cập nhật profile với avatar mới
    if (result.imageUrl) {
      try {
        await api.put("/users", { image: result.imageUrl });
      } catch (error) {
        console.error("Lỗi khi cập nhật profile:", error);
        return result;
      }
    }

    return result;
  },
};
