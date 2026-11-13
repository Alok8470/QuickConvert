/**
 * QuickConvert Service Worker
 * Enables offline functionality for client-side tools and local vendor libraries.
 */

const CACHE_NAME = 'quickconvert-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/contact.html',
  '/privacy-policy.html',
  '/terms.html',
  '/feedback.html',
  '/favicon.svg',
  '/css/styles.css',
  '/js/app.js',
  '/js/vendor/jspdf.umd.min.js',
  '/js/vendor/pdf-lib.min.js',
  '/js/vendor/pdf.min.js',
  '/js/vendor/pdf.worker.min.js',
  '/js/vendor/qrcode.min.js',
  '/tools/image-to-pdf.html',
  '/tools/image-compressor.html',
  '/tools/image-converter.html',
  '/tools/text-to-pdf.html',
  '/tools/merge-pdf.html',
  '/tools/split-pdf.html',
  '/tools/rotate-pdf.html',
  '/tools/watermark-pdf.html',
  '/tools/sign-pdf.html',
  '/tools/edit-pdf.html',
  '/tools/pdf-to-word.html',
  '/tools/word-to-pdf.html',
  '/tools/pdf-to-excel.html',
  '/tools/pdf-to-powerpoint.html',
  '/tools/qr-generator.html',
  '/tools/password-generator.html',
  '/tools/unit-converter.html',
  '/tools/json-formatter.html',
  '/tools/word-counter.html',
  '/tools/color-picker.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache assets gracefully (allow optional failures for CDN dependencies)
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
          const cached = await caches.match(req);
          if (cached) return cached;
          return caches.match('/index.html');
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
