/* Klinavi Service Worker: lädt die App einmal und hält sie danach offline bereit.
   043a674889 wird beim Build durch einen Hash der Seite ersetzt, so wird bei jeder neuen Version der Cache erneuert. */
const V = 'klinavi-043a674889';
const CORE = ['./', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
const EXTERN = /(^|\.)(fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com)$/;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith('klinavi-') && k !== V).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

const keep = res => res && (res.ok || res.type === 'opaque');
async function swr(req) {
  const c = await caches.open(V), hit = await c.match(req);
  const net = fetch(req).then(res => { if (keep(res)) c.put(req, res.clone()); return res; }).catch(() => null);
  return hit || (await net) || Response.error();
}
async function page(req) {
  const c = await caches.open(V);
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 3500);
  try {
    const res = await fetch(req, { signal: ctl.signal });
    clearTimeout(timer);
    if (keep(res)) c.put('./', res.clone());
    return res;
  } catch (_) {
    clearTimeout(timer);
    return (await c.match('./')) || Response.error();
  }
}
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (r.mode === 'navigate') return e.respondWith(page(r));
  if (u.origin === location.origin || EXTERN.test(u.hostname)) e.respondWith(swr(r));
});
