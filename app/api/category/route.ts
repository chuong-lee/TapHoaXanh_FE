import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import 'dotenv/config'

interface CategoryRow {
  id: number
  name: string
  count?: number
}

// GET /api/category - Get all categories
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const withCount = searchParams.get('withCount') === 'true'
    
    if (withCount) {
      // Get categories with product count (simplified for actual database schema)
      const rows = await executeQuery<CategoryRow[]>(`
        SELECT 
          c.id,
          c.name,
          COUNT(p.id) as count
        FROM category c
        LEFT JOIN product p ON c.id = p.categoryId AND p.deletedAt IS NULL
        GROUP BY c.id, c.name
        ORDER BY c.name ASC
      `)
      
      // Format category data
      const categories = rows.map(row => ({
        id: row.id,
        name: row.name,
        count: row.count || 0,
        color: getColorForCategory(row.id),
        icon: `/client/images/category-${row.id}.png`
      }))
      
      return NextResponse.json({
        success: true,
        data: categories,
        total: categories.length
      })
    } else {
      // Get categories without count (faster)
      const rows = await executeQuery<CategoryRow[]>(`
        SELECT 
          id,
          name
        FROM category
        ORDER BY name ASC
      `)
      
      // Format category data
      const categories = rows.map(row => ({
        id: row.id,
        name: row.name,
        color: getColorForCategory(row.id),
        icon: `/client/images/category-${row.id}.png`
      }))
      
      return NextResponse.json({
        success: true,
        data: categories,
        total: categories.length
      })
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    
    // Fallback to dummy data if database fails
    const fallbackCategories = [
      { id: 1, name: "Bánh & Sữa", color: "#E3F2FD", count: 25 },
      { id: 2, name: "Cà phê & Trà", color: "#FFF3E0", count: 15 },
      { id: 3, name: "Thức ăn thú cưng", color: "#E8F5E8", count: 8 },
      { id: 4, name: "Rau củ", color: "#FFEBEE", count: 32 },
      { id: 5, name: "Thịt tươi", color: "#F3E5F5", count: 18 },
      { id: 6, name: "Đồ uống", color: "#FFF8E1", count: 22 }
    ];
    
    return NextResponse.json({
      success: true,
      data: fallbackCategories,
      fallback: true,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

// Helper function to assign colors to category
function getColorForCategory(categoryId: number): string {
  const colors = [
    '#4CAF50', // Green - Đồ uống
    '#FF9800', // Orange - Nông sản thực phẩm  
    '#2196F3', // Blue - Thủy hải sản
    '#9C27B0', // Purple - Thực phẩm tự chăn nuôi
    '#F44336', // Red - Thực phẩm chế biến
    '#795548', // Brown - Gia vị & nguyên liệu nấu ăn
    '#E91E63', // Pink - Đồ ăn vặt & bánh kẹo
    '#607D8B', // Blue Grey - Thức uống thực phẩm
    '#FF5722'  // Deep Orange - Đặc sản & thực phẩm truyền thống
  ]
  
  return colors[(categoryId - 1) % colors.length] || '#4CAF50'
}
