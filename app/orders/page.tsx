"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import { Order, OrderItem, OrderStatus } from "@/types";
import { formatDateTime } from "@/helpers/format";
import { toast } from "react-toastify";
import Pagination from "@/components/Pagination";
import { useCart } from "@/context/CartContext";

const STATUS_LABELS = [
  { key: OrderStatus.PENDING, label: "Chờ xử lý" },
  { key: OrderStatus.CONFIRMED, label: "Đã xác nhận" },
  { key: OrderStatus.DELIVERED, label: "Đang giao hàng" },
  { key: OrderStatus.SUCCESS, label: "Đã hoàn thành" },
  { key: OrderStatus.CANCELLED, label: "Đã hủy" },
];

// Hàm lấy trạng thái hiển thị dựa trên trạng thái đơn hàng và thanh toán
const getDisplayStatus = (order: Order) => {
  // Ưu tiên hiển thị trạng thái đơn hàng nếu đã hủy
  if (order.status === OrderStatus.CANCELLED) {
    return "Đã hủy";
  }

  const payment =
    order.payments && order.payments.length > 0 ? order.payments[0] : null;

  // Nếu có payment và trạng thái thanh toán là pending hoặc failed
  if (
    payment &&
    (payment.status.toLowerCase() === "pending" ||
      payment.status.toLowerCase() === "failed")
  ) {
    return "Chưa thanh toán";
  }

  // Ngược lại hiển thị theo trạng thái đơn hàng
  return (
    STATUS_LABELS.find((s) => s.key === order.status)?.label || order.status
  );
};

// Helper functions for payment display
const getPaymentMethodLabel = (method: string) => {
  switch (method.toLowerCase()) {
    case "vnpay":
      return "VNPay";
    case "cod":
      return "Thanh toán khi nhận hàng";
    case "cash":
      return "Tiền mặt";
    default:
      return method;
  }
};

const getPaymentStatusLabel = (status: string) => {
  switch (status.toLowerCase()) {
    case "success":
      return "Thành công";
    case "pending":
      return "Chờ xử lý";
    case "failed":
      return "Thất bại";
    case "cancelled":
      return "Đã hủy";
    case "refunded":
      return "Đã hoàn tiền";
    default:
      return status;
  }
};

const getPaymentStatusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "success":
      return "bg-success";
    case "pending":
      return "bg-warning";
    case "failed":
    case "cancelled":
      return "bg-danger";
    case "refunded":
      return "bg-info";
    default:
      return "bg-secondary";
  }
};

// Hàm tạo ghi chú dựa trên phương thức thanh toán và trạng thái
const getOrderNote = (order: Order) => {
  const payment =
    order.payments && order.payments.length > 0 ? order.payments[0] : null;

  if (!payment) {
    return "";
  }

  // Nếu là VNPay và đã hủy đơn hàng
  if (
    payment.payment_method.toLowerCase() === "vnpay" &&
    order.status === OrderStatus.CANCELLED
  ) {
    return "VNPay Test - Không hoàn tiền";
  }

  return "";
};

