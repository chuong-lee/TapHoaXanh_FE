import { NextRequest, NextResponse } from 'next/server'

interface Post {
  id: number
  title: string
  content: string
  description: string
  image: string
  category: string
  views: number
  readTime: string
  createdAt: string
  updatedAt: string
}

// Mock data vì chưa có bảng posts trong database
const mockPosts: Post[] = [
  {
    id: 1,
    title: "Khuyến mãi cuối tuần - Giảm giá 50% cho tất cả sản phẩm",
    content: "Chương trình khuyến mãi lớn cuối tuần với mức giảm giá lên đến 50% cho tất cả các mặt hàng tại Tạp Hóa Xanh...",
    description: "Đừng bỏ lỡ cơ hội mua sắm với giá ưu đãi nhất trong năm tại Tạp Hóa Xanh",
    image: "/client/images/bn.png",
    category: "Tin Khuyến Mãi",
    views: 1250,
    readTime: "5 phút",
    createdAt: "2024-12-15T10:00:00Z",
    updatedAt: "2024-12-15T10:00:00Z"
  },
  {
    id: 2,
    title: "5 loại thực phẩm hữu cơ tốt nhất cho sức khỏe",
    content: "Khám phá những thực phẩm hữu cơ được chọn lọc kỹ càng, mang lại lợi ích tuyệt vời cho sức khỏe...",
    description: "Tìm hiểu về những lợi ích tuyệt vời của thực phẩm hữu cơ và cách chọn lựa phù hợp",
    image: "/client/images/product.png",
    category: "Sức Khỏe",
    views: 890,
    readTime: "7 phút",
    createdAt: "2024-12-14T15:30:00Z",
    updatedAt: "2024-12-14T15:30:00Z"
  },
  {
    id: 3,
    title: "Mẹo bảo quản thực phẩm tươi ngon lâu hơn",
    content: "Chia sẻ những bí quyết bảo quản thực phẩm giúp giữ được độ tươi ngon và dinh dưỡng...",
    description: "Học cách bảo quản thực phẩm đúng cách để tiết kiệm chi phí và đảm bảo sức khỏe",
    image: "/client/images/IT.png",
    category: "Ẩm Thực",
    views: 675,
    readTime: "6 phút",
    createdAt: "2024-12-13T09:15:00Z",
    updatedAt: "2024-12-13T09:15:00Z"
  },
  {
    id: 4,
    title: "Ra mắt dòng sản phẩm organic mới",
    content: "Tạp Hóa Xanh tự hào giới thiệu dòng sản phẩm organic cao cấp mới nhất...",
    description: "Khám phá bộ sưu tập sản phẩm organic mới với chất lượng vượt trội",
    image: "/client/images/hotdeal.png",
    category: "Sản Phẩm Mới",
    views: 1100,
    readTime: "4 phút",
    createdAt: "2024-12-12T14:20:00Z",
    updatedAt: "2024-12-12T14:20:00Z"
  },
  {
    id: 5,
    title: "Xu hướng ăn uống lành mạnh 2024",
    content: "Cập nhật những xu hướng ăn uống lành mạnh được ưa chuộng nhất trong năm 2024...",
    description: "Theo dõi những trend dinh dưỡng mới nhất để có lối sống khỏe mạnh hơn",
    image: "/client/images/banner.png",
    category: "Lifestyle",
    views: 950,
    readTime: "8 phút",
    createdAt: "2024-12-11T11:45:00Z",
    updatedAt: "2024-12-11T11:45:00Z"
  },
  {
    id: 6,
    title: "Chương trình tích điểm thành viên VIP",
    content: "Giới thiệu chương trình tích điểm mới dành cho khách hàng thân thiết của Tạp Hóa Xanh...",
    description: "Tham gia ngay để nhận được những ưu đãi đặc biệt và quà tặng hấp dẫn",
    image: "/client/images/start.png",
    category: "Tin Khuyến Mãi",
    views: 1350,
    readTime: "5 phút",
    createdAt: "2024-12-10T16:30:00Z",
    updatedAt: "2024-12-10T16:30:00Z"
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    
    let filteredPosts = [...mockPosts]
    
    // Filter by category if specified
    if (category) {
      filteredPosts = filteredPosts.filter(post => 
        post.category.toLowerCase().includes(category.toLowerCase())
      )
    }
    
    // Apply limit
    if (limit > 0) {
      filteredPosts = filteredPosts.slice(0, limit)
    }
    
    return NextResponse.json({
      success: true,
      data: filteredPosts,
      total: filteredPosts.length
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch posts',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}