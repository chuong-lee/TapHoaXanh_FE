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

// Mock data - same as in route.ts
const mockPosts: Post[] = [
  {
    id: 1,
    title: "Khuyến mãi cuối tuần - Giảm giá 50% cho tất cả sản phẩm",
    content: `
      <h2>Chương trình khuyến mãi lớn cuối tuần</h2>
      <p>Tạp Hóa Xanh tự hào mang đến chương trình khuyến mãi lớn nhất trong năm với mức giảm giá lên đến 50% cho tất cả các mặt hàng.</p>
      
      <h3>Thời gian áp dụng:</h3>
      <ul>
        <li>Từ 6h00 sáng thứ 7 đến 23h59 Chủ nhật hàng tuần</li>
        <li>Áp dụng cho tất cả cửa hàng và website</li>
      </ul>
      
      <h3>Sản phẩm được giảm giá:</h3>
      <ul>
        <li>Thực phẩm tươi sống: giảm 30-50%</li>
        <li>Đồ uống các loại: giảm 25-40%</li>
        <li>Gia vị và nguyên liệu: giảm 20-35%</li>
        <li>Snack và bánh kẹo: giảm 15-30%</li>
      </ul>
      
      <p>Đây là cơ hội tuyệt vời để bạn và gia đình mua sắm với giá ưu đãi nhất. Hãy nhanh tay đến các cửa hàng Tạp Hóa Xanh để không bỏ lỡ!</p>
    `,
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
    content: `
      <h2>Thực phẩm hữu cơ - Xu hướng sống khỏe</h2>
      <p>Trong thời đại hiện tại, việc chọn lựa thực phẩm hữu cơ không chỉ là xu hướng mà còn là nhu cầu thiết yếu cho sức khỏe.</p>
      
      <h3>1. Rau củ quả hữu cơ</h3>
      <p>Rau củ quả hữu cơ được trồng không sử dụng thuốc trừ sâu và phân bón hóa học, giúp cung cấp nhiều vitamin và khoáng chất tự nhiên.</p>
      
      <h3>2. Thịt hữu cơ</h3>
      <p>Thịt từ các trang trại hữu cơ có hàm lượng protein cao và ít chất béo bão hòa hơn.</p>
      
      <h3>3. Sữa và sản phẩm từ sữa hữu cơ</h3>
      <p>Không chứa hormone tăng trưởng và kháng sinh, an toàn cho cả trẻ em và người lớn.</p>
      
      <h3>4. Ngũ cốc hữu cơ</h3>
      <p>Giàu chất xơ và dinh dưỡng, hỗ trợ hệ tiêu hóa hoạt động tốt hơn.</p>
      
      <h3>5. Dầu ăn hữu cơ</h3>
      <p>Chiết xuất từ nguồn nguyên liệu tự nhiên, không qua xử lý hóa học.</p>
    `,
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
    content: `
      <h2>Bí quyết bảo quản thực phẩm đúng cách</h2>
      <p>Việc bảo quản thực phẩm đúng cách không chỉ giúp tiết kiệm chi phí mà còn đảm bảo dinh dưỡng và an toàn thực phẩm.</p>
      
      <h3>Bảo quản rau củ:</h3>
      <ul>
        <li>Rau lá: Bọc giấy ẩm, để ngăn mát tủ lạnh</li>
        <li>Củ cải, cà rốt: Để nơi khô ráo, thoáng mát</li>
        <li>Cà chua: Để ở nhiệt độ phòng để chín đều</li>
      </ul>
      
      <h3>Bảo quản thịt cá:</h3>
      <ul>
        <li>Thịt tươi: Cho vào túi nilon, để ngăn đá</li>
        <li>Cá tươi: Rửa sạch, để trong ngăn mát</li>
        <li>Thịt đã chế biến: Để trong hộp kín</li>
      </ul>
      
      <h3>Bảo quản trái cây:</h3>
      <ul>
        <li>Chuối: Để ở nhiệt độ phòng</li>
        <li>Táo, lê: Để trong tủ lạnh</li>
        <li>Cam, quýt: Để nơi khô ráo, thoáng mát</li>
      </ul>
    `,
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
    content: `
      <h2>Dòng sản phẩm Organic cao cấp</h2>
      <p>Tạp Hóa Xanh tự hào giới thiệu bộ sưu tập sản phẩm organic mới nhất, được chọn lọc kỹ càng từ các trang trại uy tín.</p>
      
      <h3>Đặc điểm nổi bật:</h3>
      <ul>
        <li>100% tự nhiên, không chất bảo quản</li>
        <li>Được chứng nhận organic quốc tế</li>
        <li>Đóng gói thân thiện môi trường</li>
        <li>Giá cả hợp lý, chất lượng cao</li>
      </ul>
      
      <h3>Các sản phẩm trong bộ sưu tập:</h3>
      <ul>
        <li>Rau củ organic tươi ngon</li>
        <li>Trái cây organic nhập khẩu</li>
        <li>Ngũ cốc và hạt dinh dưỡng</li>
        <li>Sản phẩm từ sữa organic</li>
        <li>Gia vị và dầu ăn organic</li>
      </ul>
      
      <p>Hãy đến ngay các cửa hàng Tạp Hóa Xanh để trải nghiệm những sản phẩm organic tuyệt vời này!</p>
    `,
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
    content: `
      <h2>Xu hướng dinh dưỡng 2024</h2>
      <p>Năm 2024 đánh dấu sự thay đổi mạnh mẽ trong cách chúng ta tiếp cận dinh dưỡng và sức khỏe.</p>
      
      <h3>1. Plant-based Diet (Chế độ ăn thực vật)</h3>
      <p>Ngày càng nhiều người chuyển sang chế độ ăn chủ yếu từ thực vật để cải thiện sức khỏe và bảo vệ môi trường.</p>
      
      <h3>2. Intermittent Fasting (Nhịn ăn gián đoạn)</h3>
      <p>Phương pháp này giúp cải thiện trao đổi chất và hỗ trợ giảm cân hiệu quả.</p>
      
      <h3>3. Functional Foods (Thực phẩm chức năng)</h3>
      <p>Các thực phẩm có khả năng hỗ trợ sức khỏe cụ thể như probiotics, omega-3, antioxidants.</p>
      
      <h3>4. Mindful Eating (Ăn uống có ý thức)</h3>
      <p>Tập trung vào chất lượng thực phẩm và cách thức ăn uống thay vì chỉ quan tâm đến số lượng.</p>
      
      <h3>5. Sustainable Food (Thực phẩm bền vững)</h3>
      <p>Ưu tiên các sản phẩm được sản xuất theo cách thân thiện với môi trường.</p>
    `,
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
    content: `
      <h2>Chương trình khách hàng thân thiết</h2>
      <p>Tạp Hóa Xanh ra mắt chương trình tích điểm mới dành riêng cho khách hàng thân thiết với nhiều ưu đãi hấp dẫn.</p>
      
      <h3>Cách thức tham gia:</h3>
      <ol>
        <li>Đăng ký thành viên tại cửa hàng hoặc website</li>
        <li>Mua sắm và tích lũy điểm</li>
        <li>Sử dụng điểm để đổi quà hoặc giảm giá</li>
      </ol>
      
      <h3>Quyền lợi thành viên:</h3>
      <ul>
        <li>Tích điểm mỗi lần mua hàng (1 điểm/1000đ)</li>
        <li>Giảm giá đặc biệt cho thành viên VIP</li>
        <li>Ưu tiên khi có sản phẩm mới</li>
        <li>Nhận thông tin khuyến mãi sớm nhất</li>
        <li>Sinh nhật được tặng voucher đặc biệt</li>
      </ul>
      
      <h3>Hạng thành viên:</h3>
      <ul>
        <li>Bạc: 0-500 điểm (giảm 3%)</li>
        <li>Vàng: 500-1500 điểm (giảm 5%)</li>
        <li>Kim cương: 1500+ điểm (giảm 8%)</li>
      </ul>
      
      <p>Đăng ký ngay hôm nay để không bỏ lỡ những ưu đãi tuyệt vời!</p>
    `,
    description: "Tham gia ngay để nhận được những ưu đãi đặc biệt và quà tặng hấp dẫn",
    image: "/client/images/start.png",
    category: "Tin Khuyến Mãi",
    views: 1350,
    readTime: "5 phút",
    createdAt: "2024-12-10T16:30:00Z",
    updatedAt: "2024-12-10T16:30:00Z"
  }
]

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const postId = parseInt(id)
    
    if (isNaN(postId)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid post ID'
      }, { status: 400 })
    }
    
    const post = mockPosts.find(p => p.id === postId)
    
    if (!post) {
      return NextResponse.json({
        success: false,
        message: 'Post not found'
      }, { status: 404 })
    }
    
    // Increase view count (in real app, this would update database)
    post.views += 1
    
    return NextResponse.json({
      success: true,
      data: post
    })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch post',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}