import { , NextResponse } from 'next/server';
import {  } from '@/lib/db';
import jwt from 'jsonwebtoken';

interface UserRow {
  id: number;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

// GET /api/auth/profile - Get user profile
export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = .headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { : 'Token không hợp lệ' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Verify JWT token
    let decoded: unknown;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    } catch (jwtError) {
      return NextResponse.json(
        { : 'Token không hợp lệ hoặc đã hết hạn' },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    // Get user from database
    const users = await executeQuery<UserRow[]>(
      'SELECT id, name, email, phone, image, role, createdAt, updatedAt FROM users WHERE id = ? AND deletedAt IS NULL',
      [userId]
    );

    if (!users || users.length === 0) {
      return NextResponse.json(
        { : 'Không tìm thấy người dùng' },
        { status: 404 }
      );
    }

    const user = users[0];

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Error in profile API:', error);
    return NextResponse.json(
      { : 'Lỗi server, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}

// PUT /api/auth/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = .headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { : 'Token không hợp lệ' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Verify JWT token
    let decoded: unknown;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    } catch (jwtError) {
      return NextResponse.json(
        { : 'Token không hợp lệ hoặc đã hết hạn' },
        { status: 401 }
      );
    }

    const userId = decoded.userId;
    const body = await request.json();
    const { name, phone, image } = body;

    // Update user profile
    const updateQuery = `
      UPDATE users 
      SET name = ?, phone = ?, image = ?, updatedAt = NOW()
      WHERE id = ? AND deletedAt IS NULL
    `;

    await executeQuery(
      updateQuery,
      [name, phone, image, userId]
    );

    // Get updated user
    const users = await executeQuery<UserRow[]>(
      'SELECT id, name, email, phone, image, role, createdAt, updatedAt FROM users WHERE id = ? AND deletedAt IS NULL',
      [userId]
    );

    if (!users || users.length === 0) {
      return NextResponse.json(
        { : 'Không tìm thấy người dùng' },
        { status: 404 }
      );
    }

    const user = users[0];

    return NextResponse.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Error in profile update API:', error);
    return NextResponse.json(
      { : 'Lỗi server, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}