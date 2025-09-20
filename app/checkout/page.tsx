"use client";

import { useState, useEffect } from "react";
import { CartItem, Voucher } from "@/types";
import api from "@/lib/axios";
import axios from "axios";
import { toast } from "react-toastify";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

function CheckoutPage() {
  const router = useRouter();
  const { removeMultipleFromCart } = useCart();
  const { profile } = useAuth();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const cartItemsLocal = localStorage.getItem("cart_selected");
    setCartItems(cartItemsLocal ? JSON.parse(cartItemsLocal) : []);
  }, []);

  const [form, setForm] = useState({
    fullName: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    createAccount: false,
    shipToDifferent: false,
    notes: "",
    agree: false,
    payment: "",
    voucher: "",
  });

  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  useEffect(() => {
    if (profile) {
      setForm((prev) => ({
        ...prev,
        fullName: profile.name,
        phone: profile.phone,
        email: profile.email,
      }));
    }
  }, [profile]);

  useEffect(() => {
    const saved = localStorage.getItem("checkout_user_info");
    if (saved) {
      const savedData = JSON.parse(saved);
      // Reset payment về trống khi vào trang checkout
      setForm((f) => ({
        ...f,
        ...savedData,
        payment: "", // Luôn reset về trống
      }));
    }
  }, []);

  useEffect(() => {
    setForm((f) => ({
      ...f,
      payment: "",
    }));
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("cart_selected")) {
      router.push("/cart");
    }
  }, [router]);

  useEffect(() => {
    async function fetchVouchers() {
      const res = await api.get<Voucher[]>("/voucher");
      setVouchers(res.data);
    }
    fetchVouchers();
  }, []);

  // Tính tổng tiền
  const subtotal = cartItems
    ? cartItems.reduce((sum, item) => {
        // Tính giá sau khi giảm giá
        const discountedPrice =
          item.product.price * (1 - item.product.discount / 100);
        return sum + discountedPrice * item.quantity;
      }, 0)
    : 0;

  let discount = 0;
  if (selectedVoucher && subtotal >= selectedVoucher.min_order_value) {
    discount = Math.min(selectedVoucher.max_discount, subtotal);
  }
  const shipping = subtotal > 300000 ? 0 : 15000;
  const total = subtotal - discount + shipping;

  const requiredFields = [
    { key: "fullName", label: "Họ và tên" },
    { key: "address", label: "Địa chỉ" },
    { key: "city", label: "Tỉnh/Thành phố" },
    { key: "state", label: "Huyện/Quận" },
    { key: "zip", label: "Xã/Thị trấn" },
    { key: "phone", label: "Số điện thoại" },
    { key: "email", label: "Email" },
  ];

  // Kiểm tra xem đã nhập đầy đủ thông tin nhận hàng chưa
  const isFormInfoComplete = () => {
    return requiredFields.every((field) => {
      const value = form[field.key as keyof typeof form];
      return value && value.toString().trim() !== "";
    });
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing = requiredFields.filter(
      (f) => !form[f.key as keyof typeof form]
    );
    if (missing.length > 0) {
      setErrorFields(missing.map((f) => f.label));
      return;
    }
    setErrorFields([]);

    const orderPayload = {
      voucherId: selectedVoucher?.id,
      note: form.notes,
      cartItemIds: cartItems.map((item) => item.id),
    };

    try {
      const orderId = await api.post("/order/from-cart", orderPayload);
      if (form.payment === "cod") {
        await api.post("/payment/create-payment-cash", {
          orderId: orderId.data.id,
        });
        toast("Đặt hàng thành công", {
          type: "success",
        });
      } else {
        const paymentRes = await api.post("/payment/create-payment", {
          orderId: orderId.data.id,
        });
        const paymentUrl = paymentRes.data.paymentUrl;
        if (paymentUrl) {
          window.location.href = paymentUrl; // 🔥 Tự động redirect
          return;
        }
      }
      removeMultipleFromCart(cartItems.map((item) => item.id));
      localStorage.removeItem("cart_selected");

      // Chuyển về trang chủ sau khi xử lý xong
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error: unknown) {
      const messages = "An unknown error occurred";

      if (axios.isAxiosError(error)) {
        return error.response?.data?.message;
      }
      toast(messages, {
        type: "error",
      });
    }
  };

  return (
    <>
      <main className="main-content">
        <div className="container py-4">
          <div className="row">
            {/* Cột trái: Mặc định hiển thị thông tin nhận hàng, chỉ thay đổi khi chọn phương thức thanh toán */}
            <div className="col-md-7">
              {form.payment === "vnpay" ? (
                // Hiển thị form thông tin ví điện tử
                <div>
                  <div
                    className="alert mb-4"
                    style={{
                      backgroundColor: "#f0fdf4",
                      borderColor: "#bbf7d0",
                      color: "#166534",
                    }}
                  >
                    <h5 className="fw-bold">Thông tin ví điện tử</h5>
                    <p className="mb-0">
                      Vui lòng chọn ví điện tử và điền thông tin thanh toán
                    </p>
                  </div>
                  <div
                    className="bg-white p-4 rounded-3"
                    style={{ border: "1.5px solid #f3f3f3" }}
                  >
                    <div className="row g-3">
                      <div className="col-12">
                        <label>Chọn ví điện tử *</label>
                        <select
                          className="form-control"
                          defaultValue=""
                          style={{
                            borderColor: "#bbf7d0",
                            backgroundColor: "#f0fdf4",
                          }}
                        >
                          <option value="vnpay">VNPay</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label>Số điện thoại đăng ký ví *</label>
                        <input
                          className="form-control"
                          placeholder="Nhập số điện thoại đăng ký ví điện tử"
                          style={{
                            borderColor: "#bbf7d0",
                            backgroundColor: "#f0fdf4",
                          }}
                        />
                      </div>
                      <div className="col-12">
                        <label>Email (nếu có)</label>
                        <input
                          className="form-control"
                          placeholder="Nhập email (không bắt buộc)"
                          style={{
                            borderColor: "#bbf7d0",
                            backgroundColor: "#f0fdf4",
                          }}
                        />
                      </div>
                      <div className="col-12">
                        <div
                          className="alert"
                          style={{
                            backgroundColor: "#f0fdf4",
                            borderColor: "#bbf7d0",
                            color: "#166534",
                          }}
                        >
                          <strong>Hướng dẫn:</strong> Sau khi xác nhận, bạn sẽ
                          được chuyển đến trang thanh toán của ví điện tử đã
                          chọn.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Hiển thị form thông tin nhận hàng (mặc định) khi chưa chọn phương thức thanh toán hoặc COD
                <>
                  <div
                    className="alert mb-4"
                    style={{
                      backgroundColor: "#f0fdf4",
                      borderColor: "#bbf7d0",
                      color: "#166534",
                    }}
                  >
                    Thêm <b>{(300000 - subtotal).toLocaleString("vi-VN")}₫</b>{" "}
                    vào giỏ để được <b>miễn phí giao hàng!</b>
                  </div>
                  <h3 className="fw-bold mb-3">
                    <i className="fa-solid fa-user me-2"></i>
                    Thông tin nhận hàng
                  </h3>
                  {!form.payment && (
                    <div
                      className="alert mb-3"
                      style={{
                        backgroundColor: "#f0fdf4",
                        borderColor: "#bbf7d0",
                        color: "#166534",
                      }}
                    >
                      <i className="fa-solid fa-info-circle me-2"></i>
                      <strong>Bước 1:</strong>Vui lòng nhập đầy đủ thông tin
                      nhận hàng bên dưới, sau đó chọn phương thức thanh toán ở
                      bên phải.
                    </div>
                  )}
                  <div className="row g-3">
                    <div className="col-12">
                      <label>Họ và tên *</label>
                      <input
                        disabled
                        className="form-control"
                        value={profile?.name || ""}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, fullName: e.target.value }))
                        }
                      />
                    </div>
                    <div className="col-12">
                      <label>Địa chỉ *</label>
                      <input
                        className="form-control"
                        placeholder="Số nhà, tên đường"
                        value={form.address}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, address: e.target.value }))
                        }
                      />
                      <input
                        className="form-control mt-2"
                        placeholder="Căn hộ, tầng, v.v. (không bắt buộc)"
                        value={form.address2}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, address2: e.target.value }))
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Tỉnh/Thành phố *</label>
                      <input
                        className="form-control"
                        placeholder="Nhập tỉnh hoặc thành phố"
                        value={form.city}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, city: e.target.value }))
                        }
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Huyện/Quận *</label>
                      <input
                        className="form-control"
                        placeholder="Nhập huyện hoặc quận"
                        value={form.state}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, state: e.target.value }))
                        }
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Xã/Thị trấn *</label>
                      <input
                        className="form-control"
                        placeholder="Nhập xã hoặc thị trấn"
                        value={form.zip}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, zip: e.target.value }))
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Số điện thoại *</label>
                      <input
                        disabled
                        className="form-control"
                        value={profile?.phone || ""}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, phone: e.target.value }))
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Email *</label>
                      <input
                        disabled
                        className="form-control"
                        value={profile?.email || ""}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, email: e.target.value }))
                        }
                      />
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={form.shipToDifferent}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              shipToDifferent: e.target.checked,
                            }))
                          }
                        />
                        <label className="form-check-label">
                          Giao hàng tới địa chỉ khác?
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <label>Ghi chú đơn hàng (không bắt buộc)</label>
                      <textarea
                        className="form-control"
                        value={form.notes}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, notes: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Cột phải: Đơn hàng */}
            <div className="col-md-5">
              <div
                className="bg-white p-3 rounded-3 mb-4"
                style={{ border: "1.5px solid #f3f3f3" }}
              >
                <h5 className="fw-bold mb-3">Đơn hàng của bạn</h5>

                {selectedVoucher &&
                  subtotal < selectedVoucher.min_order_value && (
                    <div className="alert alert-warning mt-2">
                      Bạn không đủ điều kiện để dùng voucher này (Đơn tối thiểu:{" "}
                      {selectedVoucher.min_order_value.toLocaleString("vi-VN")}
                      ₫)
                    </div>
                  )}
                <table className="table mb-3">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th className="text-end">Tạm tính</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems?.length > 0 &&
                      cartItems.map((item) => (
                        <tr key={item.id}>
                          <td>
                            {item.product.name} ×{item.quantity}
                          </td>
                          <td className="text-end">
                            {(
                              item.product.price *
                              (1 - item.product.discount / 100) *
                              item.quantity
                            ).toLocaleString("vi-VN")}
                            ₫
                          </td>
                        </tr>
                      ))}
                    <tr>
                      <td>
                        <b>Tạm tính</b>
                      </td>
                      <td className="text-end">
                        {subtotal.toLocaleString("vi-VN")}₫
                      </td>
                    </tr>
                    <tr>
                      <td>Giảm giá voucher</td>
                      <td className="text-end">
                        -{discount.toLocaleString("vi-VN")}₫
                      </td>
                    </tr>
                    <tr>
                      <td>Phí vận chuyển</td>
                      <td className="text-end">
                        {shipping === 0
                          ? "Miễn phí"
                          : shipping.toLocaleString("vi-VN") + "₫"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>Tổng cộng</b>
                      </td>
                      <td className="text-end">
                        <b style={{ color: "#22c55e", fontSize: 18 }}>
                          {total.toLocaleString("vi-VN")}₫
                        </b>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="mb-3">
                  <label className="fw-bold mb-2">Mã giảm giá</label>
                  <div className="d-flex align-items-center mb-3">
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      {vouchers.map((voucher) => (
                        <div
                          onClick={() => setSelectedVoucher(voucher)}
                          className={`badge ${
                            voucher.id === selectedVoucher?.id
                              ? ""
                              : "badge-foreground"
                          }`}
                          key={voucher.id}
                        >
                          {voucher.code}
                        </div>
                      ))}

                      {/* {selectedProductVoucher && (
                        <div className="badge bg-success me-1">
                          Sản phẩm: {selectedProductVoucher}
                        </div>
                      )}
                      {selectedShippingVoucher && (
                        <div className="badge bg-info">
                          Vận chuyển: {selectedShippingVoucher}
                        </div>
                      )} */}
                      {/* {!(selectedProductVoucher || selectedShippingVoucher) && (
                        <span className="text-muted">
                          Chưa chọn mã giảm giá
                        </span>
                      )} */}
                    </div>
                  </div>

                  {!isFormInfoComplete() ? (
                    <div className="alert alert-warning">
                      <i className="fa-solid fa-exclamation-triangle me-2"></i>
                      <strong>
                        Vui lòng nhập đầy đủ thông tin nhận hàng trước khi chọn
                        phương thức thanh toán
                      </strong>
                    </div>
                  ) : (
                    <>
                      <div
                        className="alert mb-3"
                        style={{
                          backgroundColor: "#f0fdf4",
                          borderColor: "#bbf7d0",
                          color: "#166534",
                        }}
                      >
                        <i className="fa-solid fa-check-circle me-2"></i>
                        <strong>Thông tin nhận hàng đã đầy đủ!</strong> Bây giờ
                        bạn có thể chọn phương thức thanh toán.
                      </div>
                      <div className="form-check mt-2">
                        <input
                          type="radio"
                          className="form-check-input"
                          checked={form.payment === "vnpay"}
                          onChange={() =>
                            setForm((f) => ({ ...f, payment: "vnpay" }))
                          }
                        />
                        <label className="form-check-label">
                          <b>Ví điện tử (VNPay)</b>
                        </label>
                        <div className="small text-muted ms-4">
                          Thanh toán nhanh chóng và an toàn qua ví điện tử. Bạn
                          sẽ được chuyển đến trang thanh toán.
                        </div>
                      </div>
                      <div className="form-check mt-2">
                        <input
                          type="radio"
                          className="form-check-input"
                          checked={form.payment === "cod"}
                          onChange={() =>
                            setForm((f) => ({ ...f, payment: "cod" }))
                          }
                        />
                        <label className="form-check-label">
                          Thanh toán khi nhận hàng
                        </label>
                      </div>
                    </>
                  )}
                </div>

                {/* Thông báo lỗi nếu thiếu thông tin */}
                {errorFields.length > 0 && (
                  <div className="alert alert-danger">
                    Bạn chưa nhập: {errorFields.join(", ")}
                  </div>
                )}
                <button
                  className="btn btn-primary w-100 fw-bold"
                  style={{
                    background:
                      isFormInfoComplete() && form.payment
                        ? "#22c55e"
                        : "#bdbdbd",
                    border: 0,
                    borderRadius: 8,
                    fontSize: 18,
                    opacity: isFormInfoComplete() && form.payment ? 1 : 0.7,
                    cursor:
                      isFormInfoComplete() && form.payment
                        ? "pointer"
                        : "not-allowed",
                  }}
                  disabled={!isFormInfoComplete() || !form.payment}
                  onClick={handleOrder}
                >
                  {!isFormInfoComplete()
                    ? "Vui lòng nhập đầy đủ thông tin"
                    : !form.payment
                    ? "Vui lòng chọn phương thức thanh toán"
                    : "Đặt hàng"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default CheckoutPage;
