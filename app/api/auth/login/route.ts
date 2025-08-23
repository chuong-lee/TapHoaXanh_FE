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

// Mock users for demo (nếu database không có users table)
const MOCK_USERS = [
  {
    id: 1,
    name: 'Demo User',
    email: 'demo@gmail.com',
    password: '$2b$10$Eka0XPZ9TcGLqE3C6xYzPu.jZsqDxL3crW8YLpSR3bJlPIOqSg4pC', // password
    phone: '+84123456789',
    image: '/client/images/profile.jpg',
    role: 'user'
  },
  {
    id: 2,
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: '$2b$10$Eka0XPZ9TcGLqE3C6xYzPu.jZsqDxL3crW8YLpSR3bJlPIOqSg4pC', // password
    phone: '+84987654321',
    image: '/client/images/profile.jpg',
    role: 'admin'
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email và mật khẩu là bắt buộc' },
        { status: 400 }
      );
    }

    let user = null;

    // Try to find user in database first
    try {
      const dbUsers = await executeQuery<UserRow[]>(
        'SELECT * FROM users WHERE email = ? AND deletedAt IS NULL LIMIT 1',
        [email]
      );
      
      if (dbUsers && dbUsers.length > 0) {
        user = dbUsers[0];
      }
    } catch (dbError) {
      console.log('Database query failed, using mock data:', dbError);
    }

    // Fallback to mock users if database doesn't work
    if (!user) {
      const mockUser = MOCK_USERS.find(u => u.email === email);
      if (mockUser) {
        user = mockUser;
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    // Check password - handle both hashed and plain text passwords
    let isPasswordValid = false;
    
    // First try bcrypt compare (for hashed passwords)
    try {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } catch (bcryptError) {
      console.log('Bcrypt compare failed, trying plain text comparison');
    }
    
    // If bcrypt fails, try plain text comparison (for demo data)
    if (!isPasswordValid) {
      isPasswordValid = password === user.password;
    }
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role || 'user'
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '7d' }
    );

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công',
      token: token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error in login API:', error);
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}