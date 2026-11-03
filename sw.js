// XIV Merch PWA shell cache. API-/Supabase-Daten werden NIE gecacht.
const CACHE='xiv-merch-shell-v2026-11-03-1';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('xiv-merch-shell-')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()]))});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 const url=new URL(req.url);
 if(!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
 if(req.mode==='navigate'){
   event.respondWith(fetch(req).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy)).catch(()=>{});}return response;}).catch(()=>caches.match('./index.html')));
   return;
 }
 if(/\.(?:png|webmanifest)$/.test(url.pathname))event.respondWith(caches.match(req).then(r=>r||fetch(req)));
});
