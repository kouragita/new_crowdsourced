// service-worker.js
const CACHE_NAME = 'crowdsourced-v1.0.0';
const API_CACHE_NAME = 'crowdsourced-api-v1.0.0';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  // Add other static assets
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/leaderboard',
  '/api/users',
  '/api/roles',
  '/api/learning_paths',
  '/api/modules',
  '/api/courses'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        // Force activation
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        // Take control of all pages
        return self.clients.claim();
      })
      .catch((error) => {
        console.error('Service Worker: Activation failed', error);
      })
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle API requests
  if (url.origin === 'https://e-learn-ncux.onrender.com' || url.pathname.startsWith('/api/')) {
    event.respondWith(handleAPIRequest(request));
    return;
  }
  
  // Handle static assets
  if (url.origin === self.location.origin) {
    event.respondWith(handleStaticRequest(request));
    return;
  }
  
  // For other requests, just fetch normally
  event.respondWith(fetch(request));
});

// Handle API requests with cache-first strategy for better performance
async function handleAPIRequest(request) {
  const url = new URL(request.url);
  const cacheName = API_CACHE_NAME;
  
  try {
    // For critical endpoints, try cache first
    const criticalEndpoints = ['/api/leaderboard', '/api/users', '/api/roles'];
    const isCritical = criticalEndpoints.some(endpoint => url.pathname.includes(endpoint));
    
    if (isCritical) {
      // Cache-first strategy for critical data
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        // Serve from cache and update in background
        updateCacheInBackground(request, cacheName);
        return cachedResponse;
      }
    }
    
    // Network-first strategy for non-critical or uncached data
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache', error);
    
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If cache also fails, return offline page or error response
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'Unable to fetch data. Please check your connection.' 
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle static requests with cache-first strategy
async function handleStaticRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.log('Service Worker: Failed to fetch static asset', error);
    
    // For navigation requests, return cached index.html
    if (request.mode === 'navigate') {
      const cachedIndex = await caches.match('/index.html');
      if (cachedIndex) {
        return cachedIndex;
      }
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Update cache in background
async function updateCacheInBackground(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    console.log('Service Worker: Background update failed', error);
  }
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: 'You have new updates!',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    vibrate: [200, 100, 200],
    tag: 'crowdsourced-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/pwa-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/pwa-192x192.png'
      }
    ]
  };
  
  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.title = data.title || 'CrowdSourced';
  }
  
  event.waitUntil(
    self.registration.showNotification('CrowdSourced', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle background sync
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered');
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Background sync function
async function doBackgroundSync() {
  try {
    // Sync any pending data when connection is restored
    console.log('Service Worker: Performing background sync');
    
    // You can add logic here to sync offline data
    // For example, sync form submissions, user progress, etc.
    
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }).then(() => {
        event.ports[0].postMessage({ success: true });
      }).catch((error) => {
        event.ports[0].postMessage({ success: false, error: error.message });
      })
    );
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(doPeriodicSync());
  }
});

async function doPeriodicSync() {
  try {
    console.log('Service Worker: Performing periodic sync');
    
    // Update cache with fresh data
    const criticalEndpoints = [
      'https://e-learn-ncux.onrender.com/api/leaderboard',
      'https://e-learn-ncux.onrender.com/api/learning_paths'
    ];
    
    for (const endpoint of criticalEndpoints) {
      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          const cache = await caches.open(API_CACHE_NAME);
          cache.put(endpoint, response.clone());
        }
      } catch (error) {
        console.log('Service Worker: Failed to sync', endpoint, error);
      }
    }
    
  } catch (error) {
    console.error('Service Worker: Periodic sync failed', error);
  }
}

// Error handling
self.addEventListener('error', (event) => {
  console.error('Service Worker: Error occurred', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker: Unhandled promise rejection', event.reason);
});

console.log('Service Worker: Script loaded');