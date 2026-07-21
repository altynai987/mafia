const CACHE_NAME = 'mafia-cache-v2';
const urlsToCache = [
  '/mafia/',
  '/mafia/index.html',
  '/mafia/register.html',
  '/mafia/reviews.html',
  '/mafia/css/style.css',
  '/mafia/images/icon-192.png',
  '/mafia/images/icon-512.png',
  '/mafia/images/banner.jpg',
  '/mafia/images/table.jpg'
];

self.addEventListener('install', function(event) {
  console.log('🟢 Установка Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('📂 Кеш открыт');
        return cache.addAll(urlsToCache);
      })
      .then(function() {
        console.log('✅ Все файлы закешированы!');
      })
      .catch(function(error) {
        console.log('❌ Ошибка кеширования:', error);
      })
  );
});

self.addEventListener('activate', function(event) {
  console.log('🟡 Активация Service Worker...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Удаляю старый кеш:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          console.log('📦 Из кеша:', event.request.url);
          return response;
        }
        console.log('🌐 Из сети:', event.request.url);
        return fetch(event.request);
      })
  );
});
