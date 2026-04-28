const CACHE_NAME = 'escala-9132-v1';
const FILES = ['./', './index.html', './style.css', './script.js', './dados.js', './manifest.json', './icon.svg'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)));
});

self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(resp => resp || fetch(event.request)));
});
