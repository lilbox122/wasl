const CACHE_NAME='wasl-cache-v3';
const CORE=['/','/index.html','/styles.css','/app.js','/manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(CORE)))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))))});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.mode==='navigate'){e.respondWith(fetch(req).catch(()=>caches.match('/index.html')));return;}
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{const copy=res.clone();caches.open(CACHE_NAME).then(c=>c.put(req,copy));return res;})));
});
