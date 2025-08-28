import api from './axios';

export interface ProfileDto {
  id: number;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileDto {
  name: string;
  phone: string;
  email: string;
  image?: string;
}

export interface UpdatePasswordDto {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const profileService = {
  async getProfile(): Promise<ProfileDto> {
    try {
      const response = await api.get('/auth/profile');
      if (response.data.success) {
        return response.data.user;
      }
      throw new Error(response.data.error || 'Failed to get profile');
    } catch (error: any) {
      console.error('Error getting profile:', error);
      throw error;
    }
  },

  async updateProfile(data: UpdateProfileDto): Promise<ProfileDto> {
    try {
      const response = await api.put('/auth/profile', data);
      if (response.data.success) {
        return response.data.user;
      }
      throw new Error(response.data.error || 'Failed to update profile');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  async updatePassword(data: UpdatePasswordDto): Promise<void> {
    try {
      const response = await api.put('/auth/password', data);
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to update password');
      }
    } catch (error: any) {
      console.error('Error updating password:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error: any) {
      console.error('Error during logout:', error);
      // Không throw error vì logout vẫn có thể thành công ngay cả khi API fail
    }
  }
};
