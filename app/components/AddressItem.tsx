"use client";

import { Address } from "../types";

interface AddressItemProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: number) => void;
  onSetDefault: (id: number) => void;
  isDefault?: boolean;
}

export default function AddressItem({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isDefault = false,
}: AddressItemProps) {
  return (
    <div
      className={`address-item ${isDefault ? "default-address" : ""}`}
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "1.5rem",
        marginBottom: "1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <div className="address-info">
        <div className="address-header">
          <h3 className="name">
            Địa chỉ #{address.id}
            {isDefault && <span className="default-badge">Mặc định</span>}
          </h3>
        </div>
        <p className="address">
          {address.street}, {address.district}, {address.city}
        </p>
        <p className="address-details">
          <strong>Đường:</strong> {address.street}
        </p>
        <p className="address-details">
          <strong>Quận/Huyện:</strong> {address.district}
        </p>
        <p className="address-details">
          <strong>Thành phố:</strong> {address.city}
        </p>
      </div>
      <div className="address-actions">
        {!isDefault && (
          <button
            className="btn btn-sm btn-outline-primary me-2"
            onClick={() => {
              const id = Number(address.id);
              if (isNaN(id)) {
                console.error("Invalid address ID:", address.id);
                return;
              }
              onSetDefault(id);
            }}
            type="button"
          >
            Đặt mặc định
          </button>
        )}
        <button
          className="btn btn-sm btn-outline-success me-2"
          onClick={() => onEdit(address)}
          type="button"
        >
          Chỉnh sửa
        </button>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => {
            const id = Number(address.id);
            if (isNaN(id)) {
              console.error("Invalid address ID:", address.id);
              return;
            }
            onDelete(id);
          }}
          type="button"
        >
          Xóa
        </button>
      </div>
    </div>
  );
}
