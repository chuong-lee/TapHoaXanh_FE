import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
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

// Mock user for demo
const MOCK_USER = {
  id: 1,
  name: 'Demo User',
  email: 'demo@gmail.com',
  phone: '+84123456789',
  image: '/client/images/profile.jpg',
  role: 'user'
};

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token không hợp lệ' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key') as any;
    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Token không hợp lệ hoặc đã hết hạn' },
        { status: 401 }
      );
    }

    const userId = decoded.userId;
    let user = null;

    // Try to find user in database first
    try {
      const dbUsers = await executeQuery<UserRow[]>(
        'SELECT id, name, email, phone, image, role, createdAt, updatedAt FROM users WHERE id = ? AND deletedAt IS NULL LIMIT 1',
        [userId]
      );
      
      if (dbUsers && dbUsers.length > 0) {
        user = dbUsers[0];
      }
    } catch (dbError) {
      console.log('Database query failed, using mock data:', dbError);
    }

    // Fallback to mock user if database doesn't work
    if (!user) {
      user = MOCK_USER;
    }

    return NextResponse.json({
      success: true,
      user: user
    });

  } catch (error) {
    console.error('Error in profile API:', error);
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}

// PUT - Update profile
export async function PUT(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token không hợp lệ' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const body = await request.json();
    const { name, email, phone, image } = body;
    
    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key') as any;
    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Token không hợp lệ hoặc đã hết hạn' },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    // Try to update user in database
    try {
      await executeQuery(
        'UPDATE users SET name = ?, email = ?, phone = ?, image = ?, updatedAt = NOW() WHERE id = ?',
        [name, email, phone, image, userId]
      );

      // Get updated user
      const updatedUsers = await executeQuery<UserRow[]>(
        'SELECT id, name, email, phone, image, role, createdAt, updatedAt FROM users WHERE id = ? LIMIT 1',
        [userId]
      );

      if (updatedUsers && updatedUsers.length > 0) {
        return NextResponse.json({
          success: true,
          message: 'Cập nhật thông tin thành công',
          user: updatedUsers[0]
        });
      }
    } catch (dbError) {
      console.log('Database update failed:', dbError);
    }

    // Return mock response if database fails
    return NextResponse.json({
      success: true,
      message: 'Cập nhật thông tin thành công (demo mode)',
      user: { ...MOCK_USER, name, email, phone, image }
    });

  } catch (error) {
    console.error('Error in profile update API:', error);
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}