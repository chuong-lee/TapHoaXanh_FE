"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import { Order, OrderItem } from "@/types";
import { formatDateTime } from "@/helpers/format";
import { toast } from "react-toastify";
import Pagination from "@/components/Pagination";

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
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState<{
    [key: number]: { rating: number; comment: string };
  }>({});
  const [submittedReviews, setSubmittedReviews] = useState<
    {
      productId: number;
      productName: string;
      orderId: number;
      comment: string | null;
      rating: number | null;
    }[]
  >([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10; // Số đơn hàng mỗi trang

  const loadOrders = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await api.get("/order/owned-paginated", {
        params: {
          page,
          limit,
        },
      });

      // Xử lý response data - Backend trả về cấu trúc với meta object
      const data = response.data;
      const ordersData = data.data || [];
      const meta = data.meta || {};

      setOrders(ordersData);
      setTotal(meta.total || ordersData.length);
      setTotalPages(
        meta.lastPage || Math.ceil((meta.total || ordersData.length) / limit)
      );
      setCurrentPage(page);

      console.log("Orders data:", ordersData);
      console.log("Pagination meta:", meta);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(1);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadOrders(page);
  };

  const handleViewDetails = async (order: Order) => {
    try {
      setLoadingDetails(true);
      // Fetch thông tin đơn hàng mới nhất từ API
      const response = await api.get(`/order/${order.id}`);
      setSelectedOrder(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Có lỗi xảy ra khi tải chi tiết đơn hàng!");
      // Fallback: sử dụng dữ liệu cũ nếu API lỗi
      setSelectedOrder(order);
      setShowModal(true);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleReview = () => {
    setShowReviewModal(true);
    console.log(1111, selectedOrder);

    if (selectedOrder) {
      loadSubmittedReviews(selectedOrder.id);
    }
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setReviews({}); // Reset reviews khi đóng modal
  };

  // Kiểm tra xem sản phẩm đã được đánh giá chưa
  const isProductReviewed = (productId: number) => {
    // Sử dụng refreshTrigger để force re-evaluation
    const _ = refreshTrigger;
    const existingReview = submittedReviews.find(
      (r) => r.productId === productId
    );
    return (
      existingReview &&
      (existingReview.rating !== null || existingReview.comment !== null)
    );
  };

  // Lấy thông tin đánh giá của sản phẩm
  const getProductReview = (productId: number) => {
    // Sử dụng refreshTrigger để force re-evaluation
    const _ = refreshTrigger;
    return submittedReviews.find((r) => r.productId === productId);
  };

  // Load danh sách đánh giá đã gửi khi mở modal
  const loadSubmittedReviews = async (orderId: number) => {
    try {
      const response = await api.get(`/products/rating`, {
        params: { id: orderId },
      });
      // Lưu toàn bộ dữ liệu rating để kiểm tra chi tiết
      setSubmittedReviews(response.data);
    } catch (error) {
      console.error("Error loading submitted reviews:", error);
    }
  };

  const handleRatingChange = (productId: number, rating: number) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        rating: rating,
      },
    }));
  };

  const handleCommentChange = (productId: number, comment: string) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        comment: comment,
      },
    }));
  };

  const handleSubmitReview = async (productId: number) => {
    const review = reviews[productId];
    if (!review || !review.rating) {
      toast.error("Vui lòng chọn số sao đánh giá");
      return;
    }

    try {
      // Gọi API /rating để gửi đánh giá
      await api.post("/rating", {
        product_id: productId,
        rating: review.rating,
        comment: review.comment || "",
      });

      toast.success("Đánh giá đã được gửi thành công!");

      // Thêm vào danh sách đã gửi
      const newSubmittedReview = {
        productId: productId,
        productName: "", // Sẽ được cập nhật từ order data
        orderId: selectedOrder?.id || 0,
        comment: review.comment || null,
        rating: review.rating,
      };

      setSubmittedReviews((prev) => {
        // Kiểm tra xem đã có review cho sản phẩm này chưa
        const existingIndex = prev.findIndex((r) => r.productId === productId);
        if (existingIndex >= 0) {
          // Cập nhật review đã có
          const updated = [...prev];
          updated[existingIndex] = newSubmittedReview;
          return updated;
        } else {
          // Thêm review mới
          return [...prev, newSubmittedReview];
        }
      });

      // Xóa review đã gửi khỏi form
      setReviews((prev) => {
        const newReviews = { ...prev };
        delete newReviews[productId];
        return newReviews;
      });

      // Trigger re-render để cập nhật UI
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Có lỗi xảy ra khi gửi đánh giá");
    }
  };

  const handlePayment = async (orderId: number) => {
    try {
      const response = await api.post("/payment/create-payment", {
        orderId: orderId,
      });

      const paymentUrl = response.data.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        toast.error("Không thể tạo link thanh toán. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại.");
    }
  };

  const isPaymentPending = (status: string) => {
    return status === "pending" || status === "fail";
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
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleViewDetails(order)}
                          disabled={loadingDetails}
                        >
                          {loadingDetails ? "Đang tải..." : "Xem chi tiết"}
                        </button>
                        {isPaymentPending(order.status) && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handlePayment(order.id)}
                          >
                            Thanh toán
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {total > limit && (
          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="text-muted small">
                Hiển thị {(currentPage - 1) * limit + 1} -{" "}
                {Math.min(currentPage * limit, total)} trong tổng số {total} đơn
                hàng
              </div>
              <div className="text-muted small">
                Trang {currentPage} / {totalPages}
              </div>
            </div>
            <Pagination
              currentPage={currentPage}
              totalItems={total}
              itemsPerPage={limit}
              onPageChange={handlePageChange}
            />
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
                  {loadingDetails ? (
                    <div className="text-center py-4">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Đang tải...</span>
                      </div>
                      <p className="mt-2">Đang tải chi tiết đơn hàng...</p>
                    </div>
                  ) : (
                    <>
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
                            {selectedOrder.total_price?.toLocaleString("vi-VN")}
                            ₫
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
                                        item.product.price +
                                        item.product.discount
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
                                      <h6 className="card-title">
                                        {voucher.code}
                                      </h6>
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
                            <h6 className="fw-bold mb-3">
                              Thông tin thanh toán
                            </h6>
                            <div className="row">
                              <div className="col-md-6 mb-2">
                                <div className="card">
                                  <div className="card-body p-3">
                                    <p className="card-text small">
                                      Phương thức:{" "}
                                      {selectedOrder.payments[
                                        selectedOrder.payments.length - 1
                                      ].payment_method || "Chưa xác định"}
                                    </p>
                                    <p className="card-text small">
                                      Trạng thái:{" "}
                                      {selectedOrder.payments[
                                        selectedOrder.payments.length - 1
                                      ].status || "Chưa xác định"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                    </>
                  )}
                </div>
                <div className="modal-footer">
                  {isPaymentPending(selectedOrder.status) && (
                    <button
                      type="button"
                      className="btn btn-success me-2"
                      onClick={() => {
                        handlePayment(selectedOrder.id);
                        closeModal();
                      }}
                    >
                      <i className="fas fa-credit-card me-1"></i>
                      Thanh toán ngay
                    </button>
                  )}
                  {selectedOrder.status === "success" && (
                    <button
                      type="button"
                      className="btn btn-warning me-2"
                      onClick={handleReview}
                    >
                      <i className="fas fa-star me-1"></i>
                      Đánh giá
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    <i className="fas fa-times me-1"></i>
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal đánh giá sản phẩm */}
        {showReviewModal && selectedOrder && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="fas fa-star me-2"></i>
                    Đánh giá sản phẩm
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeReviewModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    {selectedOrder.orderItem?.map((item: OrderItem) => (
                      <div key={item.id} className="col-12">
                        <div className="card">
                          <div className="card-body">
                            <div className="row align-items-center">
                              <div className="col-md-2">
                                <Image
                                  src={
                                    Array.isArray(item.product.images)
                                      ? item.product.images[0]
                                      : typeof item.product.images === "string"
                                      ? item.product.images.split(",")[0] ||
                                        "/images/placeholder.jpg"
                                      : "/images/placeholder.jpg"
                                  }
                                  alt={item.product.name}
                                  width={80}
                                  height={80}
                                  style={{
                                    objectFit: "contain",
                                    width: "100%",
                                    height: "80px",
                                    background: "transparent",
                                  }}
                                />
                              </div>
                              <div className="col-md-6">
                                <h6 className="card-title mb-1">
                                  {item.product.name}
                                </h6>
                                <p className="text-muted small mb-1">
                                  Số lượng: {item.quantity}
                                </p>
                                <p className="text-success fw-bold mb-0">
                                  {(
                                    item.product.price *
                                    (1 - item.product.discount / 100)
                                  ).toLocaleString()}
                                  ₫
                                </p>
                              </div>
                              <div className="col-md-4">
                                {isProductReviewed(item.product.id) ? (
                                  (() => {
                                    const existingReview = getProductReview(
                                      item.product.id
                                    );
                                    const hasRating =
                                      existingReview?.rating !== null;
                                    const hasComment =
                                      existingReview?.comment !== null;

                                    return (
                                      // Đã đánh giá
                                      <div className="text-center">
                                        <div className="text-success mb-2">
                                          <i className="fas fa-check-circle fa-2x"></i>
                                        </div>
                                        <p className="text-success fw-bold mb-0">
                                          Đã đánh giá
                                        </p>
                                        {hasRating && (
                                          <div className="mb-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                              <span
                                                key={star}
                                                style={{
                                                  color:
                                                    (existingReview?.rating ||
                                                      0) >= star
                                                      ? "#ffc107"
                                                      : "#dee2e6",
                                                  fontSize: "14px",
                                                }}
                                              >
                                                ★
                                              </span>
                                            ))}
                                            <span className="small text-muted ms-1">
                                              ({existingReview?.rating}/5)
                                            </span>
                                          </div>
                                        )}
                                        {hasComment &&
                                          existingReview?.comment && (
                                            <small className="text-muted d-block">
                                              &ldquo;{existingReview.comment}
                                              &rdquo;
                                            </small>
                                          )}
                                        <small className="text-muted">
                                          Cảm ơn bạn đã đánh giá sản phẩm!
                                        </small>
                                      </div>
                                    );
                                  })()
                                ) : (
                                  // Chưa đánh giá - hiển thị form
                                  <div className="d-flex flex-column gap-2">
                                    {/* Đánh giá sao */}
                                    <div className="d-flex align-items-center gap-1">
                                      <span className="small text-muted me-2">
                                        Đánh giá:
                                      </span>
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                          key={star}
                                          type="button"
                                          className="btn btn-link p-0"
                                          onClick={() =>
                                            handleRatingChange(
                                              item.product.id,
                                              star
                                            )
                                          }
                                          style={{
                                            color:
                                              (reviews[item.product.id]
                                                ?.rating || 0) >= star
                                                ? "#ffc107"
                                                : "#dee2e6",
                                            fontSize: "18px",
                                            textDecoration: "none",
                                          }}
                                        >
                                          ★
                                        </button>
                                      ))}
                                      <span className="small text-muted ms-1">
                                        ({reviews[item.product.id]?.rating || 0}
                                        /5)
                                      </span>
                                    </div>

                                    {/* Ô nhập comment */}
                                    <div>
                                      <textarea
                                        className="form-control form-control-sm"
                                        placeholder="Nhận xét về sản phẩm..."
                                        rows={2}
                                        value={
                                          reviews[item.product.id]?.comment ||
                                          ""
                                        }
                                        onChange={(e) =>
                                          handleCommentChange(
                                            item.product.id,
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>

                                    {/* Nút gửi */}
                                    <button
                                      className="btn btn-warning btn-sm"
                                      onClick={() =>
                                        handleSubmitReview(item.product.id)
                                      }
                                      disabled={
                                        !reviews[item.product.id]?.rating
                                      }
                                    >
                                      <i className="fas fa-paper-plane me-1"></i>
                                      Gửi đánh giá
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeReviewModal}
                  >
                    <i className="fas fa-times me-1"></i>
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
