'use client'

import { useProducts } from '@/app/hooks/useProducts'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface CategoryListProps {
  title?: string
  limit?: number
  showViewAll?: boolean
}

export function CategoryList({ 
  title = "Danh mục sản phẩm", 
  limit,
  showViewAll = true 
}: CategoryListProps) {
  const { categories, categoriesLoading, filterByCategory } = useProducts()
  const router = useRouter()

  const displayCategories = limit ? categories.slice(0, limit) : categories

  const handleCategoryClick = (categoryId: number, categoryName: string) => {
    filterByCategory(categoryId)
    router.push(`/categories/${categoryId}?name=${encodeURIComponent(categoryName)}`)
  }

  const handleViewAll = () => {
    router.push('/categories')
  }

  if (categoriesLoading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{title}</h2>
            {showViewAll && (
              <Skeleton className="h-10 w-24" />
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4">
                  <Skeleton className="w-full h-20 mb-3" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!categories.length) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">{title}</h2>
          <p className="text-muted-foreground text-center py-8">
            Không có danh mục nào được tìm thấy
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          {showViewAll && categories.length > (limit || 0) && (
            <button
              onClick={handleViewAll}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Xem tất cả →
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {displayCategories.map((category) => (
            <Card
              key={category.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleCategoryClick(category.id, category.name)}
            >
              <CardContent className="p-4 text-center">
                {category.image && (
                  <div className="relative w-full h-20 mb-3">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                )}
                <h3 className="font-medium text-sm line-clamp-2">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {category.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
