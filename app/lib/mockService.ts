import { Product, Category } from './productService'

// Mock data cho testing
export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Yaourt Lucerne ít béo, hương dâu",
    price: 665000,
    slug: "yaourt-lucerne-it-beo-huong-dau",
    images: "/client/images/pr-1.png",
    discount: 75000,
    description: "Sản phẩm yaourt ngon, bổ dưỡng từ thương hiệu Lucerne",
    category: "Sữa & Sản phẩm từ sữa",
    category_id: 1,
    stock: 50,
    rating: 4.9,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Sữa tươi Dalat Milk nguyên chất",
    price: 450000,
    slug: "sua-tuoi-dalat-milk-nguyen-chat",
    images: "/client/images/pr-2.png",
    discount: 50000,
    description: "Sữa tươi nguyên chất từ cao nguyên Đà Lạt",
    category: "Sữa & Sản phẩm từ sữa",
    category_id: 1,
    stock: 30,
    rating: 4.8,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    name: "Bánh quy Oreo kem vani",
    price: 85000,
    slug: "banh-quy-oreo-kem-vani",
    images: "/client/images/pr-3.png",
    discount: 15000,
    description: "Bánh quy Oreo thơm ngon với kem vani",
    category: "Snack & Bánh kẹo",
    category_id: 2,
    stock: 100,
    rating: 4.5,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    name: "Nước cam Tropicana 100% nguyên chất",
    price: 125000,
    slug: "nuoc-cam-tropicana-100-nguyen-chat",
    images: "/client/images/pr-4.png",
    discount: 25000,
    description: "Nước cam tươi nguyên chất từ Tropicana",
    category: "Đồ uống",
    category_id: 3,
    stock: 75,
    rating: 4.3,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 5,
    name: "Thịt bò Úc nhập khẩu cao cấp",
    price: 950000,
    slug: "thit-bo-uc-nhap-khau-cao-cap",
    images: "/client/images/pr-1.png",
    discount: 150000,
    description: "Thịt bò Úc tươi ngon, chất lượng cao",
    category: "Thịt & Hải sản",
    category_id: 4,
    stock: 25,
    rating: 4.7,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 6,
    name: "Rau cải xanh hữu cơ",
    price: 45000,
    slug: "rau-cai-xanh-huu-co",
    images: "/client/images/pr-2.png",
    discount: 5000,
    description: "Rau cải xanh tươi, trồng theo phương pháp hữu cơ",
    category: "Rau củ quả",
    category_id: 5,
    stock: 80,
    rating: 4.2,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 7,
    name: "Gạo ST25 Việt Nam",
    price: 180000,
    slug: "gao-st25-viet-nam",
    images: "/client/images/pr-3.png",
    discount: 30000,
    description: "Gạo ST25 thơm dẻo, được bình chọn ngon nhất thế giới",
    category: "Thực phẩm khô",
    category_id: 6,
    stock: 60,
    rating: 4.9,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 8,
    name: "Cà phê Trung Nguyên rang xay",
    price: 220000,
    slug: "ca-phe-trung-nguyen-rang-xay",
    images: "/client/images/pr-4.png",
    discount: 40000,
    description: "Cà phê rang xay thơm ngon từ Trung Nguyên",
    category: "Đồ uống",
    category_id: 3,
    stock: 45,
    rating: 4.6,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
]

export const mockCategories: Category[] = [
  {
    id: 1,
    name: "Sữa & Sản phẩm từ sữa",
    color: "#E3F2FD",
    icon: "/client/images/category-milk.png",
    count: 25,
    description: "Sữa tươi, yaourt, phô mai và các sản phẩm từ sữa"
  },
  {
    id: 2,
    name: "Snack & Bánh kẹo",
    color: "#FFF3E0",
    icon: "/client/images/category-snack.png",
    count: 40,
    description: "Bánh quy, kẹo, snack các loại"
  },
  {
    id: 3,
    name: "Đồ uống",
    color: "#E8F5E8",
    icon: "/client/images/category-drink.png",
    count: 30,
    description: "Nước giải khát, nước ép, cà phê, trà"
  },
  {
    id: 4,
    name: "Thịt & Hải sản",
    color: "#FFEBEE",
    icon: "/client/images/category-meat.png",
    count: 20,
    description: "Thịt tươi, hải sản tươi sống"
  },
  {
    id: 5,
    name: "Rau củ quả",
    color: "#F3E5F5",
    icon: "/client/images/category-vegetable.png",
    count: 50,
    description: "Rau củ quả tươi, hữu cơ"
  },
  {
    id: 6,
    name: "Thực phẩm khô",
    color: "#FFF8E1",
    icon: "/client/images/category-grain.png",
    count: 35,
    description: "Gạo, ngũ cốc, đậu phộng các loại"
  }
]

class MockProductService {
  async getAllProducts(params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
    sort?: string
    order?: 'asc' | 'desc'
  }): Promise<Product[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let products = [...mockProducts]
    
    // Filter by search
    if (params?.search) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(params.search!.toLowerCase())
      )
    }
    
    // Filter by category
    if (params?.category) {
      products = products.filter(p => 
        p.category?.toLowerCase().includes(params.category!.toLowerCase())
      )
    }
    
    // Sort
    if (params?.sort === 'price') {
      products.sort((a, b) => {
        return params.order === 'desc' ? b.price - a.price : a.price - b.price
      })
    }
    
    // Pagination
    if (params?.page && params?.limit) {
      const start = (params.page - 1) * params.limit
      const end = start + params.limit
      products = products.slice(start, end)
    }
    
    return products
  }

  async getProductById(id: number): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockProducts.find(p => p.id === id) || null
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockProducts.find(p => p.slug === slug) || null
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 400))
    return mockProducts.filter(p => p.category_id === categoryId)
  }

  async searchProducts(query: string): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 400))
    return mockProducts.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    )
  }

  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 400))
    return mockProducts
      .filter(p => p.rating && p.rating >= 4.5)
      .slice(0, limit)
  }

  async getBestSellingProducts(limit: number = 8): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 400))
    return mockProducts
      .sort((a, b) => (b.stock || 0) - (a.stock || 0))
      .slice(0, limit)
  }
}

class MockCategoryService {
  async getAllCategories(): Promise<Category[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...mockCategories]
  }

  async getCategoryById(id: number): Promise<Category | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockCategories.find(c => c.id === id) || null
  }
}

export const mockProductService = new MockProductService()
export const mockCategoryService = new MockCategoryService()

export default {
  mockProductService,
  mockCategoryService
}
