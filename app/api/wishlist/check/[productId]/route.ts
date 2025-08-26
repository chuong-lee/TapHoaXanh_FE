import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const authToken = request.headers.get('authToken');
    const { productId } = params;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await axios.get(`${API_BASE_URL}/wishlist/auth/check/${productId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error checking wishlist status:', error);
    return NextResponse.json(
      { error: error.response?.data?.message || 'Internal server error' },
      { status: error.response?.status || 500 }
    );
  }
}
