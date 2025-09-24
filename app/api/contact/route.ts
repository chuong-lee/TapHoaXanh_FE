import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phone, subject, message } =
      await request.json();

    // Validation
    if (!firstName || !lastName || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Email không hợp lệ" },
        { status: 400 }
      );
    }

    // Phone validation
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: "Số điện thoại không hợp lệ" },
        { status: 400 }
      );
    }

    // Kiểm tra biến môi trường
    if (
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS ||
      !process.env.CONTACT_EMAIL
    ) {
      console.error("Thiếu cấu hình email trong biến môi trường");
      return NextResponse.json(
        {
          error:
            "Cấu hình email chưa được thiết lập. Vui lòng kiểm tra EMAIL_USER, EMAIL_PASS và CONTACT_EMAIL",
        },
        { status: 500 }
      );
    }

    // Tạo transporter (sử dụng Gmail SMTP)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify transporter configuration
    try {
      await transporter.verify();
    } catch (error) {
      console.error("Lỗi cấu hình email transporter:", error);
      return NextResponse.json(
        {
          error:
            "Cấu hình email không đúng. Vui lòng kiểm tra EMAIL_USER và EMAIL_PASS.",
        },
        { status: 500 }
      );
    }

    // Nội dung email
    const mailOptions = {
      from: process.env.EMAIL_USER, // Gửi từ email của bạn
      to: process.env.CONTACT_EMAIL, // Email nhận của bạn
      subject: `[Tạp Hóa Xanh] Liên hệ từ khách hàng: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22c55e; border-bottom: 2px solid #22c55e; padding-bottom: 10px;">
            📧 Tin nhắn liên hệ từ khách hàng
          </h2>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Thông tin khách hàng:</h3>
            <p><strong>Họ tên:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Số điện thoại:</strong> ${phone}</p>
            <p><strong>Tiêu đề:</strong> ${subject}</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">Nội dung tin nhắn:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">
            <p style="margin: 0; color: #166534; font-size: 14px;">
              <strong>⏰ Thời gian:</strong> ${new Date().toLocaleString(
                "vi-VN"
              )}
            </p>
          </div>
        </div>
      `,
    };

    // Gửi email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message:
        "Tin nhắn đã được gửi thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.",
    });
  } catch (error) {
    console.error("Lỗi gửi email:", error);

    // Kiểm tra loại lỗi cụ thể
    if (error instanceof Error) {
      if (error.message.includes("Invalid login")) {
        return NextResponse.json(
          {
            error:
              "Cấu hình email không đúng. Vui lòng kiểm tra EMAIL_USER và EMAIL_PASS.",
          },
          { status: 500 }
        );
      }
      if (error.message.includes("ENOTFOUND")) {
        return NextResponse.json(
          {
            error:
              "Không thể kết nối đến server email. Vui lòng kiểm tra kết nối mạng.",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
