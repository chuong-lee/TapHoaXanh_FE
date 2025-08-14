import { useState, useEffect, useCallback } from 'react'
import { productService, categoryService, Product, Category } from '@/lib/productService'

interface UseProductsOptions {
  autoFetch?: boolean
  initialPage?: number
  itemsPerPage?: number
  category?: string
  search?: string
}

interface UseProductsReturn {
  // Data
  products: Product[]
  allProducts: Product[]
  categories: Category[]
  featuredProducts: Product[]
  bestSellingProducts: Product[]
  
  // Pagination
  currentPage: number
  totalPages: number
  currentProducts: Product[]
  
  // Loading states
  loading: boolean
  categoriesLoading: boolean
  featuredLoading: boolean
  
  // Error states
  error: string | null
  
  // Actions
  fetchProducts: () => Promise<void>
  fetchCategories: () => Promise<void>
  fetchFeaturedProducts: (limit?: number) => Promise<void>
  fetchBestSellingProducts: (limit?: number) => Promise<void>
  searchProducts: (query: string) => Promise<void>
  filterByCategory: (categoryId: number) => Promise<void>
  setCurrentPage: (page: number) => void
  refetch: () => Promise<void>
}

export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const {
    autoFetch = true,
    initialPage = 1,
    itemsPerPage = 20,
    category,
    search
  } = options

  // State
  const [products, setProducts] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([])
  
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [loading, setLoading] = useState(false)
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [featuredLoading, setFeaturedLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Computed values
  const totalPages = Math.ceil(products.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = products.slice(startIndex, endIndex)

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await productService.getAllProducts({
        category,
        search,
        limit: 1000 // Lấy nhiều để có thể phân trang ở client
      })
      
      setAllProducts(data)
      setProducts(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi khi tải sản phẩm'
      setError(errorMessage)
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }, [category, search])

  // Fetch categories
  const fetchCategories = useCallback(async (withCount: boolean = true) => {
    try {
      setCategoriesLoading(true)
      const data = await categoryService.getAllCategories(withCount)
      setCategories(data)
    } catch (err) {
      console.error('Error fetching categories:', err)
    } finally {
      setCategoriesLoading(false)
    }
  }, [])

  // Fetch featured products
  const fetchFeaturedProducts = useCallback(async (limit: number = 8) => {
    try {
      setFeaturedLoading(true)
      const data = await productService.getFeaturedProducts(limit)
      setFeaturedProducts(data)
    } catch (err) {
      console.error('Error fetching featured products:', err)
    } finally {
      setFeaturedLoading(false)
    }
  }, [])

  // Fetch best selling products
  const fetchBestSellingProducts = useCallback(async (limit: number = 8) => {
    try {
      const data = await productService.getBestSellingProducts(limit)
      setBestSellingProducts(data)
    } catch (err) {
      console.error('Error fetching best selling products:', err)
    }
  }, [])

  // Search products
  const searchProducts = useCallback(async (query: string) => {
    try {
      setLoading(true)
      setError(null)
      
      if (!query.trim()) {
        setProducts(allProducts)
        return
      }
      
      const data = await productService.searchProducts(query)
      setProducts(data)
      setCurrentPage(1) // Reset to first page
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi khi tìm kiếm sản phẩm'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [allProducts])

  // Filter by category
  const filterByCategory = useCallback(async (categoryId: number) => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await productService.getProductsByCategory(categoryId)
      setProducts(data)
      setCurrentPage(1) // Reset to first page
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi khi lọc theo danh mục'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  // Refetch all data
  const refetch = useCallback(async () => {
    await Promise.all([
      fetchProducts(),
      fetchCategories(),
      fetchFeaturedProducts(),
      fetchBestSellingProducts()
    ])
  }, [fetchProducts, fetchCategories, fetchFeaturedProducts, fetchBestSellingProducts])

  // Auto fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchProducts()
      fetchCategories()
    }
  }, [autoFetch, fetchProducts, fetchCategories])

  return {
    // Data
    products,
    allProducts,
    categories,
    featuredProducts,
    bestSellingProducts,
    
    // Pagination
    currentPage,
    totalPages,
    currentProducts,
    
    // Loading states
    loading,
    categoriesLoading,
    featuredLoading,
    
    // Error states
    error,
    
    // Actions
    fetchProducts,
    fetchCategories,
    fetchFeaturedProducts,
    fetchBestSellingProducts,
    searchProducts,
    filterByCategory,
    setCurrentPage,
    refetch
  }
}

// Hook riêng cho single product
export function useProduct(id?: number, slug?: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProduct = useCallback(async () => {
    if (!id && !slug) return

    try {
      setLoading(true)
      setError(null)
      
      let data: Product | null = null
      
      if (slug) {
        data = await productService.getProductBySlug(slug)
      } else if (id) {
        data = await productService.getProductById(id)
      }
      
      setProduct(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi khi tải sản phẩm'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [id, slug])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  return {
    product,
    loading,
    error,
    refetch: fetchProduct
  }
}
