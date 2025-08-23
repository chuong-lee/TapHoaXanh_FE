import React from 'react';
import Image from 'next/image';

const Footer = () => {
  return (
    <>
      <footer style={{
        background: "#fff",
        borderTop: "1px solid #eee",
        padding: "32px 0 16px 0",
        marginTop: 40
      }}>
        <div className="container">
          <div className="row" style={{marginBottom: 24}}>
            <div className="col-md-4 mb-3">
              <h6 className="fw-bold mb-2">GIỚI THIỆU CÔNG TY</h6>
              <div style={{fontSize: 15, color: "#444"}}>
                Đà Lạt GAP là công ty đầu tiên tại Việt Nam xây dựng và duy trì hệ thống quản lý chất lượng tiêu chuẩn Toàn Cầu GlobalG.A.P (Global Good Agriculture Practice) từ năm 2008 đến nay - chứng nhận bởi tập đoàn Control Union - Hà Lan.<br/>
                <span style={{display: "block", margin: "8px 0"}}>📍 Chi nhánh CTY TNHH Thực Phẩm Sạch Dalat G.A.P.<br/>403 Hai Bà Trưng, Phường Võ Thị Sáu, Quận 3, Tp. HCM</span>
                <span>MST: 0312080949</span><br/>
                <span>📞 028 38 20 27 20</span><br/>
                <span>✉️ cs@dalatgapstore.com</span>
              </div>
            </div>
            <div className="col-md-2 mb-3">
              <h6 className="fw-bold mb-2">THÔNG TIN</h6>
              <ul className="list-unstyled" style={{fontSize: 15, color: "#444"}}>
                <li>GIỚI THIỆU</li>
                <li>CHỨNG NHẬN</li>
                <li>CHÍNH SÁCH BẢO MẬT</li>
                <li>ĐIỀU KHOẢN & ĐIỀU KIỆN</li>
                <li>VIDEO</li>
              </ul>
            </div>
            <div className="col-md-3 mb-3">
              <h6 className="fw-bold mb-2">DỊCH VỤ</h6>
              <ul className="list-unstyled" style={{fontSize: 15, color: "#444"}}>
                <li>HƯỚNG DẪN MUA HÀNG</li>
                <li>VẬN CHUYỂN & GIAO HÀNG</li>
                <li>THẺ THÀNH VIÊN</li>
                <li>PHIẾU QUÀ TẶNG</li>
                <li>VIDEO</li>
              </ul>
            </div>
            <div className="col-md-3 mb-3">
              <h6 className="fw-bold mb-2">LIÊN HỆ</h6>
              <ul className="list-unstyled" style={{fontSize: 15, color: "#444"}}>
                <li>LIÊN HỆ</li>
              </ul>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center" style={{fontSize: 14, color: "#888"}}>
            <span>© Bản quyền thuộc về DalatGap Store</span>
            <Image src="/images/bocongthuong.png" alt="Bộ Công Thương" width={120} height={40} style={{height: 40}} />
          </div>
        </div>
      </footer>
      <a className="back-to-top" href="javascript:void(0)">
        <i className="fas fa-arrow-to-top"> </i>
      </a>
    </>
  );
};

export default Footer;
