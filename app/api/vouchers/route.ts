import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    
    const rows = await executeQuery(`
      SELECT 
        id,
        code,
        max_discount,
        min_order_value,
        quantity,
        is_used,
        start_date,
        end_date,
        type,
        createdAt,
        updatedAt
      FROM voucher 
      WHERE deletedAt IS NULL
        AND start_date <= NOW() 
        AND end_date >= NOW()
        AND (quantity = 0 OR is_used < quantity)
      ORDER BY createdAt DESC
    `);
    
    return NextResponse.json({ 
      success: true, 
      data: rows,
      total: rows.length 
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' }
    });
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vouchers' },
      { status: 500 }
    );
  }
}
