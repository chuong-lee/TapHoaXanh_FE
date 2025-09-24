"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(result.error || "Có lỗi xảy ra khi gửi tin nhắn", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch {
      toast.error("Có lỗi xảy ra khi gửi form. Vui lòng thử lại sau.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <main className="main-content">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-5">
              <h2
                className="fw-bold"
                style={{ color: "#22c55e", fontSize: "2.5rem" }}
              >
                Liên Hệ Với Chúng Tôi
              </h2>
              <p className="text-muted" style={{ fontSize: 18 }}>
                Chúng tôi luôn sẵn sàng hỗ trợ bạn
              </p>
            </div>
            <form
              className="bg-white p-5 rounded-4 shadow"
              style={{ border: "1.5px solid #e0fbe2" }}
              onSubmit={handleSubmit}
            >
              <div className="row mb-4">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label className="form-label fw-bold">Họ*</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Ví dụ: Nguyễn"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Tên*</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Ví dụ: Văn A"
                    required
                  />
                </div>
              </div>
              <div className="row mb-4">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label className="form-label fw-bold">Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="example@gmail.com"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Số điện thoại*</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label fw-bold">Tiêu đề*</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Nhập tiêu đề..."
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label fw-bold">Nội dung tin nhắn*</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="form-control"
                  rows={5}
                  placeholder="Nhập nội dung tin nhắn..."
                  required
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-warning text-dark fw-bold px-5 py-3 rounded-3"
                  style={{ minWidth: 200, fontSize: "1.1rem" }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Đang gửi...
                    </>
                  ) : (
                    "Gửi Tin Nhắn"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="row text-center mt-5">
          <div className="col-md-4 mb-4 mb-md-0">
            <div
              className="p-4 rounded-4"
              style={{ background: "#f0fdf4", border: "1px solid #e0fbe2" }}
            >
              <Image
                src="/images/address-icon.jpg"
                alt="Địa chỉ"
                height={50}
                width={50}
                className="mb-3"
              />
              <div className="fw-bold mb-2" style={{ color: "#22c55e" }}>
                Địa Chỉ
              </div>
              <div className="text-muted">123 Đường ABC, Quận 1, TP.HCM</div>
            </div>
          </div>
          <div className="col-md-4 mb-4 mb-md-0">
            <div
              className="p-4 rounded-4"
              style={{ background: "#f0fdf4", border: "1px solid #e0fbe2" }}
            >
              <Image
                src="/images/phone-icon.jpg"
                alt="Điện thoại"
                height={50}
                width={50}
                className="mb-3"
              />
              <div className="fw-bold mb-2" style={{ color: "#22c55e" }}>
                Điện Thoại
              </div>
              <div className="text-muted">+84 123-456-789</div>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="p-4 rounded-4"
              style={{ background: "#f0fdf4", border: "1px solid #e0fbe2" }}
            >
              <Image
                src="/images/email-icon.jpg"
                alt="Email"
                height={50}
                width={50}
                className="mb-3"
              />
              <div className="fw-bold mb-2" style={{ color: "#22c55e" }}>
                Email
              </div>
              <div className="text-muted">contact@taphoaxanh.com</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
