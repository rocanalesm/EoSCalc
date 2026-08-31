/* Service Worker — EOS Calc
   Cachea los archivos para uso offline.
*/
const CACHE = 'eos-calc-v1.2';   // sigue el numero de version de la app
const ASSETS = [
  './',
  './index.html',
  './eos-i18n.js',
  './eos-engine.js',
  './eos-formulas.js',
  './eos-psat.js',
  './eos-ui.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './step_logo.png',
  './katex/katex.min.css',
  './katex/katex.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached =>
      cached || fetch(event.request).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(event.request, copy)).catch(()=>{});
        return resp;
      }).catch(() => cached)
    )
  );
});
