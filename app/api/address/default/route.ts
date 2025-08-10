import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import jwt from 'jsonwebtoken';

interface Address {
  id: number;
  street: string;
  city: string;
  district: string;
  is_default: boolean;
  usersId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// GET - Lấy địa chỉ mặc định của user
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token không hợp lệ' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
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

    const query = `
      SELECT * FROM address 
      WHERE usersId = ? AND is_default = 1 AND deletedAt IS NULL 
      LIMIT 1
    `;
    
    const addresses = await executeQuery<Address[]>(query, [userId]);

    if (addresses.length === 0) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'Không có địa chỉ mặc định'
      });
    }

    return NextResponse.json({
      success: true,
      data: addresses[0]
    });

  } catch (error) {
    console.error('Error in default address API:', error);
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
} 