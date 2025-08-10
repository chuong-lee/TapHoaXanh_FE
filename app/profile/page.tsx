'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../lib/profileService';
import LogoutButton from '../components/logout';
import AddressManager from '../components/AddressManager';
import OrderList from '../components/OrderList';
import api from '@/lib/axios';

export default function ProfilePage() {
  const { profile, setProfile, refreshProfile } = useAuth();
  const [form, setForm] = useState({ name: profile?.name || '', phone: profile?.phone || '', email: profile?.email || '', image: profile?.image || '' });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  React.useEffect(() => {
    if (profile) {
      setForm({ name: profile.name, phone: profile.phone, email: profile.email, image: profile.image });
    }
  }, [profile]);

  // Fetch orders from API
  React.useEffect(() => {
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        console.log('Fetching orders from API...');
        const response = await api.get('/order');
        console.log('API response status:', response.status);
        console.log('API response data:', response.data);
        
        // Handle different response formats
        let apiOrders = [];
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          apiOrders = response.data.data;
          console.log('Using response.data.data format');
        } else if (Array.isArray(response.data)) {
          apiOrders = response.data;
          console.log('Using direct array format');
        } else if (response.data && Array.isArray(response.data.orders)) {
          apiOrders = response.data.orders;
          console.log('Using response.data.orders format');
        } else {
          console.log('No valid orders array found in response');
          apiOrders = [];
        }
        
        // Map API data to our format
        const mappedOrders = apiOrders.map((order: any) => ({
          id: order.id,
          createdAt: order.createdAt || new Date().toISOString(),
          price: order.price || order.payment_amount || 0,
          status: order.status || order.payment_status || 'pending',
          paymentMethod: order.paymentMethod || order.payment_method || 'COD',
          deliveryDate: order.deliveryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          items: order.items || [],
          address: order.address || 'Chưa có địa chỉ giao hàng',
          user: order.user || null,
          quantity: order.quantity || 1,
          comment: order.comment || ''
        }));
        
        setOrders(mappedOrders);
        console.log('Orders loaded from API:', mappedOrders.length, 'orders');
        console.log('Mapped orders:', mappedOrders);
        
      } catch (error: any) {
        console.error('Error fetching orders:', error);
        console.error('Error response:', error.response);
        console.error('Error message:', error.message);
        
        // Handle specific error types
        if (error.response) {
          console.error('API Error Status:', error.response.status);
          console.error('API Error Data:', error.response.data);
          
          if (error.response.status === 401) {
            console.log('Authentication error - user may need to login');
          } else if (error.response.status === 500) {
            console.log('Server error - database may be down');
          }
        } else if (error.request) {
          console.error('Network error - no response received');
        } else {
          console.error('Request setup error:', error.message);
        }
        
        // Set empty orders array instead of showing alert
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Initialize Bootstrap tabs
  React.useEffect(() => {
    // Bootstrap tab functionality
    const triggerTabList = document.querySelectorAll('#list-tab a');
    triggerTabList.forEach(triggerEl => {
      triggerEl.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all tabs
        document.querySelectorAll('#list-tab a').forEach(tab => {
          tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-pane').forEach(pane => {
          pane.classList.remove('show', 'active');
        });
        
        // Add active class to clicked tab
        triggerEl.classList.add('active');
        
        // Show corresponding tab pane
        const target = triggerEl.getAttribute('href');
        if (target) {
          const targetPane = document.querySelector(target);
          if (targetPane) {
            targetPane.classList.add('show', 'active');
          }
        }
      });
    });

    return () => {
      // Cleanup event listeners
      triggerTabList.forEach(triggerEl => {
        triggerEl.removeEventListener('click', () => {});
      });
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateSuccess(null);
    setUpdateError(null);
    try {
      const updated = await profileService.updateProfile(form);
      setProfile(updated);
      setUpdateSuccess('Profile updated successfully!');
    } catch {
      setUpdateError('Failed to update profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [id]: value }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordSuccess(null);
    setPasswordError(null);
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      setPasswordLoading(false);
      return;
    }
    try {
      await profileService.updatePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      setPasswordSuccess('Password updated successfully!');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      refreshProfile();
    } catch {
      setPasswordError('Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const getStatusDisplay = (status: string) => {
    const statusMap: { [key: string]: { label: string; color: string } } = {
      'pending': { label: 'Chờ xử lý', color: '#ffc107' },
      'confirmed': { label: 'Đã chấp nhận', color: '#28a745' },
      'shipping': { label: 'Đang giao hàng', color: '#17a2b8' },
      'delivered': { label: 'Đã giao hàng', color: '#6f42c1' },
      'cancelled': { label: 'Đã hủy', color: '#dc3545' }
    };
    return statusMap[status] || { label: 'Không xác định', color: '#6c757d' };
  };

  // Hàm hủy đơn hàng
  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }

    try {
      await api.put(`/order/${orderId}/cancel`);
      alert('Đơn hàng đã được hủy thành công');
      fetchOrders(); // Reload orders
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Có lỗi xảy ra khi hủy đơn hàng';
      alert(errorMessage);
    }
  };

  // Hàm xem chi tiết đơn hàng
  const handleViewOrderDetail = async (orderId: number) => {
    try {
      const response = await api.get(`/order/${orderId}`);
      if (response.data.success) {
        const orderDetail = response.data.data;
        alert(`Chi tiết đơn hàng #${orderId}\nTổng tiền: ${formatPrice(orderDetail.price)}\nTrạng thái: ${getStatusDisplay(orderDetail.status).label}`);
      }
    } catch (error: any) {
      alert('Không thể tải chi tiết đơn hàng');
    }
  };

  // Hàm xem hóa đơn
  const handleViewInvoice = (orderId: number) => {
    alert(`Hóa đơn đơn hàng #${orderId}\nChức năng đang được phát triển...`);
  };

  // Hàm theo dõi đơn hàng
  const handleTrackOrder = (orderId: number) => {
    alert(`Theo dõi đơn hàng #${orderId}\nChức năng đang được phát triển...`);
  };

  if (!profile) return <div className="container py-5">Loading...</div>;

  return (
      <div className="my-account">
        <div className="container">
        <h1 className="page-title">Tài khoản của tôi</h1>
          <div className="breadcrumb">
          <Link href="/">Trang chủ</Link>
            <span>/</span>
          <span>Tài khoản của tôi</span>
        </div>
        <div className="row">
          <div className="col-lg-4">
            <div className="list-group list-group-pane" id="list-tab" role="tablist">
              <a className="list-group-item list-group-item-action active" id="list-home-list" data-bs-toggle="list" href="#list-home" role="tab" aria-controls="list-home">
                Thông tin cá nhân
              </a>
              <a className="list-group-item list-group-item-action" id="list-messages-list" data-bs-toggle="list" href="#list-messages" role="tab" aria-controls="list-messages">
                Quản lý địa chỉ
              </a>
              <a className="list-group-item list-group-item-action" id="list-profile-list" data-bs-toggle="list" href="#list-profile" role="tab" aria-controls="list-profile">
                Đơn hàng của tôi
              </a>
              <a className="list-group-item list-group-item-action" id="list-payment-list" data-bs-toggle="list" href="#list-payment" role="tab" aria-controls="list-payment">
                Phương thức thanh toán
              </a>
              <a className="list-group-item list-group-item-action" id="list-password-list" data-bs-toggle="list" href="#list-password" role="tab" aria-controls="list-password">
                Quản lý mật khẩu
              </a>
              <a className="list-group-item list-group-item-action" id="list-logout-list" data-bs-toggle="list" href="#list-logout" role="tab" aria-controls="list-settings">
                Đăng xuất
              </a>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="tab-content" id="nav-tabContent">
              <div className="tab-pane fade show active" id="list-home" role="tabpanel" aria-labelledby="list-home-list">
                  <div className="profile-section">
                    <div className="profile-header d-flex align-items-center mb-4">
                      <div className="profile-image position-relative">
                        <Image className="rounded-circle" src={form.image || '/client/images/profile.jpg'} alt="Profile Image" width={100} height={100} />
                        <div className="edit-icon"><i className="fas fa-edit"></i></div>
                      </div>
                    </div>
                    <form className="profile-form" id="profile-form" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label" htmlFor="firstName">Tên*</label>
                        <input className="form-control" id="firstName" type="text" value={form.name.split(' ')[0] || ''} required />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label" htmlFor="lastName">Họ*</label>
                        <input className="form-control" id="lastName" type="text" value={form.name.split(' ').slice(1).join(' ') || ''} required />
                      </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label" htmlFor="email">Email*</label>
                        <input className="form-control" id="email" type="email" value={form.email} onChange={handleChange} required />
                      </div>
                      <div className="mb-3">
                      <label className="form-label" htmlFor="phone">Số điện thoại*</label>
                        <input className="form-control" id="phone" type="tel" value={form.phone} onChange={handleChange} required />
                      </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="gender">Giới tính</label>
                      <select className="form-select" id="gender">
                        <option value="female" selected>Nữ</option>
                        <option value="male">Nam</option>
                        <option value="other">Khác</option>
                      </select>
                      </div>
                      <div className="mt-4">
                      <button className="btn btn-warning" type="submit" disabled={updateLoading}>
                        {updateLoading ? 'Đang cập nhật...' : 'Cập nhật thay đổi'}
                      </button>
                      </div>
                    {updateSuccess && <div className="text-success mt-3">{updateSuccess}</div>}
                    {updateError && <div className="text-danger mt-3">{updateError}</div>}
                    </form>
                  </div>
              </div>
              <div className="tab-pane fade" id="list-messages" role="tabpanel" aria-labelledby="list-messages-list">
                  <div className="address-list">
                    <div className="address-item">
                      <div className="address-info">
                        <h3 className="name">Bessie Cooper</h3>
                        <p className="address">2464 Royal Ln, Mesa, New Jersey 45463</p>
                      </div>
                      <div className="address-actions">
                        <div className="address-actions">
                        <button className="btn edit-btn text-success" type="button">Sửa</button>
                        <button className="btn delete-btn text-danger" type="button">Xóa</button>
                        </div>
                      </div>
                    </div>
                    <AddressManager />
                  </div>
                    </div>
                <div className="tab-pane fade" id="list-profile" role="tabpanel" aria-labelledby="list-profile-list">
                <h2>Đơn hàng</h2>
                
                {/* Data source indicator */}
                <div style={{
                  background: '#d4edda',
                  color: '#155724',
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 20
                }}>
                  <i className="fa-solid fa-database"></i>
                  API Data ({orders.length} đơn hàng)
                </div>

                {ordersLoading ? (
                  <div style={{ textAlign: 'center', padding: 40 }}>
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                    <p style={{ marginTop: 16, color: '#666' }}>Đang tải đơn hàng...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
                    <i className="fa-solid fa-box-open" style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}></i>
                    <p>Chưa có đơn hàng nào</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 24 }}>
                    {orders.map(order => {
                      const statusInfo = getStatusDisplay(order.status);
                      return (
                        <div key={order.id} className="table-container" style={{
                          background: 'white',
                          borderRadius: 12,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          overflow: 'hidden',
                          border: '1px solid #e9ecef'
                        }}>
                          <table className="order-table" style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: 14
                          }}>
                            <thead>
                              <tr style={{ background: '#f8f9fa' }}>
                                <th style={{ 
                                  padding: '16px', 
                                  textAlign: 'left', 
                                  fontWeight: 600,
                                  color: '#495057',
                                  borderBottom: '1px solid #dee2e6'
                                }}>
                                  Mã đơn hàng | {order.id}
                                </th>
                                <th style={{ 
                                  padding: '16px', 
                                  textAlign: 'left', 
                                  fontWeight: 600,
                                  color: '#495057',
                                  borderBottom: '1px solid #dee2e6'
                                }}>
                                  Tổng thanh toán
                                </th>
                                <th style={{ 
                                  padding: '16px', 
                                  textAlign: 'left', 
                                  fontWeight: 600,
                                  color: '#495057',
                                  borderBottom: '1px solid #dee2e6'
                                }}>
                                  Phương thức thanh toán
                                </th>
                                <th style={{ 
                                  padding: '16px', 
                                  textAlign: 'left', 
                                  fontWeight: 600,
                                  color: '#495057',
                                  borderBottom: '1px solid #dee2e6'
                                }}>
                                  Ngày giao hàng dự kiến
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td style={{ 
                                  padding: '16px',
                                  fontWeight: 600,
                                  color: '#007bff'
                                }}>
                                  {order.id}
                                </td>
                                <td style={{ 
                                  padding: '16px',
                                  fontWeight: 600,
                                  color: '#28a745'
                                }}>
                                  {formatPrice(order.price)}
                                </td>
                                <td style={{ 
                                  padding: '16px',
                                  color: '#6c757d'
                                }}>
                                  {order.paymentMethod}
                                </td>
                                <td style={{ 
                                  padding: '16px',
                                  color: '#6c757d'
                                }}>
                                  {formatDate(order.deliveryDate)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          
                          <div className="order-status" style={{
                            padding: '16px',
                            borderTop: '1px solid #e9ecef',
                            background: '#f8f9fa'
                          }}>
                            <span className="status" style={{
                              display: 'inline-block',
                              padding: '6px 12px',
                              borderRadius: 20,
                              fontSize: 12,
                              fontWeight: 600,
                              background: statusInfo.color,
                              color: 'white',
                              marginBottom: 8
                            }}>
                              {statusInfo.label}
                            </span>
                            <p style={{ 
                              margin: 0, 
                              color: '#6c757d',
                              fontSize: 14 
                            }}>
                              Đơn hàng của bạn {statusInfo.label.toLowerCase()}
                            </p>
                          </div>
                          
                          <div className="order-actions" style={{
                            padding: '16px',
                            display: 'flex',
                            gap: 12,
                            borderTop: '1px solid #e9ecef'
                          }}>
                            <button 
                              className="track-order-btn" 
                              style={{
                                padding: '8px 16px',
                                borderRadius: 6,
                                border: '1px solid #007bff',
                                background: '#007bff',
                                color: 'white',
                                fontSize: 14,
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onClick={() => handleTrackOrder(order.id)}
                            >
                              Theo dõi đơn hàng
                            </button>
                            <button 
                              className="invoice-btn" 
                              style={{
                                padding: '8px 16px',
                                borderRadius: 6,
                                border: '1px solid #6c757d',
                                background: 'transparent',
                                color: '#6c757d',
                                fontSize: 14,
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onClick={() => handleViewInvoice(order.id)}
                            >
                              Hóa đơn
                            </button>
                            {(order.status === 'pending' || order.status === 'confirmed') && (
                              <button 
                                className="cancel-order-btn" 
                                style={{
                                  padding: '8px 16px',
                                  borderRadius: 6,
                                  border: '1px solid #dc3545',
                                  background: 'transparent',
                                  color: '#dc3545',
                                  fontSize: 14,
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                                onClick={() => handleCancelOrder(order.id)}
                              >
                                Hủy đơn hàng
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="tab-pane fade" id="list-payment" role="tabpanel" aria-labelledby="list-payment-list">
                  <div className="payment-methods">
                    <div className="method">
                    <input className="form-check-input" type="radio" name="payment" id="paypal" checked />
                    <label className="label-name" htmlFor="paypal">
                      <img className="img-icon" src="client/images/paypal.png" alt="Paypal" />
                      Paypal
                    </label>
                    </div>
                    <div className="method">
                      <input className="form-check-input" type="radio" name="payment" id="visa" />
                    <label className="label-name" htmlFor="visa">
                      <img className="img-icon" src="client/images/visa.png" alt="Visa" />
                      **** **** **** 8047
                    </label>
                    </div>
                    <div className="method">
                      <input className="form-check-input" type="radio" name="payment" id="googlepay" />
                    <label className="label-name" htmlFor="googlepay">
                      <img className="img-icon" src="client/images/gg.png" alt="Google Pay" />
                      Google Pay
                    </label>
                    </div>
                    <div className="method">
                      <input className="form-check-input" type="radio" name="payment" id="cod" />
                    <label className="label-name" htmlFor="cod">
                      <img className="img-icon" src="client/images/cash.png" alt="Cash On Delivery" />
                      Thanh toán khi nhận hàng
                    </label>
                    </div>
                    <div className="method">
                      <input className="form-check-input" type="radio" name="payment" id="newcard" />
                    <label className="label-name" htmlFor="newcard">
                      <img className="img-icon" src="client/images/cre.png" alt="Add New Credit/Debit Card" />
                      Thêm thẻ tín dụng/ghi nợ mới
                    </label>
                    </div>
                    <div className="card-details">
                      <div className="form-group">
                      <label htmlFor="cardHolder">Tên chủ thẻ</label><span className="required">*</span>
                      <input id="cardHolder" type="text" placeholder="VD: Nguyễn Văn An" required />
                      </div>
                      <div className="form-group">
                      <label htmlFor="cardNumber">Số thẻ</label><span className="required">*</span>
                        <input id="cardNumber" type="text" placeholder="4716 9627 1635 8047" required />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                        <label htmlFor="expiryDate">Ngày hết hạn</label><span className="required">*</span>
                          <input id="expiryDate" type="text" placeholder="MM/YY" required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="cvv">CVV</label><span className="required">*</span>
                          <input id="cvv" type="text" placeholder="000" required />
                        </div>
                      </div>
                      <div className="form-group">
                        <input id="saveCard" type="checkbox" />
                      <label htmlFor="saveCard">Lưu thẻ cho thanh toán tương lai</label>
                    </div>
                    <button className="add-card-btn">Thêm thẻ</button>
                  </div>
                </div>
                      </div>
              <div className="tab-pane fade" id="list-password" role="tabpanel" aria-labelledby="list-password-list">
                <div className="change-password">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Mật khẩu hiện tại</label><span className="required">*</span>
                    <input id="currentPassword" type="password" placeholder="Nhập mật khẩu hiện tại" value={passwordForm.oldPassword} onChange={handlePasswordChange} required />
                      </div>
                  <div className="form-group">
                    <label htmlFor="newPassword">Mật khẩu mới</label><span className="required">*</span>
                    <input id="newPassword" type="password" placeholder="Nhập mật khẩu mới" value={passwordForm.newPassword} onChange={handlePasswordChange} required />
                      </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label><span className="required">*</span>
                    <input id="confirmPassword" type="password" placeholder="Nhập lại mật khẩu mới" value={passwordForm.confirmPassword} onChange={handlePasswordChange} required />
                  </div>
                  <button className="update-password-btn" onClick={handlePasswordSubmit} disabled={passwordLoading}>
                    {passwordLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                  </button>
                  {passwordSuccess && <div className="text-success mt-3">{passwordSuccess}</div>}
                  {passwordError && <div className="text-danger mt-3">{passwordError}</div>}
                </div>
              </div>
              <div className="tab-pane fade" id="list-logout" role="tabpanel" aria-labelledby="list-logout-list">
                  <h1>Đăng xuất</h1>
                <p>Bạn có chắc chắn muốn đăng xuất không?</p>
                  <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

