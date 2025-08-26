import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const authToken = request.headers.get('authToken');
    
    // Luôn chấp nhận request, dù có token hay không
    const headers: any = {};
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    const response = await axios.get(`${API_BASE_URL}/wishlist/auth/user`, { headers });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { error: error.response?.data?.message || 'Internal server error' },
      { status: error.response?.status || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authToken = request.headers.get('authToken');
    const body = await request.json();
    
    // Luôn chấp nhận request, dù có token hay không
    const headers: any = {};
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    const response = await axios.post(`${API_BASE_URL}/wishlist/universal`, body, { headers });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { error: error.response?.data?.message || 'Internal server error' },
      { status: error.response?.status || 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authToken = request.headers.get('authToken');
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    // Luôn chấp nhận request, dù có token hay không
    const headers: any = {};
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const response = await axios.delete(`${API_BASE_URL}/wishlist/auth/product/${productId}`, { headers });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json(
      { error: error.response?.data?.message || 'Internal server error' },
      { status: error.response?.status || 500 }
    );
  }
}
