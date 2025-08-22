import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Clear any server-side session if needed
    // For JWT-based auth, we just return success since client handles token removal
    
    return NextResponse.json({
      success: true,
      message: 'Đăng xuất thành công'
    });

  } catch (error) {
    console.error('Error in logout API:', error);
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}
