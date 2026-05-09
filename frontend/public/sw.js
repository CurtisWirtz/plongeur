// public/sw.js
// This is a minimal service worker required for PWA installability.
self.addEventListener('fetch', (event) => {
  // We just let the request go through to the network like normal
  event.respondWith(fetch(event.request));
});