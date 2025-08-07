// Service Worker for PWA features
const CACHE_NAME = 'taphoa-xanh-v1'
const OFFLINE_URL = '/offline'

// Files to cache for offline support
const STATIC_CACHE_URLS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

// API endpoints to cache
const API_CACHE_URLS = [
  '/api/products',
  '/api/categories'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        // Take control of all clients
        return self.clients.claim()
      })
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome extension requests
  if (url.protocol === 'chrome-extension:') {
    return
  }

  // Handle API requests with Network First strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request))
    return
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          // Return offline page if network fails
          return caches.match(OFFLINE_URL)
        })
    )
    return
  }

  // Handle static assets with Cache First strategy
  if (request.destination === 'image' || 
      request.destination === 'style' || 
      request.destination === 'script') {
    event.respondWith(cacheFirst(request))
    return
  }

  // Default: try network first, fallback to cache
  event.respondWith(networkFirst(request))
})

// Network First strategy - for dynamic content
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request)
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Network failed, trying cache:', error)
    
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline fallback for navigation requests
    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_URL)
    }
    
    throw error
  }
}

// Cache First strategy - for static assets
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Failed to fetch:', request.url, error)
    throw error
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event.tag)
  
  if (event.tag === 'background-sync-cart') {
    event.waitUntil(syncCart())
  }
  
  if (event.tag === 'background-sync-orders') {
    event.waitUntil(syncOrders())
  }
})

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push message received:', event)
  
  let notificationData = {}
  
  try {
    notificationData = event.data ? event.data.json() : {}
  } catch (error) {
    console.error('Error parsing push data:', error)
  }
  
  const title = notificationData.title || 'Tạp Hóa Xanh'
  const options = {
    body: notificationData.body || 'Bạn có thông báo mới',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    image: notificationData.image,
    data: notificationData.data || {},
    actions: [
      {
        action: 'view',
        title: 'Xem',
        icon: '/icons/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'Bỏ qua',
        icon: '/icons/action-dismiss.png'
      }
    ],
    requireInteraction: notificationData.requireInteraction || false,
    silent: false,
    vibrate: [200, 100, 200]
  }
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click:', event)
  
  event.notification.close()
  
  const action = event.action
  const data = event.notification.data || {}
  
  let url = '/'
  
  if (action === 'view' && data.url) {
    url = data.url
  } else if (data.url) {
    url = data.url
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // Check if there's already a window/tab open
        for (const client of clientList) {
          if (client.url.includes(url) && 'focus' in client) {
            return client.focus()
          }
        }
        
        // Open new window/tab
        if (clients.openWindow) {
          return clients.openWindow(url)
        }
      })
  )
})

// Helper functions for background sync
async function syncCart() {
  try {
    // Get pending cart updates from IndexedDB
    // This would sync with your backend
    console.log('Syncing cart data...')
    
    // Implementation depends on your offline storage strategy
    
  } catch (error) {
    console.error('Cart sync failed:', error)
    throw error
  }
}

async function syncOrders() {
  try {
    // Get pending orders from IndexedDB
    // This would sync with your backend
    console.log('Syncing order data...')
    
    // Implementation depends on your offline storage strategy
    
  } catch (error) {
    console.error('Order sync failed:', error)
    throw error
  }
}

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME })
  }
})
