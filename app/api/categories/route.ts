import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Gọi backend server
    const res = await fetch('http://localhost:5000/categories')
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ Lỗi khi gọi API categories:', error)
    
    // Fallback data
    const mockCategories = [
      {
        name: 'Đồ uống',
        color: '#e3f2fd',
        icon: '/client/images/water.png',
        count: 15
      },
      {
        name: 'Rau củ',
        color: '#e8f5e8',
        icon: '/client/images/vegetables.png',
        count: 25
      },
      {
        name: 'Hải sản',
        color: '#fff3e0',
        icon: '/client/images/seafood.png',
        count: 12
      },
      {
        name: 'Thịt',
        color: '#fce4ec',
        icon: '/client/images/meat.png',
        count: 18
      },
      {
        name: 'Sữa',
        color: '#f3e5f5',
        icon: '/client/images/milk.png',
        count: 8
      },
      {
        name: 'Đồ ăn vặt',
        color: '#fff8e1',
        icon: '/client/images/snacks.png',
        count: 30
      }
    ]
    
    return NextResponse.json(mockCategories)
  }
}
