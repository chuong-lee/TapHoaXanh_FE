import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface UserRow {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  image?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Tên, email và mật khẩu là bắt buộc' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email không hợp lệ' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      );
    }

    // Check if user already exists
    try {
      const existingUsers = await executeQuery<UserRow[]>(
        'SELECT id FROM users WHERE email = ? AND deletedAt IS NULL LIMIT 1',
        [email]
      );
      
      if (existingUsers && existingUsers.length > 0) {
        return NextResponse.json(
          { error: 'Email đã được sử dụng' },
          { status: 409 }
        );
      }
    } catch (dbError) {
      console.log('Database query failed:', dbError);
      // Continue with registration even if check fails
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const insertQuery = `
      INSERT INTO users (name, email, password, phone, role, createdAt, updatedAt) 
      VALUES (?, ?, ?, ?, 'USER', NOW(), NOW())
    `;

    const result = await executeQuery<{ insertId: number }>(
      insertQuery,
      [name, email, hashedPassword, phone || null]
    );

    if (!result || !result.insertId) {
      return NextResponse.json(
        { error: 'Không thể tạo tài khoản' },
        { status: 500 }
      );
    }

    // Get the newly created user
    const newUser = await executeQuery<UserRow[]>(
      'SELECT id, name, email, phone, image, role, createdAt, updatedAt FROM users WHERE id = ?',
      [result.insertId]
    );

    if (!newUser || newUser.length === 0) {
      return NextResponse.json(
        { error: 'Không thể lấy thông tin người dùng' },
        { status: 500 }
      );
    }

    const user = newUser[0];

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role || 'USER'
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '7d' }
    );

    console.log('✅ User registered successfully:', {
      id: user.id,
      name: user.name,
      email: user.email
    });

    return NextResponse.json({
      success: true,
      message: 'Đăng ký thành công',
      token: token,
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
    console.error('Error in register API:', error);
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}
