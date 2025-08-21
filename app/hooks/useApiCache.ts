'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import api from '@/lib/axios'

// Cache interface
interface CacheEntry<T> {
  data: T
  timestamp: number
  expiry: number
}

// Cache storage
class ApiCache {
  private cache = new Map<string, CacheEntry<unknown>>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    const expiry = ttl || this.defaultTTL
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + expiry
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() > entry.expiry) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Get cache info for debugging
  getInfo(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }

  // Clean expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key)
      }
    }
  }

  // Get cache entries (for internal use)
  getEntries(): Map<string, CacheEntry<unknown>> {
    return this.cache
  }
}

// Global cache instance
export const apiCache = new ApiCache()

// Cleanup expired entries every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    apiCache.cleanup()
  }, 5 * 60 * 1000)
}

// Hook for API calls with caching
interface UseApiOptions {
  ttl?: number // Cache TTL in milliseconds
  enabled?: boolean // Whether to fetch immediately
  refetchOnWindowFocus?: boolean
  refetchInterval?: number
  onSuccess?: (data: unknown) => void
  onError?: (error: Error) => void
}

export function useApi<T>(
  endpoint: string,
  options: UseApiOptions = {}
) {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes default
    enabled = true,
    refetchOnWindowFocus = false,
    refetchInterval,
    onSuccess,
    onError
  } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const cacheKey = `api_${endpoint}`

  const fetchData = useCallback(async (force = false) => {
    // Check cache first
    if (!force) {
      const cachedData = apiCache.get<T>(cacheKey)
      if (cachedData) {
        setData(cachedData)
        setError(null)
        onSuccess?.(cachedData)
        return cachedData
      }
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()

    setLoading(true)
    setError(null)

    try {
      const response = await api.get(endpoint)
      
      const result = response.data as T
      
      // Cache the result
      apiCache.set(cacheKey, result, ttl)
      
      setData(result)
      onSuccess?.(result)
      return result
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err)
        onError?.(err)
        throw err
      }
    } finally {
      setLoading(false)
    }
  }, [endpoint, cacheKey, ttl, onSuccess, onError])

  const refetch = useCallback(() => {
    return fetchData(true)
  }, [fetchData])

  const mutate = useCallback((newData: T | ((prevData: T | null) => T)) => {
    const updatedData = typeof newData === 'function' 
      ? (newData as (prevData: T | null) => T)(data)
      : newData
    
    setData(updatedData)
    apiCache.set(cacheKey, updatedData, ttl)
  }, [data, cacheKey, ttl])

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchData()
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [enabled, fetchData])

  // Refetch interval
  useEffect(() => {
    if (refetchInterval && enabled) {
      intervalRef.current = setInterval(() => {
        fetchData(true)
      }, refetchInterval)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [refetchInterval, enabled, fetchData])

  // Refetch on window focus
  useEffect(() => {
    if (refetchOnWindowFocus && enabled) {
      const handleFocus = () => {
        // Only refetch if data is older than 1 minute
        const cachedEntry = apiCache.getEntries().get(cacheKey)
        const shouldRefetch = !cachedEntry || 
          (Date.now() - cachedEntry.timestamp > 60 * 1000)
        
        if (shouldRefetch) {
          fetchData(true)
        }
      }

      window.addEventListener('focus', handleFocus)
      return () => window.removeEventListener('focus', handleFocus)
    }
  }, [refetchOnWindowFocus, enabled, fetchData, cacheKey])

  return {
    data,
    loading,
    error,
    refetch,
    mutate
  }
}

// Hook for mutations (POST, PUT, DELETE)
export function useMutation<TData = unknown, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    onSuccess?: (data: TData, variables: TVariables) => void
    onError?: (error: Error, variables: TVariables) => void
    onSettled?: (data: TData | undefined, error: Error | null, variables: TVariables) => void
    invalidateKeys?: string[] // Cache keys to invalidate after success
  } = {}
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const mutate = useCallback(async (variables: TVariables) => {
    setLoading(true)
    setError(null)

    try {
      const data = await mutationFn(variables)
      
      // Invalidate specified cache keys
      if (options.invalidateKeys) {
        options.invalidateKeys.forEach(key => {
          apiCache.delete(`api_${key}`)
        })
      }

      options.onSuccess?.(data, variables)
      options.onSettled?.(data, null, variables)
      
      return data
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      options.onError?.(error, variables)
      options.onSettled?.(undefined, error, variables)
      throw error
    } finally {
      setLoading(false)
    }
  }, [mutationFn, options])

  return {
    mutate,
    loading,
    error
  }
}

// Query key factory for consistent cache keys
export const queryKeys = {
  products: {
    all: 'products',
    byCategory: (category: string) => `products/category/${category}`,
    byId: (id: number) => `products/${id}`,
    search: (query: string) => `products/search?q=${query}`
  },
  categories: {
    all: 'categories'
  },
  orders: {
    all: 'orders',
    byId: (id: number) => `orders/${id}`
  },
  user: {
    profile: 'user/profile',
    cart: 'user/cart'
  }
} as const

// Prefetch utility
export const prefetchQuery = async <T>(endpoint: string, ttl?: number): Promise<T | null> => {
  const cacheKey = `api_${endpoint}`
  
  // Return cached data if available
  const cachedData = apiCache.get<T>(cacheKey)
  if (cachedData) {
    return cachedData
  }

  try {
    const response = await api.get(endpoint)
    const data = response.data as T
    
    // Cache the prefetched data
    apiCache.set(cacheKey, data, ttl)
    
    return data
  } catch (error) {
    console.error('Prefetch failed:', error)
    return null
  }
}

// React Query-like invalidation
export const invalidateQueries = (pattern: string | RegExp) => {
  const keysToDelete: string[] = []
  
  for (const key of apiCache.getEntries().keys()) {
    const match = typeof pattern === 'string' 
      ? key.includes(`api_${pattern}`)
      : pattern.test(key)
    
    if (match) {
      keysToDelete.push(key)
    }
  }

  keysToDelete.forEach(key => apiCache.delete(key.replace('api_', '')))
}
