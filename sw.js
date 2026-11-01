const CACHE = 'xiv-merch-pwa-v1';
const CORE = ['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
const LIBS = [
 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js',
 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js'
];
self.addEventListener('install', event => {
 event.waitUntil(caches.open(CACHE).then(async cache => {
   await cache.addAll(CORE);
   await Promise.allSettled(LIBS.map(url => cache.add(url)));
 }).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event => {
 event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k.startsWith('xiv-merch-pwa-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event => {
 const req=event.request;
 if(req.method!=='GET') return;
 const url=new URL(req.url);
 if(url.origin===self.location.origin){
   event.respondWith(fetch(req).then(response=>{
     if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(req,copy));}
     return response;
   }).catch(()=>caches.match(req).then(r=>r|| (req.mode==='navigate'?caches.match('./index.html'):Response.error()))));
 } else if(LIBS.includes(url.href)) {
   event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(response=>{
     if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(req,copy));}
     return response;
   })));
 }
});
