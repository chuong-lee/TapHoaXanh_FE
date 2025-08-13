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
  uploadAvatar: async (file: File): Promise<{ imageUrl: string; message: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    // Sử dụng Next.js API route để upload file
    const res = await fetch('/api/users/avatar', {
      method: 'POST',
      body: formData,
    });
    
    if (!res.ok) {
      throw new Error('Upload không thành công');
    }
    
    const result = await res.json();
    
    // Sau khi upload thành công, cập nhật profile với avatar mới
    if (result.imageUrl) {
      await api.put('/users', { image: result.imageUrl });
    }
    
    return result;
  },
};