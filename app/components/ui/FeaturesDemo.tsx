'use client'

import React, { useState } from 'react'
import ErrorBoundary, { useErrorHandler } from './ErrorBoundary'
import { 
  ProductListSkeleton, 
  LoadingSpinner, 
  LoadingButton,
  ProfileSkeleton 
} from './LoadingSkeleton'
import { useApi, useMutation } from '@/hooks/useApiCache'
import { usePWA, useServiceWorker, usePushNotifications } from '@/hooks/usePWA'

// Demo component for testing Error Boundary
const ErrorProneComponent: React.FC = () => {
  const [shouldError, setShouldError] = useState(false)
  const { handleError } = useErrorHandler()

  if (shouldError) {
    throw new Error('This is a test error from ErrorProneComponent!')
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5>Error Boundary Demo</h5>
      </div>
      <div className="card-body">
        <p>This component tests error boundary functionality.</p>
        <button 
          className="btn btn-danger me-2"
          onClick={() => setShouldError(true)}
        >
          Trigger Component Error
        </button>
        <button 
          className="btn btn-warning"
          onClick={() => handleError(new Error('Manual error using useErrorHandler hook'))}
        >
          Trigger Hook Error
        </button>
      </div>
    </div>
  )
}

// Demo component for Loading States
const LoadingStatesDemo: React.FC = () => {
  const [showSkeleton, setShowSkeleton] = useState(false)
  const [loading, setLoading] = useState(false)

  const simulateLoading = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5>Loading States & Skeleton UI Demo</h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <button 
            className="btn btn-primary me-2"
            onClick={() => setShowSkeleton(!showSkeleton)}
          >
            Toggle Product Skeleton
          </button>
          <LoadingButton
            loading={loading}
            loadingText="Loading..."
            onClick={simulateLoading}
            className="me-2"
          >
            Test Loading Button
          </LoadingButton>
        </div>
        
        {loading && <LoadingSpinner text="Processing..." />}
        
        {showSkeleton && (
          <div className="mt-3">
            <h6>Product List Skeleton:</h6>
            <ProductListSkeleton count={4} />
            
            <h6 className="mt-4">Profile Skeleton:</h6>
            <ProfileSkeleton />
          </div>
        )}
      </div>
    </div>
  )
}

// Demo component for API Caching
const APICachingDemo: React.FC = () => {
  const { data: products, loading, error, refetch } = useApi<any[]>('/products', {
    ttl: 300000, // 5 minutes
    refetchOnWindowFocus: true,
    onSuccess: (data) => console.log('Products loaded:', data?.length),
    onError: (error) => console.error('Error loading products:', error)
  })

  const { mutate: createProduct, loading: creating } = useMutation(
    async (productData: any) => {
      // Simulate API call
      return new Promise(resolve => 
        setTimeout(() => resolve({ id: Date.now(), ...productData }), 1000)
      )
    },
    {
      onSuccess: (data) => console.log('Product created:', data),
      invalidateKeys: ['products'] // Invalidate products cache
    }
  )

  const handleCreateProduct = () => {
    createProduct({ 
      name: 'Test Product', 
      price: 100, 
      category: 'Electronics' 
    })
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5>API Caching Demo</h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <button 
            className="btn btn-info me-2"
            onClick={() => refetch()}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refetch Products'}
          </button>
          <LoadingButton
            loading={creating}
            loadingText="Creating..."
            onClick={handleCreateProduct}
          >
            Create Product
          </LoadingButton>
        </div>
        
        {error && (
          <div className="alert alert-danger">
            Error: {error.message}
          </div>
        )}
        
        {loading ? (
          <LoadingSpinner text="Loading products..." />
        ) : (
          <div className="alert alert-info">
            {products ? `Loaded ${products.length} products` : 'No products loaded'}
          </div>
        )}
      </div>
    </div>
  )
}

