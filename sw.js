const CACHE_NAME = 'moms-companion-v1';
const ASSETS = ['/', '/index.html', '/style.css', '/app.js', '/voice.js', '/ai.js', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('/index.html')))
  );
});