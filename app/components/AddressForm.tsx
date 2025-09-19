"use client";

import { useState, useEffect } from "react";
import { Address, CreateAddressDto, UpdateAddressDto } from "../types";

interface AddressFormProps {
  address?: Address;
  onSubmit: (data: CreateAddressDto | UpdateAddressDto) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function AddressForm({
  address,
  onSubmit,
  onCancel,
  loading = false,
}: AddressFormProps) {
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    district: "",
    is_default: false,
  });

  useEffect(() => {
    if (address) {
      setFormData({
        street: address.street,
        city: address.city,
        district: address.district,
        is_default: address.is_default,
      });
    }
  }, [address]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="address-form-container">
      <h2 className="section-title">
        {address ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
      </h2>
      <form className="address-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="street">
              Địa chỉ đường<span className="required">*</span>
            </label>
            <input
              id="street"
              name="street"
              type="text"
              placeholder="Nhập địa chỉ đường"
              value={formData.street}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="district">
              Quận/Huyện<span className="required">*</span>
            </label>
            <input
              id="district"
              name="district"
              type="text"
              placeholder="Nhập quận/huyện"
              value={formData.district}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">
              Thành phố<span className="required">*</span>
            </label>
            <input
              id="city"
              name="city"
              type="text"
              placeholder="Nhập thành phố"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="is_default">
              <input
                id="is_default"
                name="is_default"
                type="checkbox"
                checked={formData.is_default}
                onChange={handleChange}
              />
              Đặt làm địa chỉ mặc định
            </label>
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading
              ? "Đang xử lý..."
              : address
              ? "Cập nhật địa chỉ"
              : "Thêm địa chỉ"}
          </button>
          <button
            className="btn btn-secondary ms-2"
            type="button"
            onClick={onCancel}
            disabled={loading}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
