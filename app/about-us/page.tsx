"use client";
import React from "react";
import Link from 'next/link';

export default function AboutUsPage() {
  return (
    <section>
      <div className="abouts">
        {/* Breadcrumb Section */}
        <div className="breadcrumb-section">
          <div className="container">
            <h3 className="text-center">Về Chúng Tôi</h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link href="/">Trang Chủ</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">Về Chúng Tôi</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="container my-3">
          {/* Hero section*/}
          <div className="row align-items-start mb-4">
            <div className="col-lg-5 mb-4 mb-lg-0">
              <div className="abouts-img">
                <img
                  className="rounded shadow hero-image"
                  src="/client/images/build.png"
                  alt="Building"
                />
              </div>
            </div>
            <div className="col-lg-7">
              <h1 className="fw-bold mb-3">Chào mừng đến với Tạp Hoá Xanh </h1>
              <p className="text-secondary mb-5 hero-text">
                Tạp Hoá Xanh là cửa hàng tạp hóa trực tuyến hàng đầu, mang đến
                cho khách hàng những sản phẩm tươi ngon, chất lượng cao với giá
                cả phải chăng. Chúng tôi cam kết cung cấp dịch vụ giao hàng
                nhanh chóng, an toàn và tiện lợi nhất cho mọi gia đình Việt Nam.
              </p>
              <p className="text-secondary hero-text">
                Với hơn 10 năm kinh nghiệm trong lĩnh vực bán lẻ, chúng tôi hiểu
                rõ nhu cầu của khách hàng và không ngừng cải tiến để mang lại
                trải nghiệm mua sắm tuyệt vời nhất. Từ thực phẩm tươi sống đến
                đồ gia dụng, tất cả đều có tại Tạp Hoá Xanh.
              </p>
              <div className="row g-3 mb-5">
                <div className="col-3 hvr-float">
                  <img
                    className="img-fluid rounded shadow-sm w-100 gallery-thumbnail"
                    src="/client/images/gallery-1.png"
                  />
                </div>
                <div className="col-3 hvr-float">
                  <img
                    className="img-fluid rounded shadow-sm w-100 gallery-thumbnail"
                    src="/client/images/gallery-2.png"
                  />
                </div>
                <div className="col-3 hvr-float">
                  <img
                    className="img-fluid rounded shadow-sm w-100 gallery-thumbnail"
                    src="/client/images/gallery-3.png"
                  />
                </div>
                <div className="col-3 hvr-float">
                  <img
                    className="img-fluid rounded shadow-sm w-100 gallery-thumbnail"
                    src="/client/images/gallery-4.png"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* What we provide*/}
          <h2 className="text-center fw-bold my-5">Chúng tôi cung cấp gì?</h2>
          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <div className="p-4 rounded text-center shadow-sm provide-box">
                <div className="provide-box-img">
                  <img
                    className="mb-3 provide-box-img-icon"
                    src="/client/images/icon-1.png"
                    alt="Best Prices"
                  />
                </div>
                <h5 className="text-about mb-2">
                  Giá cả tốt nhất &amp; Ưu đãi hấp dẫn
                </h5>
                <p className="text-secondary mb-0 fs-5">
                  Chúng tôi cam kết mang đến những mức giá cạnh tranh nhất thị
                  trường cùng với các chương trình khuyến mãi, ưu đãi đặc biệt
                  dành cho khách hàng thân thiết.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 rounded text-center shadow-sm provide-box">
                <div className="provide-box-img">
                  <img
                    className="mb-3 provide-box-img-icon"
                    src="/client/images/icon-2.png"
                  />
                </div>
                <h5 className="text-about mb-2">Đa dạng sản phẩm</h5>
                <p className="text-secondary mb-0 fs-5">
                  Hàng nghìn sản phẩm từ thực phẩm tươi sống, đồ khô, đồ gia
                  dụng đến mỹ phẩm, đáp ứng mọi nhu cầu thiết yếu của gia đình
                  bạn trong một cửa hàng duy nhất.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 rounded text-center shadow-sm provide-box">
                <div className="provide-box-img">
                  <img
                    className="mb-3 provide-box-img-icon"
                    src="/client/images/icon-3.png"
                  />
                </div>
                <h5 className="text-about mb-2">Giao hàng miễn phí</h5>
                <p className="text-secondary mb-0 fs-5">
                  Miễn phí giao hàng cho đơn hàng từ 200.000đ trong nội thành và
                  từ 500.000đ cho các khu vực khác. Giao hàng nhanh chóng trong
                  vòng 2-4 giờ.
                </p>
              </div>
            </div>
          </div>
          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <div className="p-4 rounded text-center shadow-sm provide-box">
                <div className="provide-box-img">
                  <img
                    className="mb-3 provide-box-img-icon"
                    src="/client/images/icon-4.png"
                  />
                </div>
                <h5 className="text-about mb-2">Đổi trả dễ dàng</h5>
                <p className="text-secondary mb-0 fs-5">
                  Chính sách đổi trả linh hoạt trong vòng 7 ngày đối với hàng
                  hóa không đúng chất lượng hoặc không phù hợp. Quy trình đơn
                  giản, nhanh chóng.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 rounded text-center shadow-sm provide-box">
                <div className="provide-box-img">
                  <img
                    className="mb-3 provide-box-img-icon"
                    src="/client/images/icon-5.png"
                  />
                </div>
                <h5 className="text-about mb-2">100% hài lòng</h5>
                <p className="text-secondary mb-0 fs-5">
                  Chúng tôi cam kết mang đến sự hài lòng tuyệt đối cho khách
                  hàng. Đội ngũ chăm sóc khách hàng 24/7 sẵn sàng hỗ trợ và giải
                  đáp mọi thắc mắc của bạn.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 rounded text-center shadow-sm provide-box">
                <div className="provide-box-img">
                  <img
                    className="mb-3 provide-box-img-icon"
                    src="/client/images/icon-6.png"
                  />
                </div>
                <h5 className="text-about mb-2">Khuyến mãi hằng ngày</h5>
                <p className="text-secondary mb-0 fs-5">
                  Mỗi ngày đều có những deal hot, giảm giá sốc cho các sản phẩm
                  thiết yếu. Theo dõi ứng dụng để không bỏ lỡ cơ hội tiết kiệm
                  tối đa cho gia đình bạn.
                </p>
              </div>
            </div>
          </div>
          {/* Performance section*/}
          <div className="row align-items-center g-4 mb-5">
            <div className="col-md-5 performance-images">
              <div className="row g-3">
                <div className="col-6">
                  <img
                    className="img-fluid rounded shadow-sm"
                    src="performance1.jpg"
                    alt="Performance 1"
                  />
                </div>
                <div className="col-6">
                  <img
                    className="img-fluid rounded shadow-sm"
                    src="performance2.jpg"
                    alt="Performance 2"
                  />
                </div>
              </div>
            </div>
            <div className="col-md-7 performance-text">
              <span className="text-secondary mb-2 d-block">
                Hiệu suất của chúng tôi
              </span>
              <h2 className="fw-bold mb-3">
                Đối tác tin cậy cho <br />
                giải pháp tạp hóa <br />
                trực tuyến của bạn
              </h2>
              <p className="text-secondary mb-2">
                Với công nghệ hiện đại và hệ thống logistics chuyên nghiệp,
                chúng tôi đảm bảo mang đến trải nghiệm mua sắm tuyệt vời nhất...
              </p>
              <p className="text-secondary">
                Sự tin tưởng của khách hàng là động lực để chúng tôi không ngừng
                phát triển và hoàn thiện dịch vụ...
              </p>
            </div>
          </div>
          {/* Footer info*/}
          <div className="row text-center text-md-start g-4 footer-info">
            <div className="col-md-4">
              <h4 className="fw-bold mb-2">Chúng tôi là ai</h4>
              <p className="text-secondary mb-0">
                Tạp Hoá Xanh được thành lập với sứ mệnh mang lại sự tiện lợi và
                chất lượng cho mọi gia đình Việt Nam...
              </p>
            </div>
            <div className="col-md-4">
              <h4 className="fw-bold mb-2">Lịch sử phát triển</h4>
              <p className="text-secondary mb-0">
                Từ một cửa hàng nhỏ, chúng tôi đã phát triển thành hệ thống tạp
                hóa trực tuyến hàng đầu với hàng triệu khách hàng tin tưởng...
              </p>
            </div>
            <div className="col-md-4">
              <h4 className="fw-bold mb-2">Sứ mệnh của chúng tôi</h4>
              <p className="text-secondary mb-0">
                Mang đến những sản phẩm chất lượng, an toàn và tiện lợi nhất để
                mọi gia đình có cuộc sống tốt đẹp hơn...
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
