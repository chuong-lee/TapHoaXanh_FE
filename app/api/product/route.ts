import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Gọi backend server
    const res = await fetch('http://localhost:5000/products')
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ Lỗi khi gọi API products:', error)
    
    // Fallback data với cấu trúc mới
    const mockProducts = [
      {
        id: 1,
        createdAt: '2025-06-14T14:10:18.000Z',
        updatedAt: '2025-06-14T14:10:34.144778Z',
        deletedAt: null,
        name: 'Nước ép cam VinEco',
        price: 18000,
        discount: 10,
        images: 'https://dummyimage.com/600x400/cccccc/000000&text=SPM1',
        slug: 'nuoc-ep-cam-vineco',
        barcode: 'SPM00001',
        expiry_date: '2025-12-31T00:00:00.000Z',
        origin: 'Việt Nam',
        weight_unit: 'chai',
        description: 'Nước ép cam nguyên chất từ trang trại VinEco, giàu vitamin C, tăng cường đề kháng, thanh lọc cơ thể mỗi ngày.',
        quantity: 120,
        brandId: 7,
        purchase: 0,
        categoryId: 1,
        category_childId: null,
        category: 'Đồ uống'
      },
      {
        id: 2,
        createdAt: '2025-06-14T14:10:18.000Z',
        updatedAt: '2025-06-14T14:10:34.158273Z',
        deletedAt: null,
        name: 'Sữa chua TH True Milk',
        price: 12000,
        discount: 5,
        images: 'https://dummyimage.com/600x400/cccccc/000000&text=SPM2',
        slug: 'sua',
        barcode: 'SPM00002',
        expiry_date: '2025-11-10T00:00:00.000Z',
        origin: 'Việt Nam',
        weight_unit: 'hộp',
        description: 'Sữa chua lên men tự nhiên từ sữa tươi sạch TH, vị dịu nhẹ, tốt cho hệ tiêu hóa và làn da.',
        quantity: 200,
        brandId: 5,
        purchase: 0,
        categoryId: 1,
        category_childId: null,
        category: 'Sữa và chế phẩm từ sữa'
      },
      {
        id: 3,
        createdAt: '2025-06-14T14:10:18.000Z',
        updatedAt: '2025-06-14T14:10:34.165257Z',
        deletedAt: null,
        name: 'Mực khô Seaspimex',
        price: 58000,
        discount: 15,
        images: 'https://dummyimage.com/600x400/cccccc/000000&text=SPM3',
        slug: 'muc-kho-seaspimex',
        barcode: 'SPM00003',
        expiry_date: '2026-02-20T00:00:00.000Z',
        origin: 'Việt Nam',
        weight_unit: 'gói',
        description: 'Mực khô tuyển chọn, phơi nắng tự nhiên, thịt dai ngọt, phù hợp làm món nướng hay rim mắm.',
        quantity: 80,
        brandId: 13,
        purchase: 0,
        categoryId: 1,
        category_childId: null,
        category: 'Hải sản'
      },
      {
        id: 4,
        createdAt: '2025-06-14T14:10:18.000Z',
        updatedAt: '2025-06-14T14:10:34.171775Z',
        deletedAt: null,
        name: 'Cá basa đông lạnh Vĩnh Hoàn',
        price: 47000,
        discount: 8,
        images: 'https://dummyimage.com/600x400/cccccc/000000&text=SPM4',
        slug: 'ca-basa-dong-lanh',
        barcode: 'SPM00004',
        expiry_date: '2025-09-15T00:00:00.000Z',
        origin: 'Việt Nam',
        weight_unit: 'túi',
        description: 'Phi lê cá basa tươi ngon, đóng gói tiện lợi, giàu omega-3, thích hợp chiên, kho hay nấu canh.',
        quantity: 65,
        brandId: 11,
        purchase: 0,
        categoryId: 1,
        category_childId: null,
        category: 'Hải sản'
      },
      {
        id: 5,
        createdAt: '2025-06-14T14:10:18.000Z',
        updatedAt: '2025-06-14T14:10:34.187415Z',
        deletedAt: null,
        name: 'Trứng gà Ba Huân',
        price: 25000,
        discount: 0,
        images: 'https://dummyimage.com/600x400/cccccc/000000&text=SPM5',
        slug: 'trung',
        barcode: 'SPM00005',
        expiry_date: '2025-07-01T00:00:00.000Z',
        origin: 'Việt Nam',
        weight_unit: 'vỉ',
        description: 'Trứng gà sạch từ trang trại Ba Huân, giàu dinh dưỡng, vỏ dày, lòng đỏ tươi sáng, an toàn tuyệt đối.',
        quantity: 150,
        brandId: 17,
        purchase: 0,
        categoryId: 1,
        category_childId: null,
        category: 'Trứng'
      }
    ]
    
    return NextResponse.json(mockProducts)
  }
}
