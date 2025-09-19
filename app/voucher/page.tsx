"use client";
import { Voucher } from "@/types";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function VoucherPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  // const [selected, setSelected] = useState<number | null>(null);
  // const router = useRouter();

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await api.get("/voucher");
        setVouchers(response.data);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
        setVouchers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  // const handleConfirm = () => {
  //   if (selected !== null) {
  //     const voucher = vouchers.find(v => v.id === selected);
  //     if (voucher) {
  //       localStorage.setItem('selectedVoucher', JSON.stringify(voucher));
  //       router.push('/checkout'); // Chuyển về trang thanh toán
  //     }
  //   }
  // };

  return (
    <main className="main-content">
      <div
        className="container py-4"
        style={{ maxWidth: 800, margin: "0 auto" }}
      >
        <h2
          className="fw-bold mb-4 text-center"
          style={{ fontSize: 32, color: "#7c3aed" }}
        >
          Danh sách Voucher
        </h2>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3 text-muted">Đang tải voucher...</p>
          </div>
        ) : vouchers.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">Không có voucher nào</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            {vouchers.map((v) => (
              <div
                key={v.id}
                className="voucher-card"
                style={{
                  background:
                    "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)",
                  borderRadius: 16,
                  boxShadow: "0 8px 32px rgba(34, 197, 94, 0.15)",
                  padding: 20,
                  minHeight: 160,
                  position: "relative",
                  overflow: "hidden",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                  border: "1px solid rgba(34, 197, 94, 0.2)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 40px rgba(34, 197, 94, 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(34, 197, 94, 0.15)";
                }}
              >
                {/* Decorative circle */}
                <div
                  style={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    width: 180,
                    height: 80,
                    borderRadius: "50%",
                    background: "rgba(34, 197, 94, 0.1)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: -30,
                    left: -30,
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: "rgba(34, 197, 94, 0.05)",
                  }}
                />

                {/* Header với icon và code */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 16,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: "rgba(34, 197, 94, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#22c55e",
                      fontSize: 18,
                      fontWeight: "bold",
                      marginRight: 12,
                      border: "1px solid rgba(34, 197, 94, 0.3)",
                    }}
                  >
                    V
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 18,
                      color: "#1f2937",
                    }}
                  >
                    {v.code}
                  </div>
                </div>

                {/* Thông tin voucher */}
                <div
                  style={{
                    fontSize: 13,
                    lineHeight: 1.5,
                    color: "#374151",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      marginBottom: 6,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ opacity: 0.7 }}>Giảm tối đa:</span>
                    <b
                      style={{
                        fontSize: 14,
                        color: "#22c55e",
                      }}
                    >
                      {v.max_discount.toLocaleString()}₫
                    </b>
                  </div>
                  <div
                    style={{
                      marginBottom: 6,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ opacity: 0.9 }}>Đơn tối thiểu:</span>
                    <b style={{ fontSize: 14 }}>
                      {v.min_order_value.toLocaleString()}₫
                    </b>
                  </div>
                  <div
                    style={{
                      marginBottom: 6,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ opacity: 0.9 }}>Số lượng còn:</span>
                    <b style={{ fontSize: 14 }}>{v.quantity}</b>
                  </div>
                  <div
                    style={{
                      marginBottom: 6,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ opacity: 0.9 }}>Ngày bắt đầu:</span>
                    <b style={{ fontSize: 12 }}>
                      {new Date(v.start_date).toLocaleDateString("vi-VN")}
                    </b>
                  </div>
                  <div
                    style={{
                      marginBottom: 6,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ opacity: 0.9 }}>Ngày kết thúc:</span>
                    <b style={{ fontSize: 12 }}>
                      {new Date(v.end_date).toLocaleDateString("vi-VN")}
                    </b>
                  </div>
                  <div
                    style={{
                      marginBottom: 6,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ opacity: 0.9 }}>Loại:</span>
                    <b style={{ fontSize: 14 }}>
                      {v.type === "PERCENTAGE" ? "Phần trăm" : "Cố định"}
                    </b>
                  </div>
                  {v.value && (
                    <div
                      style={{
                        marginBottom: 6,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ opacity: 0.7 }}>Giá trị:</span>
                      <b
                        style={{
                          fontSize: 14,
                          color: "#22c55e",
                        }}
                      >
                        {v.value}
                        {v.type === "PERCENTAGE" ? "%" : "₫"}
                      </b>
                    </div>
                  )}
                  <div
                    style={{
                      marginBottom: 0,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: 8,
                      borderTop: "1px solid rgba(34, 197, 94, 0.2)",
                    }}
                  >
                    <span style={{ opacity: 0.7 }}>Trạng thái:</span>
                    <b
                      style={{
                        fontSize: 14,
                        color: v.is_used ? "#ef4444" : "#22c55e",
                      }}
                    >
                      {v.is_used ? "Đã sử dụng" : "Có thể sử dụng"}
                    </b>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
