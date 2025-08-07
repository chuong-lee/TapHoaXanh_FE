'use client'

import React from 'react'

interface TestResult {
  status: number | string
  success: boolean
  data?: unknown
  error?: string
  timestamp: string
}

interface TestResults {
  [key: string]: TestResult
}

export default function APITestPage() {
  const [results, setResults] = React.useState<TestResults>({})
  const [loading, setLoading] = React.useState(false)

  const testAPI = async (endpoint: string, name: string) => {
    try {
      setLoading(true)
      const response = await fetch(endpoint)
      const data = await response.json()
      
      setResults((prev) => ({
        ...prev,
        [name]: {
          status: response.status,
          success: response.ok,
          data: data,
          timestamp: new Date().toISOString()
        }
      }))
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [name]: {
          status: 'error',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      }))
    } finally {
      setLoading(false)
    }
  }

  const runAllTests = async () => {
    setResults({})
    await testAPI('/api/test', 'Basic API Test')
    await testAPI('/api/test-db', 'Database Test')
    await testAPI('/api/categories', 'Categories API')
    await testAPI('/api/products', 'Products API')
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center mb-4">🔍 API Test Dashboard</h1>
          
          <div className="text-center mb-4">
            <button 
              className="btn btn-primary btn-lg"
              onClick={runAllTests}
              disabled={loading}
            >
              {loading ? '🔄 Testing...' : '🚀 Run All Tests'}
            </button>
          </div>

          <div className="row">
            {Object.entries(results).map(([name, result]) => (
              <div key={name} className="col-12 col-lg-6 mb-3">
                <div className={`card h-100 border-${result.success ? 'success' : 'danger'}`}>
                  <div className="card-header">
                    <h5 className="card-title mb-0">
                      {result.success ? '✅' : '❌'} {name}
                    </h5>
                    <small className="text-muted">Status: {result.status}</small>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <strong>Response:</strong>
                      <pre className="bg-light p-2 rounded mt-1 small" style={{maxHeight: '200px', overflow: 'auto'}}>
                        {JSON.stringify(result.data || result.error, null, 2)}
                      </pre>
                    </div>
                    <small className="text-muted">
                      Tested at: {new Date(result.timestamp).toLocaleString()}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {Object.keys(results).length === 0 && (
            <div className="text-center text-muted mt-5">
              <p>Click Run All Tests to start testing your APIs</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
