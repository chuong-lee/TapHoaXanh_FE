"use client";

import { useState, useRef, useEffect, useReducer } from "react";
import { useAuth } from "../context/AuthContext";
import { profileService } from "../lib/profileService";
import { Tabs, Tab, Form } from "react-bootstrap";
import LogoutButton from "../components/logout";
import Avatar from "../components/Avatar";
import AddressList from "../components/AddressList";
import Wishlist from "../components/Wishlist";

export default function ProfilePage() {
  const { profile, setProfile, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    name: profile?.name || "",
    phone: profile?.phone || "",
    email: profile?.email || "",
    image: profile?.image || "",
  });
  const updateLoadingRef = useRef(false);
  const updateSuccessRef = useRef<string | null>(null);
  const updateErrorRef = useRef<string | null>(null);

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const passwordLoadingRef = useRef(false);
  const passwordSuccessRef = useRef<string | null>(null);
  const passwordErrorRef = useRef<string | null>(null);

  // Avatar upload
  const avatarFileRef = useRef<File | null>(null);
  const avatarLoadingRef = useRef(false);
  const avatarSuccessRef = useRef<string | null>(null);
  const avatarErrorRef = useRef<string | null>(null);

  // Force update function để trigger re-render khi cần
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name,
        phone: profile.phone,
        email: profile.email,
        image: profile.image,
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateLoadingRef.current = true;
    updateSuccessRef.current = null;
    updateErrorRef.current = null;
    try {
      const updated = await profileService.updateProfile(form);
      setProfile(updated);
      updateSuccessRef.current = "Thông tin đã được cập nhật!";
    } catch {
      updateErrorRef.current = "Cập nhật thông tin thất bại!";
    } finally {
      updateLoadingRef.current = false;
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [id]: value }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    passwordLoadingRef.current = true;
    passwordSuccessRef.current = null;
    passwordErrorRef.current = null;
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      passwordErrorRef.current =
        "Mật khẩu mới và mật khẩu xác nhận không khớp!";
      passwordLoadingRef.current = false;
      return;
    }
    try {
      await profileService.updatePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      passwordSuccessRef.current = "Mật khẩu đã được cập nhật!";
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      refreshProfile();
    } catch {
      passwordErrorRef.current = "Cập nhật mật khẩu thất bại!";
    } finally {
      passwordLoadingRef.current = false;
    }
  };

  // avatar tự động upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      avatarFileRef.current = file;
      avatarErrorRef.current = null;
      avatarSuccessRef.current = null;

      // Tự động upload ngay lập tức
      await handleAvatarUpload();
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async () => {
    if (!avatarFileRef.current) return;

    avatarLoadingRef.current = true;
    avatarErrorRef.current = null;
    avatarSuccessRef.current = null;

    try {
      const result = await profileService.uploadAvatar(avatarFileRef.current);

      // Cập nhật profile với avatar mới
      if (profile) {
        const updatedProfile = {
          name: profile.name,
          phone: profile.phone,
          email: profile.email,
          image: result.imageUrl,
        };
        setProfile(updatedProfile);
        setForm((prev) => ({ ...prev, image: result.imageUrl }));
      }

      avatarSuccessRef.current = result.message;
      avatarFileRef.current = null;

      // Reset input file
      const fileInput = document.getElementById(
        "avatar-input"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch {
      avatarErrorRef.current = "Upload avatar thất bại. Vui lòng thử lại.";
    } finally {
      avatarLoadingRef.current = false;
      forceUpdate();
    }
  };

  // Removed unnecessary useEffect that was causing infinite re-renders

  if (!profile) return <div className="container py-5">Loading...</div>;

  return (
    <section>
      <div className="my-account mt5">
        <div className="container">
          <h1 className="page-title">Thông tin người dùng</h1>
          {/* <div className="breadcrumb mt-3">
            <Link href="/">Trang chủ </Link>
            <span>/</span>
            <span>Thông tin người dùng</span>
          </div> */}
          <div className="row">
            <div className="col-lg-12">
              <Tabs
                defaultActiveKey="personal"
                id="profile-tabs"
                className="mb-3"
                fill
              >
                <Tab eventKey="personal" title="Thông tin cá nhân">
                  <div className="profile-section">
                    <div className="profile-header d-flex align-items-center mb-4">
                      <div className="profile-image position-relative">
                        <Avatar
                          image={form.image}
                          name={form.name}
                          size={100}
                        />
                        {/* <div className="edit-icon"><i className="fas fa-edit"></i></div> */}
                      </div>
                      <div className="avatar-upload-section ms-4">
                        <div className="mb-3">
                          <label htmlFor="avatar-input" className="form-label">
                            Thay đổi avatar
                          </label>
                          <input
                            type="file"
                            id="avatar-input"
                            className="form-control"
                            accept="image/*"
                            onChange={handleAvatarChange}
                          />
                        </div>
                        {avatarLoadingRef.current && (
                          <div className="text-info mt-2">
                            Đang upload avatar...
                          </div>
                        )}
                        {avatarSuccessRef.current && (
                          <div className="text-success mt-2">
                            {avatarSuccessRef.current}
                          </div>
                        )}
                        {avatarErrorRef.current && (
                          <div className="text-danger mt-2">
                            {avatarErrorRef.current}
                          </div>
                        )}
                      </div>
                    </div>
                    <form
                      className="profile-form"
                      id="profile-form"
                      onSubmit={handleSubmit}
                    >
                      <div className="mb-3">
                        <label className="form-label" htmlFor="name">
                          Tên người dùng
                        </label>
                        <input
                          className="form-control"
                          id="name"
                          type="text"
                          value={form.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label" htmlFor="email">
                          Địa chỉ email<span className="text-danger">*</span>
                        </label>
                        <Form.Control
                          type="email"
                          id="email"
                          value={form.email}
                          onChange={handleChange}
                          disabled
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label" htmlFor="phone">
                          Số điện thoại
                        </label>
                        <input
                          className="form-control"
                          id="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mt-4">
                        <button
                          className="btn btn-warning"
                          type="submit"
                          disabled={updateLoadingRef.current}
                        >
                          {updateLoadingRef.current
                            ? "Updating..."
                            : "Thay đổi thông tin"}
                        </button>
                      </div>
                      {updateSuccessRef.current && (
                        <div className="text-success mt-2">
                          {updateSuccessRef.current}
                        </div>
                      )}
                      {updateErrorRef.current && (
                        <div className="text-danger mt-2">
                          {updateErrorRef.current}
                        </div>
                      )}
                    </form>
                  </div>
                </Tab>
                <Tab eventKey="addresses" title="Địa chỉ giao hàng">
                  <AddressList />
                </Tab>
                <Tab eventKey="wishlist" title="Sản phẩm yêu thích">
                  <Wishlist />
                </Tab>
                {/* <Tab eventKey="orders" title="Thông tin đơn hàng">
                  <h2>Orders</h2>
                  <div className="table-container">
                    <table className="order-table">
                      <thead>
                        <tr>
                          <th>Order ID | #SDGT1254FD</th>
                          <th>Total Payment</th>
                          <th>Payment Method</th>
                          <th>Estimated Delivery Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>#SDGT1254FD</td>
                          <td>$74.00</td>
                          <td>Paypal</td>
                          <td>29 July 2024</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="order-status">
                      <span className="status">Accepted</span>
                      <p>Your Order has been Accepted</p>
                    </div>
                    <div className="order-actions">
                      <button className="track-order-btn">Track Order</button>
                      <button className="invoice-btn">Invoice</button>
                      <button className="cancel-order-btn">Cancel Order</button>
                    </div>
                  </div>
                </Tab> */}
                {/* <Tab eventKey="payments" title="Phương thức thanh toán">
                  <div className="payment-methods">
                    <div className="method">
                      <input className="form-check-input" type="radio" name="payment" id="paypal" defaultChecked />
                      <label className="label-name" htmlFor="paypal"><Image className="img-icon" src="/client/images/paypal.jpg" alt="Paypal" width={24} height={24} />Paypal</label>
                    </div>
                    <div className="method">
                      <input className="form-check-input" type="radio" name="payment" id="visa" />
                      <label className="label-name" htmlFor="visa"><Image className="img-icon" src="/client/images/visa.jpg" alt="Visa" width={24} height={24} />**** **** **** 8047</label>
                    </div>
                    <div className="method">
                      <input className="form-check-input" type="radio" name="payment" id="googlepay" />
                      <label className="label-name" htmlFor="googlepay"><Image className="img-icon" src="/client/images/gg.jpg" alt="Google Pay" width={24} height={24} />Google Pay</label>
                    </div>
                    <div className="method">
                      <input className="form-check-input" type="radio" name="payment" id="cod" />
                      <label className="label-name" htmlFor="cod"><Image className="img-icon" src="/client/images/cash.jpg" alt="Cash On Delivery" width={24} height={24} />Cash On Delivery</label>
                    </div>
                    <div className="method">
                      <input className="form-check-input" type="radio" name="payment" id="newcard" />
                      <label className="label-name" htmlFor="newcard"><Image className="img-icon" src="/client/images/cre.jpg" alt="Add New Credit/Debit Card" width={24} height={24} />Add New Credit/Debit Card</label>
                    </div>
                    <div className="card-details">
                      <div className="form-group">
                        <label htmlFor="cardHolder">Card Holder Name</label><span className="required">*</span>
                        <input id="cardHolder" type="text" placeholder="Ex. John Dae" required />
                      </div>
                      <div className="form-group">
                        <label htmlFor="cardNumber">Card Number</label><span className="required">*</span>
                        <input id="cardNumber" type="text" placeholder="4716 9627 1635 8047" required />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="expiryDate">Expiry Date</label><span className="required">*</span>
                          <input id="expiryDate" type="text" placeholder="MM/YY" required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="cvv">CVV</label><span className="required">*</span>
                          <input id="cvv" type="text" placeholder="000" required />
                        </div>
                      </div>
                      <div className="form-group">
                        <input id="saveCard" type="checkbox" />
                        <label htmlFor="saveCard">Save card for future payments</label>
                      </div>
                      <button className="add-card-btn">Add Card</button>
                    </div>
                  </div>
                </Tab> */}
                <Tab eventKey="password" title="Đổi mật khẩu">
                  <div
                    className="change-password-form card p-4 shadow-sm"
                    style={{ maxWidth: 400, margin: "0 auto" }}
                  >
                    <h4 className="change-password-title mb-4 text-center">
                      Đổi mật khẩu
                    </h4>
                    <form onSubmit={handlePasswordSubmit}>
                      <div className="form-group mb-3">
                        <label htmlFor="oldPassword" className="form-label">
                          Mật khẩu cũ
                        </label>
                        <input
                          id="oldPassword"
                          className="form-control"
                          type="password"
                          placeholder="Nhập mật khẩu cũ"
                          required
                          value={passwordForm.oldPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="newPassword" className="form-label">
                          Mật khẩu mới
                        </label>
                        <input
                          id="newPassword"
                          className="form-control"
                          type="password"
                          placeholder="Nhập mật khẩu mới"
                          required
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>
                      <div className="form-group mb-4">
                        <label htmlFor="confirmPassword" className="form-label">
                          Xác nhận mật khẩu mới
                        </label>
                        <input
                          id="confirmPassword"
                          className="form-control"
                          type="password"
                          placeholder="Nhập lại mật khẩu mới"
                          required
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>
                      <button
                        className="btn btn-success w-100 change-password-btn"
                        type="submit"
                        disabled={passwordLoadingRef.current}
                      >
                        {passwordLoadingRef.current
                          ? "Đang cập nhật..."
                          : "Đổi mật khẩu"}
                      </button>
                      {passwordSuccessRef.current && (
                        <div className="text-success mt-3 text-center">
                          {passwordSuccessRef.current}
                        </div>
                      )}
                      {passwordErrorRef.current && (
                        <div className="text-danger mt-3 text-center">
                          {passwordErrorRef.current}
                        </div>
                      )}
                    </form>
                  </div>
                </Tab>
                <Tab eventKey="logout" title="Đăng xuất">
                  <h1>Đăng xuất</h1>
                  <p>Bạn có chắc chắn muốn đăng xuất?</p>
                  <LogoutButton />
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
