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

// GET - Lấy danh sách địa chỉ của user
export async function GET(request: NextRequest) {
  try {
    const authHeader = requestrequest.headers.get('authorization');
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
      WHERE usersId = ? AND deletedAt IS NULL 
      ORDER BY is_default DESC, createdAt DESC
    `;
    
    const addresses = await executeQuery<Address[]>(query, [userId]);

    return NextResponse.json({
      success: true,
      data: addresses
    });

  } catch (error) {
    console.error('Error in address API:', error);
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}

// POST - Tạo địa chỉ mới
export async function POST(request: NextRequest) {
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
    const body = await request.json();
    
    const { 
      street, 
      city, 
      district, 
      is_default = false 
    } = body;

    // Validate required fields
    if (!street || !city || !district) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin bắt buộc' },
        { status: 400 }
      );
    }

    // Nếu đặt làm mặc định, bỏ mặc định của các địa chỉ khác
    if (is_default) {
      await (
        'UPDATE address SET is_default = 0 WHERE usersId = ?',
        [userId]
      );
    }

    const insertQuery = `
      INSERT INTO address (
        street, city, district, is_default, usersId, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const result = await executeQuery<any>(insertQuery, [
      street, city, district, is_default ? 1 : 0, userId
    ]);

    return NextResponse.json({
      success: true,
      message: 'Địa chỉ đã được thêm thành công',
      addressId: result.insertId
    });

  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json(
      { error: 'Không thể tạo địa chỉ' },
      { status: 500 }
    );
  }
}

// PUT - Cập nhật địa chỉ
export async function PUT(request: NextRequest) {
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
    const body = await request.json();
    
    const { 
      id,
      street, 
      city, 
      district, 
      is_default = false 
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Thiếu ID địa chỉ' },
        { status: 400 }
      );
    }

    // Kiểm tra địa chỉ thuộc về user
    const checkQuery = 'SELECT id FROM address WHERE id = ? AND usersId = ? AND deletedAt IS NULL';
    const existingAddress = await executeQuery<any[]>(checkQuery, [id, userId]);
    
    if (!existingAddress || existingAddress.length === 0) {
      return NextResponse.json(
        { error: 'Địa chỉ không tồn tại' },
        { status: 404 }
      );
    }

    // Nếu đặt làm mặc định, bỏ mặc định của các địa chỉ khác
    if (is_default) {
      await (
        'UPDATE address SET is_default = 0 WHERE usersId = ? AND id != ?',
        [userId, id]
      );
    }

    const updateQuery = `
      UPDATE address SET 
        street = ?, city = ?, district = ?, is_default = ?, updatedAt = NOW()
      WHERE id = ? AND usersId = ?
    `;

    await executeQuery(updateQuery, [
      street, city, district, is_default ? 1 : 0, id, userId
    ]);

    return NextResponse.json({
      success: true,
      message: 'Địa chỉ đã được cập nhật thành công'
    });

  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json(
      { error: 'Không thể cập nhật địa chỉ' },
      { status: 500 }
    );
  }
}

// DELETE - Xóa địa chỉ
export async function DELETE(request: NextRequest) {
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Thiếu ID địa chỉ' },
        { status: 400 }
      );
    }

    // Kiểm tra địa chỉ thuộc về user
    const checkQuery = 'SELECT id, is_default FROM address WHERE id = ? AND usersId = ? AND deletedAt IS NULL';
    const existingAddress = await executeQuery<any[]>(checkQuery, [id, userId]);
    
    if (!existingAddress || existingAddress.length === 0) {
      return NextResponse.json(
        { error: 'Địa chỉ không tồn tại' },
        { status: 404 }
      );
    }

    // Không cho phép xóa địa chỉ mặc định
    if (existingAddress[0].is_default) {
      return NextResponse.json(
        { error: 'Không thể xóa địa chỉ mặc định' },
        { status: 400 }
      );
    }

    // Soft delete
    await executeQuery(
      'UPDATE address SET deletedAt = NOW() WHERE id = ? AND usersId = ?',
      [id, userId]
    );

    return NextResponse.json({
      success: true,
      message: 'Địa chỉ đã được xóa thành công'
    });

  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json(
      { error: 'Không thể xóa địa chỉ' },
      { status: 500 }
    );
  }
} 