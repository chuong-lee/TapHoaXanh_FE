"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import { Order } from "@/types";
import { formatDateTime } from "@/helpers/format";

const STATUS_LABELS = [
  { key: "pending", label: "Chưa thanh toán" },
  { key: "success", label: "Đã thanh toán" },
  { key: "fail", label: "Đã hủy" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api
      .get("/order/owned")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setOrders(data);
        console.log(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }, []);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  return (
    <main className="main-content">
      <div className="container py-4">
        <h2 className="fw-bold mb-4">Đơn hàng của tôi</h2>
        {loading ? (
          <div>Đang tải đơn hàng...</div>
        ) : orders.length === 0 ? (
          <div className="alert alert-info">
            Không có đơn hàng nào ở mục này.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Ngày đặt</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>
                      {order.createdAt && formatDateTime(order.createdAt)}
                    </td>
                    <td>{order.total_price?.toLocaleString("vi-VN")} Đ</td>
                    <td>
                      {STATUS_LABELS.find((s) => s.key === order.status)?.label}
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleViewDetails(order)}
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal chi tiết đơn hàng */}
        {showModal && selectedOrder && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={closeModal}
          >
            <div
              className="modal-dialog modal-lg modal-dialog-scrollable"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Chi tiết đơn hàng</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* Thông tin đơn hàng */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <h6 className="fw-bold">Thông tin đơn hàng</h6>
                      <p>
                        <strong>Mã đơn:</strong> {selectedOrder.order_code}
                      </p>
                      <p>
                        <strong>Ngày đặt:</strong>{" "}
                        {formatDateTime(selectedOrder.createdAt!)}
                      </p>
                      <p>
                        <strong>Trạng thái:</strong>
                        <span
                          className={`badge ms-2 ${
                            selectedOrder.status === "pending"
                              ? "bg-warning"
                              : selectedOrder.status === "confirmed"
                              ? "bg-info"
                              : selectedOrder.status === "success"
                              ? "bg-primary"
                              : selectedOrder.status === "pending_cod"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {
                            STATUS_LABELS.find(
                              (s) => s.key === selectedOrder.status
                            )?.label
                          }
                        </span>
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fw-bold">Tổng tiền</h6>
                      <p className="h4 text-success">
                        {selectedOrder.total_price?.toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                  </div>

                  {/* Danh sách sản phẩm */}
                  <h6 className="fw-bold mb-3">Sản phẩm đã đặt</h6>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Hình ảnh</th>
                          <th>Tên sản phẩm</th>
                          <th>Số lượng</th>
                          <th>Giá gốc</th>
                          <th>Giảm giá</th>
                          <th>đã dùng voucher</th>
                          <th>Hạn sử dụng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.orderItem?.map((item) => (
                          <tr key={item.id}>
                            <td>
                              {item.product?.images ? (
                                <Image
                                  src={item.product.images}
                                  alt={item.product.name || "Sản phẩm"}
                                  width={60}
                                  height={60}
                                  style={{
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                  }}
                                />
                              ) : (
                                <span className="text-muted">
                                  Chờ tải dữ liệu
                                </span>
                              )}
                            </td>
                            <td>
                              {item.product?.name ? (
                                <div>
                                  <strong>{item.product.name}</strong>
                                  <br />
                                  <small className="text-muted">
                                    {item.product.description}
                                  </small>
                                </div>
                              ) : (
                                <span className="text-muted">
                                  Chờ tải dữ liệu
                                </span>
                              )}
                            </td>
                            <td className="text-center">
                              {item.quantity ?? (
                                <span className="text-muted">
                                  Chờ tải dữ liệu
                                </span>
                              )}
                            </td>
                            <td>
                              {item.product?.price !== undefined &&
                              item.product?.discount !== undefined ? (
                                <>
                                  {(
                                    item.product.price + item.product.discount
                                  ).toLocaleString("vi-VN")}
                                  ₫
                                </>
                              ) : (
                                <span className="text-muted">
                                  Chờ tải dữ liệu
                                </span>
                              )}
                            </td>
                            <td>
                              {item.product?.discount !== undefined ? (
                                <span className="text-danger">
                                  -
                                  {item.product.discount.toLocaleString(
                                    "vi-VN"
                                  )}
                                  ₫
                                </span>
                              ) : (
                                <span className="text-muted">
                                  Chờ tải dữ liệu
                                </span>
                              )}
                            </td>
                            <td>
                              {item.unit_price !== undefined ? (
                                <strong className="text-success">
                                  {item.unit_price.toLocaleString("vi-VN")}₫
                                </strong>
                              ) : (
                                <span className="text-muted">
                                  Chờ tải dữ liệu
                                </span>
                              )}
                            </td>
                            <td>
                              {item.product?.expiry_date ? (
                                new Date(
                                  item.product.expiry_date
                                ).toLocaleDateString("vi-VN")
                              ) : (
                                <span className="text-muted">
                                  Chờ tải dữ liệu
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Voucher đã sử dụng */}
                  {selectedOrder.voucher &&
                    selectedOrder.voucher.length > 0 && (
                      <div className="mt-4">
                        <h6 className="fw-bold mb-3">Voucher đã sử dụng</h6>
                        <div className="row">
                          {selectedOrder.voucher.map((voucher) => (
                            <div key={voucher.id} className="col-md-6 mb-2">
                              <div className="card">
                                <div className="card-body p-3">
                                  <h6 className="card-title">{voucher.code}</h6>
                                  <p className="card-text small">
                                    Giảm tối đa:{" "}
                                    {voucher.max_discount.toLocaleString(
                                      "vi-VN"
                                    )}
                                    ₫
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Thông tin thanh toán */}
                  {selectedOrder.payments &&
                    selectedOrder.payments.length > 0 && (
                      <div className="mt-4">
                        <h6 className="fw-bold mb-3">Thông tin thanh toán</h6>
                        <div className="row">
                          {selectedOrder.payments.map((payment, index) => (
                            <div key={index} className="col-md-6 mb-2">
                              <div className="card">
                                <div className="card-body p-3">
                                  <p className="card-text small">
                                    Phương thức:{" "}
                                    {payment.payment_method || "Chưa xác định"}
                                  </p>
                                  <p className="card-text small">
                                    Trạng thái:{" "}
                                    {payment.status || "Chưa xác định"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-warning me-2">
                    Đánh giá
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
