/**
 * QuickConvert Service Worker
 * Enables offline functionality for client-side tools and local vendor libraries.
 */

const CACHE_NAME = 'quickconvert-v2';

const STATIC_ASSETS = [
  '/',
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms',
  '/feedback',
  '/favicon.svg',
  '/css/styles.css',
  '/js/app.js',
  '/js/vendor/jspdf.umd.min.js',
  '/js/vendor/pdf-lib.min.js',
  '/js/vendor/pdf.min.js',
  '/js/vendor/pdf.worker.min.js',
  '/js/vendor/qrcode.min.js',
  '/tools/image-to-pdf',
  '/tools/image-compressor',
  '/tools/image-converter',
  '/tools/text-to-pdf',
  '/tools/merge-pdf',
  '/tools/split-pdf',
  '/tools/rotate-pdf',
  '/tools/watermark-pdf',
  '/tools/sign-pdf',
  '/tools/edit-pdf',
  '/tools/pdf-to-word',
  '/tools/word-to-pdf',
  '/tools/pdf-to-excel',
  '/tools/pdf-to-powerpoint',
  '/tools/qr-generator',
  '/tools/password-generator',
  '/tools/unit-converter',
  '/tools/json-formatter',
  '/tools/word-counter',
  '/tools/color-picker'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        STATIC_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`[ServiceWorker] Could not pre-cache: ${url}`, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  
  // Only intercept GET requests
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Skip tracking / analytics / form endpoints from caching
  if (
    url.hostname.includes('google-analytics') ||
    url.hostname.includes('googletagmanager') ||
    url.hostname.includes('formspree.io') ||
    url.hostname.includes('doubleclick')
  ) {
    return;
  }

  // Network-First with Cache Fallback for HTML documents
  if (req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes.status === 200) {
            const copy = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return networkRes;
        })
        .catch(async () => {
          // Try direct match
          const cached = await caches.match(req);
          if (cached) return cached;
          
          // Try clean URL equivalent or .html equivalent
          const pathname = url.pathname;
          const cleanPath = pathname.replace(/\.html$/, '');
          const htmlPath = cleanPath + '.html';
          
          const matchClean = await caches.match(cleanPath);
          if (matchClean) return matchClean;
          
          const matchHtml = await caches.match(htmlPath);
          if (matchHtml) return matchHtml;

          return caches.match('/');
        })
    );
    return;
  }

  // Cache-First with Network Fallback for Scripts, Styles, Images & Fonts
  event.respondWith(
    caches.match(req).then((cachedRes) => {
      if (cachedRes) {
        return cachedRes;
      }
      return fetch(req).then((networkRes) => {
        if (networkRes.status === 200) {
          const copy = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return networkRes;
      }).catch(() => {
        // Silent catch for offline missing non-essential assets
      });
    })
  );
});
