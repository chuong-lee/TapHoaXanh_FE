'use client'

interface PaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  maxPagesToShow?: number // tuỳ chọn: số nút phân trang hiển thị (default 7)
  showFirstLast?: boolean // hiển thị nút đầu/cuối
  showInfo?: boolean // hiển thị thông tin trang
  loading?: boolean // trạng thái loading
  showViewAll?: boolean // hiển thị nút xem tất cả
  onViewAll?: () => void // callback khi click xem tất cả
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  maxPagesToShow = 7,
  showFirstLast = true,
  showInfo = true,
  loading = false,
  showViewAll = false,
  onViewAll,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  if (totalPages <= 1) return null

  // Tính toán trang hiển thị
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
  let endPage = startPage + maxPagesToShow - 1
  
  if (endPage > totalPages) {
    endPage = totalPages
    startPage = Math.max(1, endPage - maxPagesToShow + 1)
  }

  const pages = []
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  // Tính toán info
  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems)

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && !loading) {
      onPageChange(page)
    }
  }

  return (
    <div className="pagination-container">
      <nav>
        <ul className="pagination-wrapper">
          {/* Nút đầu tiên */}
          {showFirstLast && currentPage > 1 && (
            <li className="page-item">
              <button
                className="page-link nav-button first"
                onClick={() => handlePageClick(1)}
                disabled={loading}
              >
                ≪ Đầu
              </button>
            </li>
          )}

          {/* Nút trước */}
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className={`page-link nav-button ${loading ? 'pagination-loading' : ''}`}
              onClick={() => handlePageClick(currentPage - 1)}
              disabled={currentPage === 1 || loading}
            >
              ‹ Trước
            </button>
          </li>

          {/* Ellipsis đầu */}
          {startPage > 1 && (
            <>
              <li className="page-item">
                <button 
                  className="page-link" 
                  onClick={() => handlePageClick(1)}
                  disabled={loading}
                >
                  1
                </button>
              </li>
              {startPage > 2 && <span className="pagination-ellipsis">...</span>}
            </>
          )}

          {/* Các trang */}
          {pages.map((page) => (
            <li
              key={page}
              className={`page-item ${currentPage === page ? 'active' : ''} ${loading ? 'pagination-loading' : ''}`}
            >
              <button 
                className="page-link" 
                onClick={() => handlePageClick(page)}
                disabled={loading}
              >
                {page}
              </button>
            </li>
          ))}

          {/* Ellipsis cuối */}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
              <li className="page-item">
                <button 
                  className="page-link" 
                  onClick={() => handlePageClick(totalPages)}
                  disabled={loading}
                >
                  {totalPages}
                </button>
              </li>
            </>
          )}

          {/* Nút tiếp theo */}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className={`page-link nav-button ${loading ? 'pagination-loading' : ''}`}
              onClick={() => handlePageClick(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
            >
              Tiếp ›
            </button>
          </li>

          {/* Nút cuối cùng */}
          {showFirstLast && currentPage < totalPages && (
            <li className="page-item">
              <button
                className="page-link nav-button last"
                onClick={() => handlePageClick(totalPages)}
                disabled={loading}
              >
                Cuối ≫
              </button>
            </li>
          )}
        </ul>
      </nav>

      {/* Thông tin trang */}
      {showInfo && (
        <div className="pagination-info">
          Hiển thị <span className="highlight">{startIndex}-{endIndex}</span> trong tổng số{' '}
          <span className="highlight">{totalItems}</span> sản phẩm
          {totalPages > 1 && (
            <>
              <span className="separator">|</span>
              Trang <span className="highlight">{currentPage}</span> / <span className="highlight">{totalPages}</span>
            </>
          )}
          {showViewAll && onViewAll && totalPages > 1 && (
            <>
              <span className="separator">|</span>
              <button 
                onClick={onViewAll}
                className="view-all-btn"
              >
                Xem tất cả
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
