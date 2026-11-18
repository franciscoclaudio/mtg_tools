const CACHE_NAME = 'mtg-tools-pwa-v17'; // Atualize o número a cada deploy
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './styles/app_mobile.css',
  './manifest.json',
  './metagame_decks_by_format.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // JSON de metagame: network-first (permite atualizar o arquivo)
  if (url.pathname.endsWith('metagame_decks_by_format.json')) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Outros arquivos: cache-first com fallback para rede
  e.respondWith(
    caches.match(e.request).then((c) => {
      if (c) return c;
      return fetch(e.request).then((res) => {
        // Opcional: cachear novos arquivos dinamicamente
        return res;
      });
    })
  );
});