const CACHE = 'resqing-v20';
const FILES = [
  './', 'index.html', 'map.html', 'offline.html', 'manifest.json',
  'icons/icon-192.png', 'icons/icon-512.png',
  'data/delhi-flood.geojson', 'data/regions.json', 'data/slope-risk.json',
  'data/himachal.geojson', 'data/kerala.geojson', 'data/uttarakhand.geojson',
  'data/delhi.json'
];

self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(FILES.map(u => c.add(u)))).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(cached => {
    if (cached) return cached;
    return fetch(e.request).then(res => {
      if (res.ok) { const c = res.clone(); caches.open(CACHE).then(cc => cc.put(e.request, c)); }
      return res;
    }).catch(() => caches.match('offline.html'));
  }));
});