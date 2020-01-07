// Install a service worker
self.addEventListener('install',  function(event){
  console.log("SW installed")
   event.waitUntil(
     caches.open('E-COM-Cache')
      .then(function(cache) {
        console.log('Opened cache');
        cache.addAll([
            '/',
            '/cart',
            '/details',
            '../src/app.js',
            '../src/app.css',
            '../src/index.js',
            '../src/index.css'
        ]);
      }));
});

// Cache and return requests
self.addEventListener('fetch', function(event){
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {        
        if (response) {       
          //console.log("returning response")
          return response;
        }
        //return fetch(event.request);
        else{
          return fetch(event.request)     //fetch from internet
            .then(function(res) {
              return caches.open('E-COM-Cache')
                .then(function(cache) {
                  cache.put(event.request.url, res.clone());    //save the response for future
                  return res;   // return the fetched data
                })
            })
            .catch(function(err) {       // fallback mechanism
              return caches.open(CACHE_CONTAINING_ERROR_MESSAGES)
                .then(function(cache) {
                  console.log("offline hai")
                });
            });
        }
      }
    )
  );
});

// Update a service worker
self.addEventListener('activate',function(){
  console.log("SW Activated");
});