import api from './axios';

export interface ProfileDto {
  name: string;
  phone: string;
  email: string;
  image: string;
}

export const profileService = {
  getProfile: async (): Promise<ProfileDto> => {
    const res = await api.get('/users/profile');
    return res.data as ProfileDto;
  },
  updateProfile: async (data: Partial<ProfileDto>): Promise<ProfileDto> => {
    const res = await api.put('/users', data);
    return res.data as ProfileDto;
  },
  updatePassword: async (data: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
    const res = await api.put('/users/password', data);
    return res.data;
  },
  logout: async () => {
    // Remove token from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return { success: true };
  },
};