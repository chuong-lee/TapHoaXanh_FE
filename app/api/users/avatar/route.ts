import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { handleError } from '@/helpers/handleError';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('avatar') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Không có file nào được gửi' },
        { status: 400 }
      );
    }

    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Chỉ chấp nhận file ảnh' },
        { status: 400 }
      );
    }

    // Kiểm tra kích thước file (giới hạn 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File quá lớn. Kích thước tối đa là 5MB' },
        { status: 400 }
      );
    }

    // Tạo tên file duy nhất
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `avatar_${timestamp}.${fileExtension}`;

    // Đường dẫn lưu file
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'avatars');
    
    // Tạo thư mục nếu chưa tồn tại
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    const filePath = join(uploadDir, fileName);
    
    // Chuyển đổi file thành buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Lưu file
    await writeFile(filePath, buffer);

    // Trả về đường dẫn file
    const imageUrl = `/uploads/avatars/${fileName}`;
    
    return NextResponse.json({
      success: true,
      imageUrl,
      message: 'Avatar đã được upload thành công!'
    });

  } catch (error: unknown) {
    handleError(error);
    return NextResponse.json(
      { error: 'Lỗi server khi upload avatar' },
      { status: 500 }
    );
  }
}
