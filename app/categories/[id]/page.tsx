'use client'

import { useProducts } from '@/hooks/useProducts'
import ProductCard from '@/components/product/ProductCard'
import { Skeleton } from '@/components/ui/LoadingSkeleton'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function CategoryDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const categoryId = Number(params.id)
  const categoryName = searchParams.get('name') || 'Danh mục'

  const { products, loading, error, filterByCategory } = useProducts({
    autoFetch: false
  })

  useEffect(() => {
    if (categoryId) {
      filterByCategory(categoryId)
    }
  }, [categoryId, filterByCategory])

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} className="h-64" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => filterByCategory(categoryId)}
              className="text-primary hover:text-primary/80"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb Section */}
        <div className="breadcrumb-section">
          <div className="container">
            <h3 className="text-center">Danh Mục Chi Tiết</h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link href="/">Trang Chủ</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/categories">Danh Mục</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">Chi Tiết</li>
              </ol>
            </nav>
          </div>
        </div>

        <main className="main-content">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{categoryName}</h1>
            <p className="text-muted-foreground">
              {products.length} sản phẩm được tìm thấy
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Không có sản phẩm nào trong danh mục này
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
