"use client"
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import AdminOrderNotification from "@/components/AdminOrderNotification";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    shippingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
    totalProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [ordersResponse, productsResponse, orderStatsResponse] = await Promise.all([
        api.get('/order'),
        api.get('/products'),
        api.get('/order/statistics')
      ]);

      const orders = Array.isArray(ordersResponse.data) ? ordersResponse.data : [];
      const products = Array.isArray(productsResponse.data) ? productsResponse.data : [];
      const orderStats = orderStatsResponse.data;

      const totalRevenue = orders.reduce((sum, order) => sum + (order.price || 0), 0);

      setStats({
        totalOrders: orderStats.total || orders.length,
        pendingOrders: orderStats.byStatus?.pending || 0,
        confirmedOrders: orderStats.byStatus?.confirmed || 0,
        shippingOrders: orderStats.byStatus?.shipping || 0,
        deliveredOrders: orderStats.byStatus?.delivered || 0,
        totalRevenue,
        totalProducts: products.length
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning';
      case 'confirmed': return 'bg-info';
      case 'preparing': return 'bg-primary';
      case 'shipping': return 'bg-warning';
      case 'delivered': return 'bg-success';
      case 'cancelled': return 'bg-danger';
      case 'returned': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'preparing': return 'Đang chuẩn bị';
      case 'shipping': return 'Đang vận chuyển';
      case 'delivered': return 'Đã giao hàng';
      case 'cancelled': return 'Đã hủy';
      case 'returned': return 'Đã trả hàng';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p className="mt-2">Đang tải thống kê...</p>
      </div>
    );
  }

  return (
    <>
      <AdminOrderNotification onNewOrder={fetchStats} />
      
      <div className="container py-4">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="fw-bold mb-0">Dashboard</h2>
            <p className="text-muted">Tổng quan hệ thống Tạp Hóa Xanh</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card bg-primary text-white h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title mb-0">Tổng đơn hàng</h6>
                    <h3 className="mb-0 mt-2">{stats.totalOrders}</h3>
                  </div>
                  <div className="fs-1">
                    <i className="fa-solid fa-shopping-cart"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card bg-warning text-white h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title mb-0">Chờ xác nhận</h6>
                    <h3 className="mb-0 mt-2">{stats.pendingOrders}</h3>
                  </div>
                  <div className="fs-1">
                    <i className="fa-solid fa-clock"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card bg-info text-white h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title mb-0">Chờ vận chuyển</h6>
                    <h3 className="mb-0 mt-2">{stats.confirmedOrders}</h3>
                  </div>
                  <div className="fs-1">
                    <i className="fa-solid fa-truck"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card bg-success text-white h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title mb-0">Đã giao hàng</h6>
                    <h3 className="mb-0 mt-2">{stats.deliveredOrders}</h3>
                  </div>
                  <div className="fs-1">
                    <i className="fa-solid fa-check-circle"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue and Products */}
        <div className="row mb-4">
          <div className="col-md-6 mb-3">
            <div className="card bg-success text-white h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title mb-0">Doanh thu</h6>
                    <h3 className="mb-0 mt-2">{stats.totalRevenue.toLocaleString('vi-VN')}₫</h3>
                  </div>
                  <div className="fs-1">
                    <i className="fa-solid fa-money-bill-wave"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <div className="card bg-info text-white h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title mb-0">Sản phẩm</h6>
                    <h3 className="mb-0 mt-2">{stats.totalProducts}</h3>
                  </div>
                  <div className="fs-1">
                    <i className="fa-solid fa-box"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fa-solid fa-bolt me-2"></i>
                  Thao tác nhanh
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 mb-2">
                    <a href="/admin/orders" className="btn btn-outline-primary w-100">
                      <i className="fa-solid fa-shopping-cart me-2"></i>
                      Quản lý đơn hàng
                    </a>
                  </div>
                  <div className="col-md-3 mb-2">
                    <a href="/admin/orders/pending-shipping" className="btn btn-outline-warning w-100">
                      <i className="fa-solid fa-truck me-2"></i>
                      Chờ vận chuyển
                    </a>
                  </div>
                  <div className="col-md-3 mb-2">
                    <a href="/admin/products" className="btn btn-outline-success w-100">
                      <i className="fa-solid fa-box me-2"></i>
                      Quản lý sản phẩm
                    </a>
                  </div>
                  <div className="col-md-3 mb-2">
                    <a href="/admin/categories" className="btn btn-outline-info w-100">
                      <i className="fa-solid fa-tags me-2"></i>
                      Quản lý danh mục
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="fa-solid fa-list me-2"></i>
                  Đơn hàng gần đây
                </h5>
                <a href="/admin/orders" className="btn btn-sm btn-outline-primary">
                  Xem tất cả
                </a>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Mã đơn</th>
                        <th>Ngày đặt</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Placeholder for recent orders */}
                      <tr>
                        <td colSpan={4} className="text-center text-muted">
                          <i className="fa-solid fa-inbox me-2"></i>
                          Chưa có đơn hàng nào
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 