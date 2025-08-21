import Link from 'next/link'
import { CategoryList } from '../../components/CategoryList'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Danh mục sản phẩm - TapHoaXanh',
  description: 'Khám phá tất cả danh mục sản phẩm tại TapHoaXanh'
}

export default function CategoriesPage() {
  return (
    <>
      {/* Breadcrumb Section */}
      <div className="breadcrumb-section">
        <div className="container">
          <h3 className="text-center">Danh Mục</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Trang Chủ</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Danh Mục</li>
            </ol>
          </nav>
        </div>
      </div>

      <section>
        {/* ... existing code ... */}
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
      </section>
    </>
  )
}
