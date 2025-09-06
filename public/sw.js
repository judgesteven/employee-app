const CACHE_NAME = 'employee-app-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
  '/favicon.ico'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for step tracking
self.addEventListener('sync', (event) => {
  if (event.tag === 'step-sync') {
    event.waitUntil(syncStepsInBackground());
  }
});

// Background step sync function
async function syncStepsInBackground() {
  try {
    console.log('🔄 Background step sync triggered');
    
    // Get step tracking state from IndexedDB or localStorage
    // This would sync steps to your backend API
    
    // For now, just log that background sync happened
    console.log('✅ Background step sync completed');
  } catch (error) {
    console.error('❌ Background step sync failed:', error);
  }
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'step-tracking') {
    event.waitUntil(syncStepsInBackground());
  }
});
