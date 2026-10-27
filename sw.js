// KEBBEK service worker: the app opens offline after the first visit.
// Pages are network-first (updates arrive immediately when online); libraries and fonts are cached after first use.
const V='kebbek-4.1';
const SHELL=['./','index.html','three.min.js','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png','privacy.html','terms.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('kebbek-')&&k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const LIB=/^https:\/\/(cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)\//;
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.origin===location.origin){e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))));return}
  if(LIB.test(r.url)){e.respondWith(caches.open(V).then(c=>c.match(r).then(m=>{const net=fetch(r).then(res=>{if(res.ok||res.type==='opaque')c.put(r,res.clone());return res}).catch(()=>m);return m||net})))}});
