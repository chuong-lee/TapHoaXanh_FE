"use client";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/types";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";

function fixImgSrc(src: string | undefined | null): string {
  if (
    !src ||
    typeof src !== "string" ||
    !src.trim() ||
    src === "null" ||
    src === "undefined"
  )
    return "/images/placeholder.jpg";
  if (src.startsWith("http")) return src;
  if (src.startsWith("/")) return src;
  if (src.startsWith("client/images/")) return "/" + src;
  if (src.startsWith("images/")) return "/" + src;
  return "/" + src;
}

export default function CartPage() {
  const {
    isCartLoading,
    cart,
    updateQuantity,
    removeFromCart,
    removeMultipleFromCart,
  } = useCart();
  const [selected, setSelected] = useState<CartItem[]>([]);
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();

  // Load selected items from localStorage on component mount
  useEffect(() => {
    const savedSelected = localStorage.getItem("cart_selected");
    if (savedSelected) {
      try {
        const parsedSelected = JSON.parse(savedSelected);
        setSelected(parsedSelected);
      } catch (error) {
        console.error("Error parsing cart_selected from localStorage:", error);
        setSelected([]);
      }
    } else if (cart.length > 0) {
      // Mặc định chọn hết tất cả sản phẩm nếu không có cart_selected
      setSelected(cart);
      localStorage.setItem("cart_selected", JSON.stringify(cart));
    }
  }, [cart]); // Chạy khi cart thay đổi

  // Sync selected items với cart khi cart thay đổi (nhưng không reset selection)
  useEffect(() => {
    if (cart.length > 0 && selected.length === 0) {
      // Chỉ auto-select nếu chưa có gì được chọn
      setSelected(cart);
      localStorage.setItem("cart_selected", JSON.stringify(cart));
    }
  }, [cart, selected.length]);
  const handleSelect = (cartItem: CartItem) => {
    setSelected((prev) => {
      const exists = prev.some(
        (itemsSelected) => itemsSelected.product.id === cartItem.product.id
      );
      if (exists) {
        localStorage.setItem(
          "cart_selected",
          JSON.stringify(
            prev.filter(
              (itemsSelected) =>
                itemsSelected.product.id !== cartItem.product.id
            )
          )
        );
        return prev.filter(
          (itemsSelected) => itemsSelected.product.id !== cartItem.product.id
        );
      } else {
        localStorage.setItem(
          "cart_selected",
          JSON.stringify([...prev, cartItem])
        );

        return [...prev, cartItem];
      }
    });
  };

  // Tổng tiền chỉ tính sản phẩm được chọn
  const total = useMemo(() => {
    return cart.length > 0
      ? cart
          .filter((item) =>
            selected.some(
              (itemsSelected) => itemsSelected.product.id === item.product.id
            )
          )
          .reduce((sum, item) => {
            // Tính giá sau khi giảm giá
            const discountedPrice =
              item.product.price * (1 - item.product.discount / 100);
            return sum + discountedPrice * item.quantity;
          }, 0)
      : 0;
  }, [cart, selected]);

  // Hàm kiểm tra đã chọn hết chưa
  const allSelected = cart.length > 0 && selected.length === cart.length;
  const handleSelectAll = () => {
    if (allSelected) {
      localStorage.setItem("cart_selected", JSON.stringify([]));
      setSelected([]);
    } else {
      localStorage.setItem("cart_selected", JSON.stringify(cart));
      setSelected(cart);
    }
  };

  return (
    <main className="main-content">
      <div className="container py-5">
        <div className="row">
          {/* Left Column: Cart Items & Notes */}
          <div className="col-lg-8">
            <h4 className="fw-bold mb-1">Giỏ hàng của bạn</h4>
            <p className="text-muted">
              Bạn đang có {cart.length || 0} sản phẩm trong giỏ hàng
            </p>
            {isCartLoading && cart.length < 1 && (
              <div className="alert alert-warning mt-4">
                Đang tải giỏ hàng...
              </div>
            )}
            {cart.length === 0 && !isCartLoading && (
              <div className="alert alert-warning mt-4">
                Giỏ hàng của bạn đang trống.
              </div>
            )}

            {cart.length > 0 && !isCartLoading && (
              <>
                <div className="d-flex align-items-center gap-2 items-center form-check mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="select-all"
                    checked={allSelected}
                    onChange={handleSelectAll}
                  />
                  <label className="form-check-label" htmlFor="select-all">
                    Chọn tất cả
                  </label>
                  <div
                    style={{
                      marginLeft: "auto",
                      fontSize: "1rem",
                      cursor: "pointer",
                    }}
                    className="text-danger"
                    onClick={() => {
                      removeMultipleFromCart(cart.map((item) => item.id));
                    }}
                  >
                    Xóa tất cả
                  </div>
                </div>
                {/* Hiển thị tối đa 5 sản phẩm, nếu nhiều hơn thì có nút xem tất cả */}
                {(showAll ? cart : cart.slice(0, 10)).map((item, idx) => (
                  <div
                    className="card mb-3 border-0 border-bottom rounded-0 pb-3"
                    key={item.product.id + "-" + idx}
                  >
                    <div className="row g-0 align-items-center">
                      <div className="col-md-1 text-center">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selected.some(
                            (itemsSelected) =>
                              itemsSelected.product.id === item.product.id
                          )}
                          onChange={() => handleSelect(item)}
                        />
                      </div>
                      <div className="col-md-2 text-center">
                        <Image
                          src={fixImgSrc(
                            Array.isArray(item.product.images)
                              ? item.product.images[0]
                              : item.product.images
                          )}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="rounded"
                        />
                      </div>
                      <div className="col-md-5">
                        <div className="card-body py-0">
                          <h6
                            className="card-title mb-1"
                            style={{ marginTop: 12 }}
                          >
                            {item.product.name}
                          </h6>
                          <p className="card-text fw-bold">
                            {(
                              item.product.price *
                              (1 - item.product.discount / 100)
                            ).toLocaleString()}
                            ₫
                          </p>
                        </div>
                      </div>
                      <div className="col-md-3 d-flex justify-content-center">
                        <div className="input-group" style={{ width: "120px" }}>
                          <button
                            className={`btn btn-outline-secondary ${
                              item.quantity <= 1 ? "disabled" : ""
                            }`}
                            type="button"
                            disabled={item.quantity <= 1}
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity(
                                  item.product.id,
                                  "decrease",
                                  item.quantity - 1
                                );
                              }
                            }}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            className="form-control text-center"
                            value={String(item.quantity)}
                            min="1"
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value) || 0;

                              if (newQuantity >= 1) {
                                updateQuantity(
                                  item.product.id,
                                  "update",
                                  newQuantity
                                );
                              } else {
                                e.target.value = String(item.quantity);
                              }
                            }}
                          />
                          <button
                            className={`btn btn-outline-secondary ${
                              item.quantity >= 999 ? "disabled" : ""
                            }`}
                            type="button"
                            disabled={item.quantity >= 999}
                            onClick={() => {
                              if (item.quantity < 999) {
                                updateQuantity(
                                  item.product.id,
                                  "increase",
                                  item.quantity + 1
                                );
                              }
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="col-md-1 d-flex justify-content-center">
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => removeFromCart(item.id)}
                          title="Xóa sản phẩm"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Nút xem tất cả nếu có nhiều hơn 5 sản phẩm */}
                {cart.length > 5 && !showAll && (
                  <div className="text-center my-2">
                    <button
                      className="btn btn-link"
                      style={{ textDecoration: "none", fontWeight: 500 }}
                      onClick={() => setShowAll(true)}
                    >
                      Hiển thị tất cả sản phẩm{" "}
                      <span style={{ fontSize: "1.2em" }}>&#8595;</span>
                    </button>
                  </div>
                )}
                {/* Nút thu gọn nếu đã mở rộng */}
                {cart.length > 5 && showAll && (
                  <div className="text-center my-2">
                    <button
                      className="btn btn-link"
                      style={{ textDecoration: "none", fontWeight: 500 }}
                      onClick={() => setShowAll(false)}
                    >
                      Thu gọn <span style={{ fontSize: "1.2em" }}>&#8593;</span>
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Đã bỏ phần ghi chú đơn hàng ở đây */}
            {/* <div className="mt-4">
              <label htmlFor="order-notes" className="form-label fw-bold">Ghi chú đơn hàng</label>
              <textarea className="form-control" id="order-notes" rows={4}></textarea>
            </div>
            <button className="btn btn-success mt-3" style={{backgroundColor: '#005246'}}>LƯU THÔNG TIN</button> */}
          </div>

          {/* Right Column: Order Summary */}
          <div className="col-lg-4">
            <div
              className="card border-0 shadow-sm p-3 mb-4"
              style={{ marginTop: 32 }}
            >
              <div className="card-body">
                <h5 className="card-title fw-bold">Thông tin đơn hàng</h5>
                <hr />
                <table className="table mb-3">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th className="text-end">Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.length > 0 &&
                      cart
                        .filter((item) =>
                          selected?.some(
                            (itemsSelected) =>
                              itemsSelected.product.id === item.product.id
                          )
                        )
                        .map((item) => (
                          <tr key={item.id}>
                            <td>{item.product.name}</td>
                            <td className="text-end">
                              {(
                                item.product.price *
                                (1 - item.product.discount / 100)
                              ).toLocaleString("vi-VN")}
                              ₫ (x
                              {item.quantity})
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
                <div className="d-flex justify-content-between">
                  <span>Tạm tính</span>
                  <span>{total.toLocaleString()}₫</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-bold">Tổng tiền</span>
                  <span className="fw-bold text-danger fs-5">
                    {total.toLocaleString()}₫
                  </span>
                </div>
                {/* Disable nút thanh toán nếu không chọn sản phẩm nào */}
                <button
                  className={`btn w-100 mt-2 fw-bold${
                    selected.length === 0 ? " disabled" : ""
                  }`}
                  style={{
                    background: "#fb923c",
                    color: "#fff",
                    border: "none",
                    fontWeight: 600,
                  }}
                  // tabIndex={selected.length === 0 ? -1 : 0}
                  // aria-disabled={selected.length === 0}
                  // disabled={selected.length === 0}
                  onClick={() => {
                    router.push("/checkout");
                  }}
                >
                  THANH TOÁN
                </button>
              </div>
            </div>
            <div
              className="card border-0"
              style={{ backgroundColor: "#e6f6f2" }}
            >
              <div className="card-body">
                <h6 className="card-title fw-bold">Chính sách mua hàng</h6>
                <p className="card-text small">
                  Mua trên 100.000đ để có thể áp dụng mã giảm giá từ shop
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