export default function OrdersPage() {
  const { fetchCart } = useCart();
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
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [addresses, setAddresses] = useState<
    {
      id: number;
      street: string;
      district: string;
      city: string;
      is_default: boolean;
    }[]
  >([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [cancelReason, setCancelReason] = useState("");

  // Reorder states
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [reorderItems, setReorderItems] = useState<OrderItem[]>([]);
  const [selectedReorderItems, setSelectedReorderItems] = useState<number[]>(
    []
  );

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

  // Mở modal cập nhật địa chỉ
  const handleUpdateAddress = () => {
    if (
      selectedOrder?.user?.address &&
      Array.isArray(selectedOrder.user.address)
    ) {
      setAddresses(selectedOrder.user.address);
    } else {
      setAddresses([]);
    }
    setShowAddressModal(true);
  };

  // Cập nhật địa chỉ giao hàng
  const handleUpdateOrderAddress = async () => {
    if (!selectedAddressId || !selectedOrder) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    try {
      await api.patch(`/order/${selectedOrder.id}`, {
        addressId: selectedAddressId,
      });

      toast.success("Cập nhật địa chỉ giao hàng thành công!");
      setShowAddressModal(false);
      setSelectedAddressId(null);

      // Reload đơn hàng để cập nhật thông tin
      if (selectedOrder) {
        handleViewDetails(selectedOrder);
      }
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Có lỗi xảy ra khi cập nhật địa chỉ");
    }
  };

  // Mở modal hủy đơn hàng
  const handleCancelOrder = () => {
    setShowCancelModal(true);
  };

  // Hủy đơn hàng
  const handleConfirmCancelOrder = async () => {
    if (!cancelReason.trim() || !selectedOrder) {
      toast.error("Vui lòng nhập lý do hủy đơn hàng");
      return;
    }

    try {
      await api.patch(`/order/${selectedOrder.id}/cancel`, {
        reason: cancelReason,
      });

      // Cập nhật trạng thái đơn hàng ngay lập tức
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, status: OrderStatus.CANCELLED }
            : order
        )
      );

      // Cập nhật selectedOrder nếu đang mở modal chi tiết
      if (selectedOrder) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: OrderStatus.CANCELLED } : null
        );
      }

      toast.success("Hủy đơn hàng thành công!");
      setShowCancelModal(false);
      setCancelReason("");
      closeModal();

      // Reload danh sách đơn hàng để đảm bảo đồng bộ
      loadOrders(currentPage);
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Có lỗi xảy ra khi hủy đơn hàng");
    }
  };

  // Kiểm tra có nên hiển thị nút "Thanh toán ngay" không
  const shouldShowPaymentButton = (order: Order) => {
    // Chỉ hiển thị nút thanh toán nếu:
    // 1. Đơn hàng đang pending hoặc cancelled
    // 2. Trạng thái thanh toán chưa thành công (không phải success)
    // 3. Phương thức thanh toán là VNPay
    const payment =
      order.payments && order.payments.length > 0 ? order.payments[0] : null;
    const isPaymentNotSuccess =
      !payment || payment.status.toLowerCase() !== "success";
    const isPendingOrCancelled =
      order.status === OrderStatus.PENDING ||
      order.status === OrderStatus.CANCELLED;
    const isVnPay = payment && payment.payment_method.toLowerCase() === "vnpay";

    return isPendingOrCancelled && isPaymentNotSuccess && isVnPay;
  };

  // Kiểm tra có thể mua lại không
  const canReorder = (order: Order) => {
    const payment =
      order.payments && order.payments.length > 0 ? order.payments[0] : null;
    return (
      order.status === OrderStatus.SUCCESS &&
      payment &&
      payment.status.toLowerCase() === "success"
    );
  };

  // Mở modal mua lại và load danh sách sản phẩm
  const handleReorder = async (order: Order) => {
    try {
      console.log("Opening reorder modal for order:", order);
      setSelectedOrder(order);
      setShowReorderModal(true);

      // Load danh sách sản phẩm từ đơn hàng cũ
      console.log("Loading order items from API...");
      const response = await api.get(`/order/${order.id}`);
      console.log("Order items loaded:", response.data);
      const items = response.data.orderItem || [];
      setReorderItems(items);

      // Mặc định check all tất cả sản phẩm
      const allItemIds = items.map((item: OrderItem) => item.id);
      setSelectedReorderItems(allItemIds);
      console.log("Auto-selected all items:", allItemIds);
    } catch (error) {
      console.error("Error loading order items:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách sản phẩm");
    }
  };

  // Chọn/bỏ chọn sản phẩm để mua lại
  const toggleReorderItem = (itemId: number) => {
    setSelectedReorderItems((prev) => {
      const newSelection = prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId];
      console.log("Updated selected items:", newSelection);
      return newSelection;
    });
  };

  // Thêm sản phẩm đã chọn vào giỏ hàng
  const handleAddToCart = async () => {
    if (selectedReorderItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm");
      return;
    }

    if (!selectedOrder) {
      toast.error("Không tìm thấy thông tin đơn hàng");
      return;
    }

    try {
      console.log("Selected reorder items:", selectedReorderItems);
      console.log("Selected order:", selectedOrder);

      // Lọc sản phẩm đã chọn
      const selectedItems = reorderItems.filter((item) =>
        selectedReorderItems.includes(item.id)
      );

      console.log("Selected items for cart/add-multiple:", selectedItems);

      // Chuẩn bị payload cho API add-multiple
      const itemsPayload = selectedItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      console.log("Payload for cart/add-multiple:", { items: itemsPayload });

      // Gọi API thêm nhiều sản phẩm vào giỏ hàng
      const response = await api.post("/cart/add-multiple", {
        items: itemsPayload,
      });

      console.log("Cart add-multiple SUCCESS:", response.data);

      // Cập nhật cart state để hiển thị độ dài mới
      try {
        await fetchCart();
        console.log("Cart state refreshed successfully");
      } catch (cartError) {
        console.error("Error refreshing cart state:", cartError);
      }

      toast.success(
        `Đã thêm ${selectedReorderItems.length} sản phẩm vào giỏ hàng!`
      );
      setShowReorderModal(false);
      setSelectedReorderItems([]);
      setReorderItems([]);
    } catch (error) {
      console.error("Error adding items to cart:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        console.error("Error response:", axiosError.response?.data);
        toast.error(
          `Lỗi: ${
            axiosError.response?.data?.message ||
            "Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng"
          }`
        );
      } else {
        toast.error("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng");
      }
    }
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
                  <th>Phương thức thanh toán</th>
                  <th>Trạng thái thanh toán</th>
                  <th>Ghi chú</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  // Lấy thông tin thanh toán từ payment đầu tiên (nếu có)
                  const payment =
                    order.payments && order.payments.length > 0
                      ? order.payments[0]
                      : null;

                  return (
                    <tr
                      key={order.id}
                      className={
                        order.status === OrderStatus.CANCELLED
                          ? "table-danger"
                          : ""
                      }
                    >
                      <td>{order.id}</td>
                      <td>
                        {order.createdAt && formatDateTime(order.createdAt)}
                      </td>
                      <td>{order.total_price?.toLocaleString("vi-VN")} Đ</td>
                      <td>
                        <span
                          className={
                            order.status === OrderStatus.CANCELLED
                              ? "text-danger fw-bold"
                              : ""
                          }
                        >
                          {getDisplayStatus(order)}
                        </span>
                      </td>
                      <td>
                        {payment ? (
                          <span className="badge bg-primary">
                            {getPaymentMethodLabel(payment.payment_method)}
                          </span>
                        ) : (
                          <span className="text-muted">Chưa có</span>
                        )}
                      </td>
                      <td>
                        {payment ? (
                          <span
                            className={`badge ${getPaymentStatusBadgeClass(
                              payment.status
                            )}`}
                          >
                            {getPaymentStatusLabel(payment.status)}
                          </span>
                        ) : (
                          <span className="text-muted">Chưa có</span>
                        )}
                      </td>
                      <td>
                        <small className="text-muted">
                          {getOrderNote(order)}
                        </small>
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
                          {shouldShowPaymentButton(order) && (
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handlePayment(order.id)}
                            >
                              Thanh toán
                            </button>
                          )}
                          {canReorder(order) && (
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => handleReorder(order)}
                            >
                              <i className="fas fa-shopping-cart me-1"></i>
                              Mua lại
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
                                getDisplayStatus(selectedOrder) ===
                                "Chưa thanh toán"
                                  ? "bg-danger"
                                  : selectedOrder.status === OrderStatus.PENDING
                                  ? "bg-warning"
                                  : selectedOrder.status ===
                                    OrderStatus.CONFIRMED
                                  ? "bg-info"
                                  : selectedOrder.status ===
                                    OrderStatus.DELIVERED
                                  ? "bg-primary"
                                  : selectedOrder.status === OrderStatus.SUCCESS
                                  ? "bg-success"
                                  : "bg-danger"
                              }`}
                            >
                              {getDisplayStatus(selectedOrder)}
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

                      {/* Thông tin địa chỉ giao hàng */}
                      {selectedOrder.address && (
                        <div className="row mb-4">
                          <div className="col-12">
                            <h6 className="fw-bold">Địa chỉ giao hàng</h6>
                            <div className="card">
                              <div className="card-body">
                                <p className="mb-1">
                                  <strong>Địa chỉ:</strong>{" "}
                                  {selectedOrder.address.street}
                                </p>
                                <p className="mb-1">
                                  <strong>Quận/Huyện:</strong>{" "}
                                  {selectedOrder.address.district}
                                </p>
                                <p className="mb-0">
                                  <strong>Thành phố:</strong>{" "}
                                  {selectedOrder.address.city}
                                </p>
                                {selectedOrder.address.is_default && (
                                  <span className="badge bg-primary mt-2">
                                    Mặc định
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

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
                              <th>Giá sau giảm</th>
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
                                  {item.product?.price !== undefined ? (
                                    <>
                                      {item.product.price.toLocaleString(
                                        "vi-VN"
                                      )}
                                      ₫
                                    </>
                                  ) : (
                                    <span className="text-muted">
                                      Chờ tải dữ liệu
                                    </span>
                                  )}
                                </td>
                                <td>
                                  {item.product?.discount !== undefined &&
                                  item.product.discount > 0 ? (
                                    <span className="text-danger">
                                      -{item.product.discount}%
                                      <br />
                                      <small>
                                        (Giảm:{" "}
                                        {(
                                          item.product.price *
                                          (item.product.discount / 100)
                                        ).toLocaleString("vi-VN")}
                                        ₫)
                                      </small>
                                    </span>
                                  ) : (
                                    <span className="text-muted">
                                      Không giảm
                                    </span>
                                  )}
                                </td>
                                <td>
                                  {item.unit_price !== undefined ? (
                                    <strong className="text-success">
                                      {item.unit_price.toLocaleString("vi-VN")}₫
                                      <br />
                                      <small className="text-muted">
                                        (Sau giảm giá)
                                      </small>
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
                  {shouldShowPaymentButton(selectedOrder) && (
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
                  {selectedOrder.status === OrderStatus.PENDING && (
                    <>
                      <button
                        type="button"
                        className="btn btn-info me-2"
                        onClick={handleUpdateAddress}
                      >
                        <i className="fas fa-map-marker-alt me-1"></i>
                        Cập nhật địa chỉ
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger me-2"
                        onClick={handleCancelOrder}
                      >
                        <i className="fas fa-times-circle me-1"></i>
                        Hủy đơn hàng
                      </button>
                    </>
                  )}
                  {selectedOrder.status === OrderStatus.SUCCESS && (
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

        {/* Modal cập nhật địa chỉ */}
        {showAddressModal && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setShowAddressModal(false)}
          >
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    Cập nhật địa chỉ giao hàng
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddressModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* Hiển thị địa chỉ hiện tại */}
                  {selectedOrder?.address && (
                    <div className="mb-4">
                      <h6 className="fw-bold text-primary">Địa chỉ hiện tại</h6>
                      <div className="card bg-light">
                        <div className="card-body">
                          <p className="mb-1">
                            <strong>Địa chỉ:</strong>{" "}
                            {selectedOrder.address.street}
                          </p>
                          <p className="mb-1">
                            <strong>Quận/Huyện:</strong>{" "}
                            {selectedOrder.address.district}
                          </p>
                          <p className="mb-0">
                            <strong>Thành phố:</strong>{" "}
                            {selectedOrder.address.city}
                          </p>
                          {selectedOrder.address.is_default && (
                            <span className="badge bg-primary mt-2">
                              Mặc định
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label">
                      Chọn địa chỉ giao hàng mới
                    </label>
                    <select
                      className="form-select"
                      value={selectedAddressId || ""}
                      onChange={(e) =>
                        setSelectedAddressId(Number(e.target.value))
                      }
                    >
                      <option value="">-- Chọn địa chỉ --</option>
                      {addresses && addresses.length > 0 ? (
                        addresses.map((address) => (
                          <option key={address.id} value={address.id}>
                            {address.street}, {address.district}, {address.city}
                            {address.is_default && " (Mặc định)"}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          Không có địa chỉ nào
                        </option>
                      )}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={() => setShowAddressModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleUpdateOrderAddress}
                  >
                    Cập nhật
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal hủy đơn hàng */}
        {showCancelModal && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setShowCancelModal(false)}
          >
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-danger">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Hủy đơn hàng
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCancelModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="alert alert-warning">
                    <i className="fas fa-info-circle me-2"></i>
                    Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không
                    thể hoàn tác.
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Lý do hủy đơn hàng <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Vui lòng nhập lý do hủy đơn hàng..."
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={() => setShowCancelModal(false)}
                  >
                    Không hủy
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleConfirmCancelOrder}
                  >
                    Xác nhận hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal mua lại sản phẩm */}
        {showReorderModal && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setShowReorderModal(false)}
          >
            <div
              className="modal-dialog modal-lg modal-dialog-scrollable"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="fas fa-shopping-cart me-2"></i>
                    Mua lại sản phẩm
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowReorderModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    Chọn sản phẩm bạn muốn mua lại từ đơn hàng này
                  </div>

                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th style={{ width: "50px" }}>Chọn</th>
                          <th>Hình ảnh</th>
                          <th>Tên sản phẩm</th>
                          <th>Số lượng</th>
                          <th>Giá gốc</th>
                          <th>Giảm giá</th>
                          <th>Giá sau giảm</th>
                          <th>Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reorderItems.map((item) => {
                          const isSelected = selectedReorderItems.includes(
                            item.id
                          );
                          const totalPrice = item.unit_price * item.quantity;

                          return (
                            <tr
                              key={item.id}
                              className={isSelected ? "table-success" : ""}
                            >
                              <td className="text-center">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={isSelected}
                                  onChange={() => toggleReorderItem(item.id)}
                                />
                              </td>
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
                                  <span className="text-muted">-</span>
                                )}
                              </td>
                              <td>
                                <strong>
                                  {item.product?.name || "Sản phẩm"}
                                </strong>
                              </td>
                              <td className="text-center">{item.quantity}</td>
                              <td>
                                {item.product?.price?.toLocaleString("vi-VN")}₫
                              </td>
                              <td>
                                {item.product?.discount &&
                                item.product.discount > 0 ? (
                                  <span className="text-danger">
                                    -{item.product.discount}%
                                  </span>
                                ) : (
                                  <span className="text-muted">Không giảm</span>
                                )}
                              </td>
                              <td>
                                <strong className="text-success">
                                  {item.unit_price?.toLocaleString("vi-VN")}₫
                                </strong>
                              </td>
                              <td>
                                <strong className="text-primary">
                                  {totalPrice?.toLocaleString("vi-VN")}₫
                                </strong>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {selectedReorderItems.length > 0 && (
                    <div className="alert alert-success mt-3">
                      <i className="fas fa-check-circle me-2"></i>
                      Đã chọn {selectedReorderItems.length} sản phẩm để mua lại
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={() => setShowReorderModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={handleAddToCart}
                    disabled={selectedReorderItems.length === 0}
                  >
                    <i className="fas fa-shopping-cart me-1"></i>
                    Thêm vào giỏ hàng ({selectedReorderItems.length})
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
