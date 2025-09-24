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
  ): Promise<{ image: string; message: string }> => {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await api.post("/users/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },
};
