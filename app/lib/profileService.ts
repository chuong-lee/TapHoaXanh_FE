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
    // API trả về { success: true, user: {...} }
    return res.data.user as ProfileDto;
  },
  updateProfile: async (data: Partial<ProfileDto>): Promise<ProfileDto> => {
    const res = await api.put('/auth/profile', data);
    return res.data.user as ProfileDto;
  },
  updatePassword: async (data: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
    const res = await api.put('/users/password', data);
    return res.data;
  },
  logout: async () => {
    const res = await api.post('/auth/logout');
    return res.data;
  },
};