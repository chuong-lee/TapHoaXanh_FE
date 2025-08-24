import api from './axios';

export interface ProfileDto {
  name: string;
  phone: string;
  email: string;
  image: string;
}

export const profileService = {
  getProfile: async (): Promise<ProfileDto> => {
    const res = await api.get('/auth/profile');
    return res.data.user as ProfileDto;
  },
  updateProfile: async (data: Partial<ProfileDto>): Promise<ProfileDto> => {
    const res = await api.put('/auth/profile', data);
    return res.data.user as ProfileDto;
  },
  updatePassword: async (data: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
    const res = await api.put('/auth/password', data);
    return res.data;
  },
  logout: async () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    return { success: true };
  },
};