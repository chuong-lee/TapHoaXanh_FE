'use client'

import { useEffect, useState } from 'react'
import { usePWA, useServiceWorker, usePushNotifications } from '@/hooks/usePWA'

// Install App Banner Component
const InstallBanner = () => {
  const { isInstallable, installApp } = usePWA()
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Show banner after 30 seconds if app is installable
    if (isInstallable) {
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 30000)

      return () => clearTimeout(timer)
    }
  }, [isInstallable])

  if (!isInstallable || !showBanner) return null

  const handleInstall = async () => {
    const success = await installApp()
    if (success) {
      setShowBanner(false)
    }
  }

  return (
    <div 
      className="position-fixed bottom-0 start-0 end-0 bg-primary text-white p-3 shadow-lg"
      style={{ zIndex: 1050 }}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-8">
            <div className="d-flex align-items-center">
              <i className="fas fa-mobile-alt me-3" style={{ fontSize: '1.5rem' }}></i>
              <div>
                <h6 className="mb-1">Cài đặt ứng dụng Tạp Hóa Xanh</h6>
                <small className="opacity-75">
                  Trải nghiệm mua sắm nhanh chóng và tiện lợi hơn
                </small>
              </div>
            </div>
          </div>
          <div className="col-md-4 text-end">
            <button 
              className="btn btn-light btn-sm me-2"
              onClick={handleInstall}
            >
              <i className="fas fa-download me-1"></i>
              Cài đặt
            </button>
            <button 
              className="btn btn-outline-light btn-sm"
              onClick={() => setShowBanner(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Update Available Banner Component
const UpdateBanner = () => {
  const { hasUpdate, updateApp } = useServiceWorker()

  if (!hasUpdate) return null

  return (
    <div 
      className="position-fixed top-0 start-0 end-0 bg-info text-white p-2 shadow"
      style={{ zIndex: 1060 }}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-8">
            <div className="d-flex align-items-center">
              <i className="fas fa-sync-alt me-2"></i>
              <small>
                <strong>Phiên bản mới có sẵn!</strong> Cập nhật để có trải nghiệm tốt nhất.
              </small>
            </div>
          </div>
          <div className="col-md-4 text-end">
            <button 
              className="btn btn-light btn-sm"
              onClick={updateApp}
            >
              <i className="fas fa-redo me-1"></i>
              Cập nhật ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Online/Offline Status Component
const OnlineStatus = () => {
  const { isOnline } = usePWA()
  const [showOffline, setShowOffline] = useState(false)

  useEffect(() => {
    if (!isOnline) {
      setShowOffline(true)
    } else {
      // Hide offline banner after 3 seconds when back online
      const timer = setTimeout(() => {
        setShowOffline(false)
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [isOnline])

  if (!showOffline && isOnline) return null

  return (
    <div 
      className={`position-fixed top-0 start-0 end-0 p-2 shadow ${
        isOnline ? 'bg-success' : 'bg-warning'
      } text-white`}
      style={{ zIndex: 1055 }}
    >
      <div className="container">
        <div className="text-center">
          <small>
            <i className={`fas ${isOnline ? 'fa-wifi' : 'fa-wifi-slash'} me-2`}></i>
            {isOnline ? 'Đã kết nối Internet' : 'Không có kết nối Internet'}
          </small>
        </div>
      </div>
    </div>
  )
}

// Push Notification Permission Component
const NotificationPermission = () => {
  const { isSupported, permission, requestPermission, subscribe } = usePushNotifications()
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Show notification prompt after 1 minute if supported and not granted
    if (isSupported && permission === 'default') {
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 60000)

      return () => clearTimeout(timer)
    }
  }, [isSupported, permission])

  if (!isSupported || permission !== 'default' || !showPrompt) return null

  const handleEnableNotifications = async () => {
    const granted = await requestPermission()
    if (granted) {
      // You would get this VAPID key from your backend
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_KEY
      if (vapidKey) {
        await subscribe(vapidKey)
      }
    }
    setShowPrompt(false)
  }

  return (
    <div 
      className="position-fixed bottom-0 end-0 m-3 bg-white border rounded shadow-lg p-3"
      style={{ zIndex: 1050, maxWidth: '350px' }}
    >
      <div className="d-flex align-items-start">
        <div className="flex-shrink-0 me-3">
          <i className="fas fa-bell text-primary" style={{ fontSize: '1.5rem' }}></i>
        </div>
        <div className="flex-grow-1">
          <h6 className="mb-1">Nhận thông báo</h6>
          <p className="small text-muted mb-3">
            Cho phép thông báo để nhận cập nhật về đơn hàng và khuyến mãi mới.
          </p>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-primary btn-sm"
              onClick={handleEnableNotifications}
            >
              Cho phép
            </button>
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setShowPrompt(false)}
            >
              Để sau
            </button>
          </div>
        </div>
        <button 
          className="btn-close btn-close-sm ms-2"
          onClick={() => setShowPrompt(false)}
          aria-label="Close"
        ></button>
      </div>
    </div>
  )
}

// Main PWA Components Container
const PWAComponents = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      <InstallBanner />
      <UpdateBanner />
      <OnlineStatus />
      <NotificationPermission />
    </>
  )
}

export default PWAComponents
