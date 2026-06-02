const CACHE_NAME = 'vehicle-sos-cache-v2';
const urlsToCache = [
  './',
  './index.html',
  './index.css',
  './app.js',
  './js/router.js',
  './js/store.js',
  './js/views/onboarding.js',
  './js/views/dashboard.js',
  './js/views/emergency.js',
  './js/views/nav.js',
  './icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
