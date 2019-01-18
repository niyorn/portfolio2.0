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
            console.log(`[service worker] Caching files ${cacheURL}`)

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
                        console.log(`remove cache from: ${cacheName}`)
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
})

self.addEventListener('fetch', function (event) {
    console.log('The service worker is serving the asset.');
    event.respondWith(fromCache(event.request));
    event.waitUntil(update(event.request));

})

function fromCache(request) {

    return caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(request).then(function (matching) {
            return matching || Promise.reject('no-match');
        });
    });
}

function update(request) {
    return caches.open(CACHE_NAME).then(function (cache) {
        return fetch(request).then(function (response) {
            return cache.put(request, response);
        });
    });
}