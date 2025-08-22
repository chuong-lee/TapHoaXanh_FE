import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    const categories = await executeQuery(
      'SELECT id, name, slug FROM category WHERE parent_id = 0 ORDER BY id ASC'
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
