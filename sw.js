const CACHE_NAME = 'bymarka-v5';
const PRECACHE = ['/', '/index.html', '/hyen.html', '/admin.html', '/manifest.json', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(PRECACHE)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(r => { 
        if(r.ok){ const c=r.clone(); caches.open(CACHE_NAME).then(ca=>ca.put(e.request,c)); }
        return r;
      })
      .catch(() => caches.match(e.request))
  );
});
