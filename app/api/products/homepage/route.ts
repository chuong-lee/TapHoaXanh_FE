import 'dotenv/config'
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'

interface HomepageProduct {
  id: number
  name: string
  price: number
  discount: number
  images: string
  slug: string
  category: string
  description: string
}

// In-memory cache for homepage products
let homepageCache: {
  data: HomepageProduct[];
  timestamp: number;
} | null = null;

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

// GET /api/products/homepage - Optimized for homepage
export async function GET() {
  try {
    // Check cache first
    if (homepageCache && Date.now() - homepageCache.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        data: homepageCache.data,
        total: homepageCache.data.length,
        cached: true
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
          'X-Cache': 'HIT'
        }
      });
    }

    // Get only essential data for homepage - limit to 20 products
    const rows = await executeQuery<HomepageProduct[]>(`
      SELECT 
        p.id,
        p.name,
        p.price,
        p.discount,
        p.images,
        p.slug,
        p.description,
        c.name as category
      FROM product p
      LEFT JOIN category c ON p.category_id = c.id
      ORDER BY p.id DESC
      LIMIT 20
    `)

    console.log('Homepage products query result:', {
      rowsCount: rows.length,
      sampleProduct: rows[0]
    })

    // Function để xử lý URL hình ảnh
    function processImageUrl(imagePath: string | null): string {
      if (!imagePath) {
        return '/client/images/product-placeholder-1.png'
      }
      
      // Nếu là URL đầy đủ (từ database)
      if (imagePath.startsWith('http')) {
        return imagePath
      }
      
      // Nếu là đường dẫn tương đối
      if (imagePath.startsWith('/')) {
        return imagePath
      }
      
      // Nếu là tên file trong thư mục client/images
      if (imagePath.startsWith('client/images/')) {
        return '/' + imagePath
      }
      
      // Nếu là tên file khác, thêm prefix
      return '/client/images/' + imagePath
    }

    // Format product data với xử lý hình ảnh
    const formattedProducts = rows.map(row => ({
      ...row,
      images: processImageUrl(row.images)
    }))

    // Update cache
    homepageCache = {
      data: formattedProducts,
      timestamp: Date.now()
    };

    console.log('Returning homepage products:', {
      count: formattedProducts.length,
      sampleProduct: formattedProducts[0]
    });

    return NextResponse.json({
      success: true,
      data: formattedProducts,
      total: formattedProducts.length,
      cached: false
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
        'X-Cache': 'MISS'
      }
    })
    
  } catch (error) {
    console.error('Error fetching homepage products:', error)
    
    // Return cached data if available
    if (homepageCache) {
      return NextResponse.json({
        success: true,
        data: homepageCache.data,
        total: homepageCache.data.length,
        cached: true,
        error: 'Using cached data due to database error'
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=300',
          'X-Cache': 'HIT-FALLBACK'
        }
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