// Demo component for PWA Features
const PWAFeaturesDemo: React.FC = () => {
  const { isInstallable, isInstalled, isOnline, installApp } = usePWA()
  const { isSupported: swSupported, isRegistered, hasUpdate, updateApp } = useServiceWorker()
  const { 
    isSupported: pushSupported, 
    permission, 
    requestPermission, 
    subscribe 
  } = usePushNotifications()

  const handleInstall = async () => {
    const success = await installApp()
    console.log('App installation:', success ? 'successful' : 'failed')
  }

  const handleRequestNotifications = async () => {
    const granted = await requestPermission()
    if (granted) {
      // In a real app, you'd get this from your backend
      const vapidKey = 'your-vapid-key-here'
      await subscribe(vapidKey)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5>PWA Features Demo</h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <h6>Installation Status</h6>
            <ul className="list-unstyled">
              <li>
                <i className={`fas ${isOnline ? 'fa-wifi text-success' : 'fa-wifi-slash text-danger'}`}></i>
                {isOnline ? ' Online' : ' Offline'}
              </li>
              <li>
                <i className={`fas ${isInstalled ? 'fa-check text-success' : 'fa-times text-muted'}`}></i>
                {isInstalled ? ' App Installed' : ' Not Installed'}
              </li>
              <li>
                <i className={`fas ${isInstallable ? 'fa-download text-info' : 'fa-times text-muted'}`}></i>
                {isInstallable ? ' Can Install' : ' Cannot Install'}
              </li>
            </ul>
            
            {isInstallable && (
              <button className="btn btn-primary mb-2" onClick={handleInstall}>
                <i className="fas fa-download me-2"></i>
                Install App
              </button>
            )}
          </div>
          
          <div className="col-md-6">
            <h6>Service Worker</h6>
            <ul className="list-unstyled">
              <li>
                <i className={`fas ${swSupported ? 'fa-check text-success' : 'fa-times text-danger'}`}></i>
                {swSupported ? ' Supported' : ' Not Supported'}
              </li>
              <li>
                <i className={`fas ${isRegistered ? 'fa-check text-success' : 'fa-times text-muted'}`}></i>
                {isRegistered ? ' Registered' : ' Not Registered'}
              </li>
              <li>
                <i className={`fas ${hasUpdate ? 'fa-sync text-warning' : 'fa-check text-success'}`}></i>
                {hasUpdate ? ' Update Available' : ' Up to Date'}
              </li>
            </ul>
            
            {hasUpdate && (
              <button className="btn btn-warning mb-2" onClick={updateApp}>
                <i className="fas fa-sync me-2"></i>
                Update App
              </button>
            )}
          </div>
        </div>
        
        <div className="mt-3">
          <h6>Push Notifications</h6>
          <ul className="list-unstyled">
            <li>
              <i className={`fas ${pushSupported ? 'fa-check text-success' : 'fa-times text-danger'}`}></i>
              {pushSupported ? ' Supported' : ' Not Supported'}
            </li>
            <li>
              <i className={`fas fa-bell ${permission === 'granted' ? 'text-success' : permission === 'denied' ? 'text-danger' : 'text-warning'}`}></i>
              Permission: {permission}
            </li>
          </ul>
          
          {pushSupported && permission === 'default' && (
            <button className="btn btn-info" onClick={handleRequestNotifications}>
              <i className="fas fa-bell me-2"></i>
              Enable Notifications
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Main Demo Component
const FeaturesDemo: React.FC = () => {
  return (
    <div className="container my-5">
      <h2 className="text-center mb-5">🚀 Enhanced Features Demo</h2>
      
      <div className="row g-4">
        <div className="col-md-6">
          <ErrorBoundary>
            <ErrorProneComponent />
          </ErrorBoundary>
        </div>
        
        <div className="col-md-6">
          <LoadingStatesDemo />
        </div>
        
        <div className="col-md-6">
          <APICachingDemo />
        </div>
        
        <div className="col-md-6">
          <PWAFeaturesDemo />
        </div>
      </div>
      
      <div className="text-center mt-5">
        <div className="alert alert-success">
          <h5 className="alert-heading">
            <i className="fas fa-check-circle me-2"></i>
            All Features Implemented!
          </h5>
          <p className="mb-0">
            Error Boundary • Loading States • API Caching • PWA Features • Route Protection
          </p>
        </div>
      </div>
    </div>
  )
}

export default FeaturesDemo
