'use client'

import { useProducts } from '@/hooks/useProducts'

export default function TestPage() {
  // Phân trang thủ công cho test-api
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalProducts = featuredProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const pagedProducts = featuredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const {
    currentProducts,
    categories,
    featuredProducts,
    loading,
    categoriesLoading,
    error
  } = useProducts({ itemsPerPage: 4 })

  console.log('Test Page Data:', {
    currentProducts,
    categories,
    featuredProducts,
    loading,
    error
  })

  return (
    <div className="container mt-5">
      <h1>🧪 Test API Integration</h1>
      
      {error && (
        <div className="alert alert-danger mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Products Section */}
      <div className="row mb-5">
        <div className="col-12">
          <h3>Products {loading ? '(Loading...)' : `(${currentProducts.length} items)`}</h3>
          {loading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status"></div>
            </div>
          ) : (
            <div className="row">
              {currentProducts.map(product => (
                <div key={product.id} className="col-md-3 mb-3">
                  <div className="card h-100">
                    <img 
                      src={product.images} 
                      className="card-img-top" 
                      alt={product.name}
                      style={{ height: 150, objectFit: 'cover' }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h6 className="card-title">{product.name}</h6>
                      <p className="text-success fw-bold">{product.price.toLocaleString()}đ</p>
                      <small className="text-muted">⭐ {product.rating || 4.5}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Categories Section */}
      <div className="row mb-5">
        <div className="col-12">
          <h3>Categories {categoriesLoading ? '(Loading...)' : `(${categories.length} items)`}</h3>
          {categoriesLoading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status"></div>
            </div>
          ) : (
            <div className="row">
              {categories.map(category => (
                <div key={category.id} className="col-md-2 mb-3">
                  <div className="card text-center" style={{ backgroundColor: category.color || '#f8f9fa' }}>
                    <div className="card-body">
                      <h6 className="card-title">{category.name}</h6>
                      <small className="text-muted">{category.count || 0} items</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Featured Products */}
      <div className="row">
        <div className="col-12">
          <h3>Featured Products ({featuredProducts.length} items)</h3>
          <div className="row">
            {pagedProducts.map(product => (
              <div key={product.id} className="col-md-3 mb-3">
                <div className="card h-100 border-success">
                  <img 
                    src={product.images} 
                    className="card-img-top" 
                    alt={product.name}
                    style={{ height: 150, objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h6 className="card-title">{product.name}</h6>
                    <p className="text-success fw-bold">{product.price.toLocaleString()}đ</p>
                    <span className="badge bg-success">Featured</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination controls */}
          <nav className="d-flex justify-content-center mt-3">
            <ul className="pagination">
              <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</button>
              </li>
              {[...Array(totalPages)].map((_, idx) => (
                <li key={idx} className={`page-item${currentPage === idx + 1 ? ' active' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(idx + 1)}>{idx + 1}</button>
                </li>
              ))}
              <li className={`page-item${currentPage === totalPages ? ' disabled' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Debug Info */}
      <div className="mt-5">
        <details>
          <summary>🔍 Debug Information</summary>
          <pre className="bg-light p-3 mt-2">
            {JSON.stringify({
              environment: process.env.NODE_ENV,
              apiUrl: process.env.NEXT_PUBLIC_API_URL,
              productsCount: currentProducts.length,
              categoriesCount: categories.length,
              featuredCount: featuredProducts.length,
              hasError: !!error,
              isLoading: loading
            }, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  )
}
