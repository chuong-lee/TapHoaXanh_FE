import { CategoryList } from '../../components/CategoryList'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Danh mục sản phẩm - TapHoaXanh',
  description: 'Khám phá tất cả danh mục sản phẩm tại TapHoaXanh'
}

export default function CategoriesPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Tất cả danh mục</h1>
          <p className="text-muted-foreground">
            Khám phá các danh mục sản phẩm đa dạng tại TapHoaXanh
          </p>
        </div>
        
        <CategoryList showViewAll={false} />
      </div>
    </div>
  )
}
