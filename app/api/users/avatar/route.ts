import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { handleError } from "@/helpers/handleError";

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Không có file nào được gửi" },
        { status: 400 }
      );
    }

    // Kiểm tra loại file
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Chỉ chấp nhận file ảnh" },
        { status: 400 }
      );
    }

    // Kiểm tra kích thước file (giới hạn 5MB)
    if (file.size > 1 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File quá lớn. Kích thước tối đa là 1MB" },
        { status: 400 }
      );
    }

    // Chuyển đổi file thành buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload lên Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:${file.type};base64,${buffer.toString("base64")}`,
      {
        folder: "avatars",
        resource_type: "auto",
        transformation: [
          { width: 200, height: 200, crop: "fill", gravity: "face" },
          { quality: "auto", fetch_format: "auto" },
        ],
        public_id: `avatar_${Date.now()}`,
      }
    );

    return NextResponse.json({
      success: true,
      imageUrl: result.secure_url,
      message: "Avatar đã được upload thành công!",
    });
  } catch (error: unknown) {
    handleError(error);
    return NextResponse.json(
      { error: "Lỗi server khi upload avatar" },
      { status: 500 }
    );
  }
}
