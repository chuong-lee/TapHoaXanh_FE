"use client";

import { useState, useEffect } from "react";
import { Address, CreateAddressDto, UpdateAddressDto } from "../types";
import { addressService } from "../lib/addressService";
import AddressItem from "./AddressItem";
import AddressForm from "./AddressForm";

export default function AddressList() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>();
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load addresses on component mount
  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await addressService.getAllAddresses();
      setAddresses(data);
    } catch (err) {
      setError("Không thể tải danh sách địa chỉ");
      console.error("Error loading addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(undefined);
    setShowForm(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDeleteAddress = async (id: number) => {
    console.log("Deleting address with ID:", id, "Type:", typeof id);
    if (!confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      return;
    }

    try {
      setFormLoading(true);
      setError(null);
      await addressService.deleteAddress(id);
      setSuccess("Đã xóa địa chỉ thành công");
      await loadAddresses();
    } catch (err) {
      setError("Không thể xóa địa chỉ");
      console.error("Error deleting address:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSetDefaultAddress = async (id: number) => {
    console.log("Setting default address with ID:", id, "Type:", typeof id);
    try {
      setFormLoading(true);
      setError(null);
      await addressService.setDefaultAddress(id);
      setSuccess("Đã đặt địa chỉ làm mặc định");
      await loadAddresses();
    } catch (err) {
      setError("Không thể đặt địa chỉ mặc định");
      console.error("Error setting default address:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmitForm = async (
    data: CreateAddressDto | UpdateAddressDto
  ) => {
    try {
      setFormLoading(true);
      setError(null);

      if (editingAddress) {
        await addressService.updateAddress(
          editingAddress.id,
          data as UpdateAddressDto
        );
        setSuccess("Đã cập nhật địa chỉ thành công");
      } else {
        await addressService.createAddress(data as CreateAddressDto);
        setSuccess("Đã thêm địa chỉ thành công");
      }

      setShowForm(false);
      setEditingAddress(undefined);
      await loadAddresses();
    } catch (err) {
      setError(
        editingAddress ? "Không thể cập nhật địa chỉ" : "Không thể thêm địa chỉ"
      );
      console.error("Error submitting form:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAddress(undefined);
    setError(null);
    setSuccess(null);
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  if (loading) {
    return (
      <div className="text-center py-4">Đang tải danh sách địa chỉ...</div>
    );
  }

  return (
    <div
      className="address-list"
      style={{
        padding: "20px 0",
        background: "#f9fafb",
        minHeight: "400px",
      }}
    >
      {/* Messages */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}

      {/* Address List */}
      {!showForm && (
        <div className="address-list-content">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title">Địa chỉ giao hàng</h2>
            <button
              className="btn btn-primary"
              onClick={handleAddAddress}
              disabled={formLoading}
            >
              Thêm địa chỉ mới
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">
                Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ đầu tiên!
              </p>
            </div>
          ) : (
            <div className="address-items">
              {addresses.map((address) => (
                <AddressItem
                  key={address.id}
                  address={address}
                  isDefault={address.is_default}
                  onEdit={handleEditAddress}
                  onDelete={handleDeleteAddress}
                  onSetDefault={handleSetDefaultAddress}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Address Form */}
      {showForm && (
        <AddressForm
          address={editingAddress}
          onSubmit={handleSubmitForm}
          onCancel={handleCancelForm}
          loading={formLoading}
        />
      )}
    </div>
  );
}
