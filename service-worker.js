// Caches files so the app works offline after first visit

const CACHE = 'resqing-v12';
// Only cache our own files during install (safe, no CORS issues)

const FILES = [
  './',
  'index.html',
  'map.html',
  'offline.html',
  'manifest.json',
  'data/delhi-flood.geojson'
];

// INSTALL: pre-cache core files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      // Promise.allSettled means one failed file won't fail the whole install
      Promise.allSettled(FILES.map(url => cache.add(url)))
    )
  );
  self.skipWaiting();
});

// ACTIVATE: delete old cache versions
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// FETCH: cache first, then network. External resources get cached on first fetch.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Save successful responses to the cache for next time
        if (response.ok && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(event.request, clone));
        }
        return response;
      }).catch(() => caches.match('offline.html'));
    })
  );
});