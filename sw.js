const CACHE_NAME = 'Chana-Portfolio';
const cacheURL = [
    '/',
    '/views/about.html',
    '/stylesheet/style.css',
    '/assets/projects/amsterdam-metro/demo.webm',
    '/assets/projects/crypto-wallet/demo.webm',
    '/assets/projects/cryptowatcher/demo.webm',
    '/assets/projects/shopping-list/demo.webm',
    
]

/*
Inside of our install callback, we need to take the following steps:
    Open a cache.
    Cache our files.
    Confirm whether all the required assets are cached or not.
*/
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function (cache) {
            return cache.addAll(cacheURL)
        })
    )
})

self.addEventListener('activate', function (event) {
    const cacheWhiteList = CACHE_NAME;

    event.waitUntil(
        caches.keys()
        .then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
})

self.addEventListener('fetch', function (event) {

    const request = event.request;

    // event.respondWith(fromCache(event.request));


    if(request.method = "GET"){

        event.respondWith(
            fetch(request).catch(function(err) {
                console.log(`failed`, err)
                fromCache(event.request)
            })
        )

    }

})

function fromCache(request) {
    return caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(request).then(function (matching) {
            return matching || Promise.reject('no-match');
        });
    });
}
