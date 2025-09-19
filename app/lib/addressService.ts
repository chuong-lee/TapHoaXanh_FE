import { Address, CreateAddressDto, UpdateAddressDto } from "../types";
import api from "./axios";

class AddressService {
  // Lấy tất cả địa chỉ của user
  async getAllAddresses(): Promise<Address[]> {
    try {
      const response = await api.get("/address/all");
      return response.data;
    } catch (error) {
      console.error("Error fetching addresses:", error);
      throw error;
    }
  }

  // Lấy địa chỉ theo ID
  async getAddressById(id: number): Promise<Address> {
    try {
      const response = await api.get(`/address/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching address:", error);
      throw error;
    }
  }

  // Tạo địa chỉ mới
  async createAddress(addressData: CreateAddressDto): Promise<Address> {
    try {
      const response = await api.post("/address/create", addressData);
      return response.data;
    } catch (error) {
      console.error("Error creating address:", error);
      throw error;
    }
  }

  // Cập nhật địa chỉ
  async updateAddress(
    id: number,
    addressData: UpdateAddressDto
  ): Promise<Address> {
    try {
      const response = await api.patch(`/address/update/${id}`, addressData);
      return response.data;
    } catch (error) {
      console.error("Error updating address:", error);
      throw error;
    }
  }

  // Xóa địa chỉ
  async deleteAddress(id: number): Promise<void> {
    try {
      await api.delete(`/address/${id}`);
    } catch (error) {
      console.error("Error deleting address:", error);
      throw error;
    }
  }

  // Đặt địa chỉ làm mặc định
  async setDefaultAddress(id: number): Promise<Address> {
    try {
      const response = await api.patch(`/address/${id}/set-default`);
      return response.data;
    } catch (error) {
      console.error("Error setting default address:", error);
      throw error;
    }
  }
}

export const addressService = new AddressService();
