import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productService, categoryService, Product, Category } from '@/lib/productService'

// Query keys
export const QUERY_KEYS = {
  products: ['products'] as const,
  productsByCategory: (categoryId: number) => ['products', 'category', categoryId] as const,
  productById: (id: number) => ['products', id] as const,
  productBySlug: (slug: string) => ['products', 'slug', slug] as const,
  categories: ['categories'] as const,
  categoriesWithCount: ['categories', 'withCount'] as const,
  featuredProducts: (limit: number) => ['products', 'featured', limit] as const,
  bestSellingProducts: (limit: number) => ['products', 'bestSelling', limit] as const,
} as const

// Products hooks
export function useProductsQuery(params?: {
  page?: number
  limit?: number
  category?: string
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
  fetchAll?: boolean
}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.products, params],
    queryFn: () => productService.getAllProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useProductQuery(id?: number, slug?: string) {
  return useQuery({
    queryKey: slug ? QUERY_KEYS.productBySlug(slug) : id ? QUERY_KEYS.productById(id) : ['products', 'none'],
    queryFn: async () => {
      if (slug) {
        return productService.getProductBySlug(slug)
      } else if (id) {
        return productService.getProductById(id)
      }
      return null
    },
    enabled: !!(id || slug),
    staleTime: 10 * 60 * 1000, // 10 minutes for individual products
  })
}

export function useProductsByCategoryQuery(categoryId: number, params?: {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.productsByCategory(categoryId), params],
    queryFn: () => productService.getProductsByCategory(categoryId, params),
    enabled: !!categoryId,
    staleTime: 3 * 60 * 1000, // 3 minutes
  })
}

export function useFeaturedProductsQuery(limit: number = 8) {
  return useQuery({
    queryKey: QUERY_KEYS.featuredProducts(limit),
    queryFn: () => productService.getFeaturedProducts(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes (featured products change less frequently)
  })
}

export function useBestSellingProductsQuery(limit: number = 8) {
  return useQuery({
    queryKey: QUERY_KEYS.bestSellingProducts(limit),
    queryFn: () => productService.getBestSellingProducts(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Categories hooks
export function useCategoriesQuery(withCount: boolean = false) {
  return useQuery({
    queryKey: withCount ? QUERY_KEYS.categoriesWithCount : QUERY_KEYS.categories,
    queryFn: () => categoryService.getAllCategories(withCount),
    staleTime: 30 * 60 * 1000, // 30 minutes (categories change rarely)
    gcTime: 60 * 60 * 1000, // 1 hour
  })
}

// Search hook
export function useProductSearchQuery(query: string, params?: {
  page?: number
  limit?: number
  category?: string
}) {
  return useQuery({
    queryKey: ['products', 'search', query, params],
    queryFn: () => productService.searchProducts(query, params),
    enabled: query.length >= 2, // Only search when query is at least 2 characters
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  })
}

// Mutation hooks for invalidating cache
export function useInvalidateProducts() {
  const queryClient = useQueryClient()
  
  return {
    invalidateAllProducts: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products })
    },
    invalidateProductById: (id: number) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.productById(id) })
    },
    invalidateProductsByCategory: (categoryId: number) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.productsByCategory(categoryId) })
    },
    invalidateCategories: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categoriesWithCount })
    },
    invalidateFeaturedProducts: () => {
      queryClient.invalidateQueries({ queryKey: ['products', 'featured'] })
    },
    invalidateBestSellingProducts: () => {
      queryClient.invalidateQueries({ queryKey: ['products', 'bestSelling'] })
    },
  }
}

// Prefetch hooks for better UX
export function usePrefetchProduct() {
  const queryClient = useQueryClient()
  
  return {
    prefetchProduct: (id: number) => {
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.productById(id),
        queryFn: () => productService.getProductById(id),
        staleTime: 10 * 60 * 1000,
      })
    },
    prefetchProductBySlug: (slug: string) => {
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.productBySlug(slug),
        queryFn: () => productService.getProductBySlug(slug),
        staleTime: 10 * 60 * 1000,
      })
    }
  }
}