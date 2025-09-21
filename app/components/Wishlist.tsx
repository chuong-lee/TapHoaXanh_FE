"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaHeart,
  FaShoppingBag,
  FaInfoCircle,
  FaFileAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../lib/axios";
import { Product } from "../types";
import WishlistItem from "./WishlistItem";
import Pagination from "./Pagination";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [wishlistItems, setWishlistItems] = useState<
    { id: number; product: Product }[]
  >([]); // Lưu wishlist items gốc
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 8; // Cố định 10 sản phẩm/trang

  const loadWishlist = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await api.get("/wishlist", {
        params: {
          page,
          limit,
        },
      });

      // Xử lý response data - Backend trả về cấu trúc với meta object
      const data = response.data;
      const wishlistItems = data.data || [];

      // Extract products từ wishlist items (mỗi item có thuộc tính product)
      const products = wishlistItems
        .map((item: { id: number; product: Product }) => item.product)
        .filter(Boolean);

      // Lấy thông tin pagination từ meta object
      const meta = data.meta || {};
      const totalItems = meta.total || products.length;
      const totalPagesCount = meta.lastPage || Math.ceil(totalItems / limit);
      const currentPageNum = parseInt(meta.page) || 1;

      setWishlist(products);
      setWishlistItems(wishlistItems); // Lưu wishlist items gốc
      setTotalPages(totalPagesCount);
      setTotal(totalItems);
      setCurrentPage(currentPageNum);
    } catch (error) {
      console.error("Error loading wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist(1);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadWishlist(page);
  };

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      // Tìm wishlist item ID từ product ID
      const wishlistItem = wishlistItems.find(
        (item) => item.product?.id === productId
      );
      if (!wishlistItem) {
        console.error("Wishlist item not found for product ID:", productId);
        return;
      }

      // Sử dụng wishlist item ID để xóa với API endpoint đúng
      await api.delete(`/wishlist/${wishlistItem.id}`);

      // Hiển thị toast notification
      toast.success(
        `Đã xóa "${wishlistItem.product.name}" khỏi sản phẩm yêu thích!`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      // Reload wishlist after removal
      loadWishlist(currentPage);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Có lỗi xảy ra khi xóa khỏi sản phẩm yêu thích!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Đang tải danh sách sản phẩm yêu thích...</p>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="mb-4">
          <FaHeart
            className="text-muted"
            style={{ fontSize: "3rem", opacity: 0.3 }}
          />
        </div>
        <h4 className="text-muted">Danh sách yêu thích trống</h4>
        <p className="text-muted">
          Bạn chưa có sản phẩm nào trong danh sách yêu thích.
        </p>
        <Link href="/product" className="btn btn-primary">
          <FaShoppingBag className="me-2" />
          Mua sắm ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <FaHeart className="text-danger me-2" />
          Sản phẩm yêu thích ({total})
        </h4>
      </div>

      <div className="row">
        {wishlistItems.map((wishlistItem) => (
          <div
            key={wishlistItem.id}
            className="col-lg-3 col-md-4 col-sm-6 mb-4"
          >
            <WishlistItem
              product={wishlistItem.product}
              onRemove={handleRemoveFromWishlist}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {total > 7 ? (
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="text-muted small">
              <FaInfoCircle className="me-1" />
              Hiển thị {(currentPage - 1) * limit + 1} -{" "}
              {Math.min(currentPage * limit, total)} trong tổng số {total} sản
              phẩm
            </div>
            <div className="text-muted small">
              <FaFileAlt className="me-1" />
              Trang {currentPage} / {totalPages}
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <Pagination
              currentPage={currentPage}
              totalItems={total}
              itemsPerPage={limit}
              onPageChange={handlePageChange}
            />
          </div>
          <div className="text-center mt-2">
            <small className="text-muted">
              Sử dụng nút &ldquo;Trước&rdquo; và &ldquo;Tiếp&rdquo; để chuyển
              trang, hoặc click trực tiếp vào số trang
            </small>
          </div>
        </div>
      ) : (
        <div className="mt-4 text-center">
          <div className="alert alert-info">
            <FaInfoCircle className="me-2" />
            {total === 0 || !total
              ? "Không có sản phẩm nào"
              : total <= 7
              ? `Chỉ có ${total} sản phẩm - không cần phân trang`
              : "Đang tải thông tin phân trang..."}
          </div>
        </div>
      )}
    </div>
  );
}
