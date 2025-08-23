'use client'


export default function ContactUs() {
  return (
    <main className="main-content">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-5">
              <h2 className="fw-bold" style={{color: '#22c55e', fontSize: '2.5rem'}}>Liên Hệ Với Chúng Tôi</h2>
              <p className="text-muted" style={{fontSize: 18}}>Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
            </div>
            <form className="bg-white p-5 rounded-4 shadow" style={{border: '1.5px solid #e0fbe2'}}>
              <div className="row mb-4">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label className="form-label fw-bold">Họ*</label>
                  <input type="text" className="form-control" placeholder="Ví dụ: Nguyễn" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Tên*</label>
                  <input type="text" className="form-control" placeholder="Ví dụ: Văn A" />
                </div>
              </div>
              <div className="row mb-4">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label className="form-label fw-bold">Email*</label>
                  <input type="email" className="form-control" placeholder="example@gmail.com" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Số điện thoại*</label>
                  <input type="text" className="form-control" placeholder="Nhập số điện thoại" />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label fw-bold">Tiêu đề*</label>
                <input type="text" className="form-control" placeholder="Nhập tiêu đề..." />
              </div>
              <div className="mb-4">
                <label className="form-label fw-bold">Nội dung tin nhắn*</label>
                <textarea className="form-control" rows={5} placeholder="Nhập nội dung tin nhắn..." />
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-warning text-dark fw-bold px-5 py-3 rounded-3" style={{minWidth:200, fontSize: '1.1rem'}}>
                  Gửi Tin Nhắn
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="row text-center mt-5">
          <div className="col-md-4 mb-4 mb-md-0">
            <div className="p-4 rounded-4" style={{background: '#f0fdf4', border: '1px solid #e0fbe2'}}>
              <img src="/images/address-icon.jpg" alt="Địa chỉ" width={50} className="mb-3" />
              <div className="fw-bold mb-2" style={{color: '#22c55e'}}>Địa Chỉ</div>
              <div className="text-muted">123 Đường ABC, Quận 1, TP.HCM</div>
            </div>
          </div>
          <div className="col-md-4 mb-4 mb-md-0">
            <div className="p-4 rounded-4" style={{background: '#f0fdf4', border: '1px solid #e0fbe2'}}>
              <img src="/images/phone-icon.jpg" alt="Điện thoại" width={50} className="mb-3" />
              <div className="fw-bold mb-2" style={{color: '#22c55e'}}>Điện Thoại</div>
              <div className="text-muted">+84 123-456-789</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 rounded-4" style={{background: '#f0fdf4', border: '1px solid #e0fbe2'}}>
              <img src="/images/email-icon.jpg" alt="Email" width={50} className="mb-3" />
              <div className="fw-bold mb-2" style={{color: '#22c55e'}}>Email</div>
              <div className="text-muted">contact@taphoxanh.com</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}