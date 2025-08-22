'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isFullScreen = window.matchMedia('(display-mode: fullscreen)').matches
      const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches
      
      setIsInstalled(isStandalone || isFullScreen || isMinimalUI)
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)
      setIsInstallable(true)
    }

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    // Initial checks
    checkInstalled()
    setIsOnline(navigator.onLine)

    // Event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const installApp = async () => {
    if (!deferredPrompt) return false

    try {
      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        setIsInstallable(false)
        setDeferredPrompt(null)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error installing app:', error)
      return false
    }
  }

  return {
    isInstallable,
    isInstalled,
    isOnline,
    installApp
  }
}

// Service Worker registration hook
export const useServiceWorker = () => {
  const [isSupported, setIsSupported] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [hasUpdate, setHasUpdate] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    const registerSW = async () => {
      if ('serviceWorker' in navigator) {
        setIsSupported(true)

        try {
          const reg = await navigator.serviceWorker.register('/sw.js')
          setRegistration(reg)
          setIsRegistered(true)

          // Check for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setHasUpdate(true)
                }
              })
            }
          })

          // Listen for messages from SW
          navigator.serviceWorker.addEventListener('message', (event) => {
            console.log('Message from SW:', event.data)
          })

        } catch (error) {
          console.error('SW registration failed:', error)
        }
      }
    }

    registerSW()
  }, [])

  const updateApp = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  }

  const unregister = async () => {
    if (registration) {
      const result = await registration.unregister()
      if (result) {
        setIsRegistered(false)
        setRegistration(null)
      }
      return result
    }
    return false
  }

  return {
    isSupported,
    isRegistered,
    hasUpdate,
    updateApp,
    unregister,
    registration
  }
}

// Push notification hook
export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)

  useEffect(() => {
    const checkSupport = () => {
      const supported = 'serviceWorker' in navigator && 
                       'PushManager' in window && 
                       'Notification' in window
      setIsSupported(supported)
      
      if (supported) {
        setPermission(Notification.permission)
      }
    }

    checkSupport()
  }, [])

  const requestPermission = async () => {
    if (!isSupported) return false

    try {
      const permission = await Notification.requestPermission()
      setPermission(permission)
      return permission === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  const subscribe = async (vapidPublicKey: string) => {
    if (!isSupported || permission !== 'granted') return null

    try {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
      })

      setSubscription(sub)
      return sub
    } catch (error) {
      console.error('Error subscribing to push notifications:', error)
      return null
    }
  }

  const unsubscribe = async () => {
    if (subscription) {
      try {
        const result = await subscription.unsubscribe()
        if (result) {
          setSubscription(null)
        }
        return result
      } catch (error) {
        console.error('Error unsubscribing from push notifications:', error)
        return false
      }
    }
    return false
  }

  return {
    isSupported,
    permission,
    subscription,
    requestPermission,
    subscribe,
    unsubscribe
  }
}
