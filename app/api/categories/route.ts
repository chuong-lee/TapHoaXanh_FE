import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    const categories = await executeQuery(
      'SELECT id, name, description, image FROM categories WHERE active = 1 ORDER BY sort_order ASC, name ASC'
    );

    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch categories'
    }, { status: 500 });
  }
}
