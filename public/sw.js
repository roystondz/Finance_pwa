let cacheData = "appV5";

this.addEventListener("install",(event)=>{
    event.waitUntil(
        caches.open(cacheData).then((cache)=>{
            cache.addAll([
                '/static/js/bundle.js',
                '/static/js/main.chunk.js',
                '/static/js/0.chunk.js',
                '/index.html',
                '/',
            ])
        })
    )
})

// this.addEventListener("fetch",(event)=>{
//     if(!navigator.onLine){
//         event.respondWith(
//             caches.match(event.request).then((res)=>{
//                 if(res){
//                     return res;
//                 }
//                 let requestUrl = event.request.clone();
//                 fetch(requestUrl);
//             })
//         )
//     }
// })

this.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // ✅ Serve from cache if available
          return cachedResponse;
        }
        // ✅ Otherwise try network
        return fetch(event.request)
          .then((networkResponse) => {
            // Cache new network response for next time
            return caches.open(cacheData).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
          .catch(() => {
            // ✅ If offline and request is for HTML, show fallback
            if (event.request.headers.get("accept").includes("text/html")) {
              return caches.match("/index.html");
            }
          });
      })
    );
  });

this.addEventListener("activate", (event) => {
    event.waitUntil(
      caches.keys().then((keys) =>
        Promise.all(keys.map((key) => {
          if (key !== cacheData) {
            return caches.delete(key);
          }
        }))
      )
    );
  });
  

