'use client'

import { useEffect, useState } from 'react'
import { productService, categoryService } from '@/lib/productService'
import api from '@/lib/axios'

export default function DebugAPIPage() {
  const [debugInfo, setDebugInfo] = useState({
    apiBaseUrl: '',
    productsData: null,
    categoriesData: null,
    productsError: null,
    categoriesError: null,
    rawApiResponse: null
  })

  useEffect(() => {
    const debugAPI = async () => {
      // Kiểm tra base URL
      const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      console.log('🔍 API Base URL:', baseURL)
      
      setDebugInfo(prev => ({ ...prev, apiBaseUrl: baseURL }))

      try {
        // Test raw API call
        console.log('🔍 Testing raw API call...')
        const rawResponse = await api.get('/products')
        console.log('✅ Raw API Response:', rawResponse.data)
        
        setDebugInfo(prev => ({ 
          ...prev, 
          rawApiResponse: rawResponse.data 
        }))

        // Test ProductService
        console.log('🔍 Testing ProductService...')
        const products = await productService.getAllProducts()
        console.log('✅ Products from service:', products)
        
        setDebugInfo(prev => ({ 
          ...prev, 
          productsData: products 
        }))

      } catch (error) {
        console.error('❌ Products Error:', error)
        setDebugInfo(prev => ({ 
          ...prev, 
          productsError: error instanceof Error ? error.message : 'Unknown error'
        }))
      }

      try {
        // Test CategoryService
        console.log('🔍 Testing CategoryService...')
        const categories = await categoryService.getAllCategories()
        console.log('✅ Categories from service:', categories)
        
        setDebugInfo(prev => ({ 
          ...prev, 
          categoriesData: categories 
        }))

      } catch (error) {
        console.error('❌ Categories Error:', error)
        setDebugInfo(prev => ({ 
          ...prev, 
          categoriesError: error instanceof Error ? error.message : 'Unknown error'
        }))
      }
    }

    debugAPI()
  }, [])

  return (
    <div className="container mt-5">
      <h1>🔍 API Debug Information</h1>
      
      <div className="row">
        <div className="col-12">
          <div className="card mb-4">
            <div className="card-header">
              <h4>Configuration</h4>
            </div>
            <div className="card-body">
              <p><strong>API Base URL:</strong> {debugInfo.apiBaseUrl}</p>
              <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header">
              <h4>Raw API Response (/products)</h4>
            </div>
            <div className="card-body">
              {debugInfo.rawApiResponse ? (
                <pre className="bg-light p-3">
                  {JSON.stringify(debugInfo.rawApiResponse, null, 2)}
                </pre>
              ) : (
                <p className="text-muted">Loading...</p>
              )}
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header">
              <h4>Products Data</h4>
            </div>
            <div className="card-body">
              {debugInfo.productsError ? (
                <div className="alert alert-danger">
                  <strong>Error:</strong> {debugInfo.productsError}
                </div>
              ) : debugInfo.productsData ? (
                <div>
                  <p><strong>Count:</strong> {Array.isArray(debugInfo.productsData) ? debugInfo.productsData.length : 'Not an array'}</p>
                  <pre className="bg-light p-3" style={{maxHeight: 300, overflow: 'auto'}}>
                    {JSON.stringify(debugInfo.productsData, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-muted">Loading...</p>
              )}
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header">
              <h4>Categories Data</h4>
            </div>
            <div className="card-body">
              {debugInfo.categoriesError ? (
                <div className="alert alert-danger">
                  <strong>Error:</strong> {debugInfo.categoriesError}
                </div>
              ) : debugInfo.categoriesData ? (
                <div>
                  <p><strong>Count:</strong> {Array.isArray(debugInfo.categoriesData) ? debugInfo.categoriesData.length : 'Not an array'}</p>
                  <pre className="bg-light p-3" style={{maxHeight: 300, overflow: 'auto'}}>
                    {JSON.stringify(debugInfo.categoriesData, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-muted">Loading...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="alert alert-info">
        <strong>Instructions:</strong>
        <ol>
          <li>Check if API Base URL is correct</li>
          <li>Verify that your backend is running on the specified URL</li>
          <li>Check if the raw API response has the expected format</li>
          <li>Make sure CORS is properly configured on your backend</li>
        </ol>
      </div>
    </div>
  )
}
