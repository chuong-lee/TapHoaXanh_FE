'use client'

export default function Offline() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card border-warning">
              <div className="card-header bg-warning text-dark">
                <h5 className="card-title mb-0">
                  <i className="fas fa-wifi-slash me-2"></i>
                  Không có kết nối Internet
                </h5>
              </div>
              <div className="card-body text-center">
                <div className="mb-4">
                  <i className="fas fa-cloud-offline text-warning offline-bounce" style={{ fontSize: '4rem' }}></i>
                </div>
                
                <h4 className="mb-3">Bạn đang offline</h4>
                <p className="text-muted mb-4">
                  Không thể kết nối đến Internet. Vui lòng kiểm tra kết nối mạng và thử lại.
                </p>

                <div className="d-grid gap-2 d-md-flex justify-content-md-center mb-4">
                  <button 
                    className="btn btn-warning me-md-2"
                    onClick={() => window.location.reload()}
                  >
                    <i className="fas fa-redo me-2"></i>
                    Thử lại
                  </button>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => window.history.back()}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Quay lại
                  </button>
                </div>

                <div className="alert alert-info">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-info-circle me-2"></i>
                    <small>
                      <strong>Mẹo:</strong> Một số nội dung có thể vẫn khả dụng khi offline.
                    </small>
                  </div>
                </div>

                <div className="mt-4">
                  <h6 className="text-muted mb-3">Khi có kết nối trở lại, bạn có thể:</h6>
                  <div className="row text-center">
                    <div className="col-4">
                      <div className="mb-2">
                        <i className="fas fa-shopping-bag text-success" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <small className="text-muted">Mua sắm</small>
                    </div>
                    <div className="col-4">
                      <div className="mb-2">
                        <i className="fas fa-search text-primary" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <small className="text-muted">Tìm kiếm</small>
                    </div>
                    <div className="col-4">
                      <div className="mb-2">
                        <i className="fas fa-user text-info" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <small className="text-muted">Tài khoản</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
