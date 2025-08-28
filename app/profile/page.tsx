'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { useAuth } from '../context/AuthContext';
import { profileService } from '../lib/profileService';

import AddressManager from '../components/user/AddressManager';
import PaymentStatus from '../components/payment/PaymentStatus';
import PaymentStatusTester from '../components/payment/PaymentStatusTester';
import api from '@/lib/axios';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  images: string;
}

interface Order {
  id: number;
  createdAt: string;
  price: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  deliveryDate: string;
  items: OrderItem[];
  address: string;
  user: Record<string, unknown> | null;
  quantity: number;
  comment: string;
}

export default function ProfilePage() {
  const { profile, setProfile, refreshProfile } = useAuth();
  const [form, setForm] = useState({ 
    name: profile?.name || '', 
    phone: profile?.phone || '', 
    email: profile?.email || '', 
    image: profile?.image || '' 
  });
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({ name: profile.name, phone: profile.phone, email: profile.email, image: profile.image });
    }
  }, [profile]);

  // Fetch orders function
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await api.get('/order');
      const apiOrders = response.data?.data || response.data || [];
      
      const mappedOrders = apiOrders.map((order: Record<string, unknown>) => ({
        id: order.id,
        createdAt: order.createdAt || new Date().toISOString(),
        price: order.price || order.payment_amount || 0,
        status: order.status || order.payment_status || 'pending',
        paymentMethod: order.paymentMethod || order.payment_method || 'COD',
        paymentStatus: order.paymentStatus || order.payment_status || 'pending',
        deliveryDate: order.deliveryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: order.items || [],
        address: order.address || 'Chưa có địa chỉ giao hàng',
        user: order.user || null,
        quantity: order.quantity || 1,
        comment: order.comment || ''
      }));
      
      setOrders(mappedOrders);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch orders from API
  useEffect(() => {
    fetchOrders();
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  const getStatusDisplay = (status: string) => {
    const statusMap: { [key: string]: { label: string; color: string; icon: string } } = {
      // Trạng thái đơn hàng
      'pending': { label: 'Chờ xử lý', color: '#ffc107', icon: 'fas fa-clock' },
      'confirmed': { label: 'Đã chấp nhận', color: '#28a745', icon: 'fas fa-check-circle' },
      'shipping': { label: 'Đang giao hàng', color: '#17a2b8', icon: 'fas fa-truck' },
      'delivered': { label: 'Đã giao hàng', color: '#6f42c1', icon: 'fas fa-box-check' },
      'cancelled': { label: 'Đã hủy', color: '#dc3545', icon: 'fas fa-times-circle' },
      
      // Trạng thái thanh toán
      'payment_pending': { label: 'Chưa thanh toán', color: '#ffc107', icon: 'fas fa-credit-card' },
      'payment_success': { label: 'Thanh toán thành công', color: '#28a745', icon: 'fas fa-check-circle' },
      'payment_failed': { label: 'Thanh toán thất bại', color: '#dc3545', icon: 'fas fa-exclamation-triangle' },
      'payment_insufficient_funds': { label: 'Số dư không đủ', color: '#dc3545', icon: 'fas fa-exclamation-circle' },
      'payment_processing': { label: 'Đang xử lý thanh toán', color: '#17a2b8', icon: 'fas fa-spinner fa-spin' },
      'payment_refunded': { label: 'Đã hoàn tiền', color: '#6c757d', icon: 'fas fa-undo' },
      'payment_partial': { label: 'Thanh toán một phần', color: '#fd7e14', icon: 'fas fa-percentage' }
    };
    return statusMap[status] || { label: 'Không xác định', color: '#6c757d', icon: 'fas fa-question-circle' };
  };

  // Hàm hủy đơn hàng
  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }
    
    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      if (!token) {
        alert('Vui lòng đăng nhập để thực hiện thao tác này');
        return;
      }
      
      await api.put(`/order/${orderId}/cancel`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
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
        // Mở modal chi tiết đơn hàng
        setSelectedOrder(orderDetail);
        setShowOrderDetailModal(true);
      }
    } catch {
      alert('Không thể tải chi tiết đơn hàng');
    }
  };

  // Hàm xem hóa đơn
  const handleViewInvoice = (orderId: number) => {
    // Mở hóa đơn trong tab mới
    window.open(`/invoice/${orderId}`, '_blank');
  };

  // Hàm theo dõi đơn hàng
  const handleTrackOrder = (orderId: number) => {
    // Mở trang theo dõi đơn hàng
    window.open(`/track-order/${orderId}`, '_blank');
  };

  if (!profile) return <div className="container py-5">Loading...</div>;

  return (
    <>
      {/* Order Detail Modal */}
      {showOrderDetailModal && selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h3 style={{ margin: 0 }}>Chi tiết đơn hàng #{selectedOrder.id}</h3>
              <button 
                onClick={() => setShowOrderDetailModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6c757d'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <strong>Ngày đặt:</strong> {formatDate(selectedOrder.createdAt)}
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <strong>Tổng tiền:</strong> {formatPrice(selectedOrder.price)}
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <strong>Phương thức thanh toán:</strong> {selectedOrder.paymentMethod}
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <strong>Trạng thái:</strong> {getStatusDisplay(selectedOrder.status).label}
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <strong>Ghi chú:</strong> {selectedOrder.comment || 'Không có'}
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <strong>Địa chỉ giao hàng:</strong> {selectedOrder.address}
            </div>
            
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button 
                onClick={() => setShowOrderDetailModal(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: '1px solid #6c757d',
                  background: 'transparent',
                  color: '#6c757d',
                  cursor: 'pointer'
                }}
              >
                Đóng
              </button>
              <button 
                onClick={() => handleViewInvoice(selectedOrder.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: '1px solid #007bff',
                  background: '#007bff',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Xem hóa đơn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb Section */}
      <div className="breadcrumb-section">
        <div className="container">
          <h3 className="text-center">Tài Khoản</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Trang Chủ</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Tài Khoản</li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="main-content">
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
                  {/* Thông tin cá nhân */}
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
                            <label className="form-label" htmlFor="name">Họ và tên*</label>
                            <input className="form-control" id="name" type="text" value={form.name} onChange={handleChange} required />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label" htmlFor="phone">Số điện thoại*</label>
                            <input className="form-control" id="phone" type="tel" value={form.phone} onChange={handleChange} required />
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="email">Email*</label>
                          <input className="form-control" id="email" type="email" value={form.email} onChange={handleChange} required />
                        </div>
                        <button className="update-profile-btn" type="submit" disabled={updateLoading}>
                          {updateLoading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                        </button>
                        {updateSuccess && <div className="text-success mt-3">{updateSuccess}</div>}
                        {updateError && <div className="text-danger mt-3">{updateError}</div>}
                      </form>
                    </div>
                  </div>

                  {/* Quản lý địa chỉ */}
                  <div className="tab-pane fade" id="list-messages" role="tabpanel" aria-labelledby="list-messages-list">
                    <AddressManager />
                  </div>

                  {/* Đơn hàng của tôi */}
                  <div className="tab-pane fade" id="list-profile" role="tabpanel" aria-labelledby="list-profile-list">
                    <div className="orders-section">
                      <h3>Đơn hàng của tôi</h3>
                      {ordersLoading ? (
                        <div className="text-center py-4">
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : orders.length === 0 ? (
                        <div className="text-center py-4">
                          <p>Bạn chưa có đơn hàng nào</p>
                          <Link href="/" className="btn btn-primary">
                            Mua sắm ngay
                          </Link>
                        </div>
                      ) : (
                        <div style={{ display: 'grid', gap: '24px' }}>
                          {orders.map((order) => {
                            const statusInfo = getStatusDisplay(order.status);
                            return (
                              <div key={order.id} style={{
                                border: '1px solid #e9ecef',
                                borderRadius: '12px',
                                overflow: 'hidden'
                              }}>
                                <div style={{
                                  padding: '16px',
                                  background: '#f8f9fa',
                                  borderBottom: '1px solid #e9ecef'
                                }}>
                                  <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                  }}>
                                    <div>
                                      <strong>Đơn hàng #{order.id}</strong>
                                      <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                        {formatDate(order.createdAt)}
                                      </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
                                        {formatPrice(order.price)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div style={{ padding: '16px' }}>
                                  <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '12px'
                                  }}>
                                    <div>
                                      <strong>Phương thức thanh toán:</strong> {order.paymentMethod}
                                    </div>
                                    <div>
                                      <strong>Ngày giao dự kiến:</strong> {formatDate(order.deliveryDate)}
                                    </div>
                                  </div>
                                  
                                  <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '12px'
                                  }}>
                                    <div>
                                      <strong>Địa chỉ giao hàng:</strong> {order.address}
                                    </div>
                                  </div>
                                  
                                  <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '12px'
                                  }}>
                                    <div>
                                      <strong>Trạng thái thanh toán:</strong>
                                      <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '4px 8px',
                                        borderRadius: 12,
                                        fontSize: 12,
                                        fontWeight: 600,
                                        marginLeft: '8px',
                                        background: order.paymentStatus === 'paid' ? '#d4edda' : 
                                                   order.paymentStatus === 'pending' ? '#fff3cd' : '#f8d7da',
                                        color: order.paymentStatus === 'paid' ? '#155724' : 
                                               order.paymentStatus === 'pending' ? '#856404' : '#721c24'
                                      }}>
                                        <i className={`fas fa-${order.paymentStatus === 'paid' ? 'check-circle' : 
                                                           order.paymentStatus === 'pending' ? 'clock' : 'times-circle'}`}></i>
                                        {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 
                                         order.paymentStatus === 'pending' ? 'Chờ thanh toán' : 'Chưa thanh toán'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="order-status" style={{
                                  padding: '16px',
                                  borderTop: '1px solid #e9ecef',
                                  background: '#f8f9fa'
                                }}>
                                  <span className="status" style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '6px 12px',
                                    borderRadius: 20,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    background: statusInfo.color,
                                    color: 'white',
                                    marginBottom: 8
                                  }}>
                                    <i className={statusInfo.icon}></i>
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
                                    className="view-detail-btn" 
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
                                    onClick={() => handleViewOrderDetail(order.id)}
                                  >
                                    Chi tiết
                                  </button>
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
                                      border: '1px solid #28a745',
                                      background: '#28a745',
                                      color: 'white',
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
                  </div>

                  {/* Phương thức thanh toán */}
                  <div className="tab-pane fade" id="list-payment" role="tabpanel" aria-labelledby="list-payment-list">
                    <PaymentStatusTester orderId={1} />
                    
                    <div className="payment-status-demo" style={{ marginBottom: '32px' }}>
                      <h4 style={{ marginBottom: '20px', color: '#495057' }}>Trạng thái thanh toán mẫu</h4>
                      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                        <PaymentStatus 
                          status="payment_pending" 
                          paymentMethod="Thẻ tín dụng" 
                          amount={150000} 
                          showDetails={true} 
                        />
                        <PaymentStatus 
                          status="payment_success" 
                          paymentMethod="Ví điện tử" 
                          amount={250000} 
                          showDetails={true} 
                        />
                        <PaymentStatus 
                          status="payment_failed" 
                          paymentMethod="Chuyển khoản ngân hàng" 
                          amount={500000} 
                          showDetails={true} 
                        />
                        <PaymentStatus 
                          status="payment_insufficient_funds" 
                          paymentMethod="Thẻ ATM" 
                          amount={1000000} 
                          showDetails={true} 
                        />
                        <PaymentStatus 
                          status="payment_processing" 
                          paymentMethod="Momo" 
                          amount={75000} 
                          showDetails={true} 
                        />
                        <PaymentStatus 
                          status="payment_refunded" 
                          paymentMethod="ZaloPay" 
                          amount={120000} 
                          showDetails={true} 
                        />
                      </div>
                    </div>
                    
                    <div className="payment-methods">
                      <div className="method">
                        <input className="form-check-input" type="radio" name="payment" id="paypal" checked />
                        <label className="label-name" htmlFor="paypal">
                          <Image className="img-icon" src="/client/images/paypal.png" alt="Paypal" width={50} height={30} />
                          Paypal
                        </label>
                      </div>
                      <div className="method">
                        <input className="form-check-input" type="radio" name="payment" id="visa" />
                        <label className="label-name" htmlFor="visa">
                          <Image className="img-icon" src="/client/images/visa.png" alt="Visa" width={50} height={30} />
                          **** **** **** 8047
                        </label>
                      </div>
                      <div className="method">
                        <input className="form-check-input" type="radio" name="payment" id="googlepay" />
                        <label className="label-name" htmlFor="googlepay">
                          <Image className="img-icon" src="/client/images/gg.png" alt="Google Pay" width={50} height={30} />
                          Google Pay
                        </label>
                      </div>
                      <div className="method">
                        <input className="form-check-input" type="radio" name="payment" id="cod" />
                        <label className="label-name" htmlFor="cod">
                          <Image className="img-icon" src="/client/images/cash.png" alt="Cash On Delivery" width={50} height={30} />
                          Thanh toán khi nhận hàng
                        </label>
                      </div>
                      <div className="method">
                        <input className="form-check-input" type="radio" name="payment" id="newcard" />
                        <label className="label-name" htmlFor="newcard">
                          <Image className="img-icon" src="/client/images/cre.png" alt="Add New Credit/Debit Card" width={50} height={30} />
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

                  {/* Quản lý mật khẩu */}
                  <div className="tab-pane fade" id="list-password" role="tabpanel" aria-labelledby="list-password-list">
                    <div className="change-password">
                      <div className="form-group">
                        <label htmlFor="oldPassword">Mật khẩu hiện tại</label><span className="required">*</span>
                        <input id="oldPassword" type="password" placeholder="Nhập mật khẩu hiện tại" value={passwordForm.oldPassword} onChange={handlePasswordChange} required />
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

                  {/* Đăng xuất */}
                  <div className="tab-pane fade" id="list-logout" role="tabpanel" aria-labelledby="list-logout-list">
                    <div className="logout-section">
                      <p>Bạn có chắc chắn muốn đăng xuất?</p>
                      <button 
                        onClick={() => {
                          localStorage.removeItem('token');
                          localStorage.removeItem('access_token');
                          window.location.href = '/login';
                        }}
                        style={{
                          padding: '12px 24px',
                          borderRadius: 6,
                          border: '1px solid #dc3545',
                          background: '#dc3545',
                          color: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

