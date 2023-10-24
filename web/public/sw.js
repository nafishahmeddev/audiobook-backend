
const IDBdb_NAME = "haaki-database";
const IDB_CHAPTER_STORE_NAME = "chapter-files";
let db;
function createConnection() {
    if (db) return db;
    const request = indexedDB.open(IDBdb_NAME, 1);
    request.onerror = function (event) {
        console.error("Database error: " + event.target.errorCode);
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        console.log("Database opened successfully");
    };


    request.onupgradeneeded = function (event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains(IDB_CHAPTER_STORE_NAME)) {
            objectStore = db.createObjectStore(IDB_CHAPTER_STORE_NAME, { keyPath: "id" });
        }
    };
}


self.addEventListener('install', function (event) {
    console.log("Service worker has been installed...");
    createConnection();
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("Service worker has been activated...");
    createConnection();
    self.skipWaiting()
})


function deleteFileIfExists(id) {
    return new Promise(resolve => {
        const store = db.transaction([IDB_CHAPTER_STORE_NAME], "readwrite").objectStore(IDB_CHAPTER_STORE_NAME);
        const request = store.delete(id)
        request.onsuccess = function (event) {
            resolve(true)
        }
        request.onerror = function (event) {
            resolve(false);
        }
    })
}

function handleSaveChapterFile(_event) {
    return new Promise(async (resolve, reject) => {
        const req = _event.request.clone();
        const url = new URL(req.url);
        const query = url.searchParams;
        const id = query.get("id");

        deleteFileIfExists(id).then(async (isDeleted) => {
            console.log("File deleted :: ", isDeleted);
            const file = {
                id: id,
                payload: await req.blob()
            }

            const store = db.transaction([IDB_CHAPTER_STORE_NAME], "readwrite").objectStore(IDB_CHAPTER_STORE_NAME);
            const request = store.add(file)

            request.onsuccess = function (event) {
                console.log("File saved successfully");
                resolve(
                    new Response(JSON.stringify({
                        message: "OK"
                    }), {
                        status: 200,
                        statusText: "OK",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                );
            };

            request.onerror = function (event) {
                console.error("Error saving file: " + event.target.errorCode);
                resolve(
                    new Response(JSON.stringify({
                        message: "Something went wrong",
                        error: event.target.errorCode
                    }), {
                        status: 500,
                        statusText: "INTERNAL ERROR",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                );
            };
        })
    })
}

function handleServeFile(_event) {
    return new Promise(async (resolve) => {
        const req = _event.request;
        const url = new URL(req.url);
        const query = url.searchParams;
        const id = query.get("id");

        const store = db.transaction([IDB_CHAPTER_STORE_NAME], "readonly").objectStore(IDB_CHAPTER_STORE_NAME);
        const request = store.get(id);

        request.onsuccess = function (event) {
            const file = event.target.result;
            console.log("Got the file");
            if (file) {
                return resolve(
                    new Response(file.payload), {
                    status: 200,
                    statusText: "OK",
                })
            } else {
                return resolve(
                    new Response("Page not found", {
                        status: 404,
                        statusText: "NOT_FOUND",
                    })
                );
            }
        };

        req.onerror = function (event) {
            return resolve(
                new Response("Page not found", {
                    status: 404,
                    statusText: "NOT_FOUND",
                })
            );
        };
    })

}

function handleDeleteFile(_event) {
    return new Promise(async (resolve) => {
        const req = _event.request;
        const url = new URL(req.url);
        const query = url.searchParams;
        const id = query.get("id");

        const store = db.transaction([IDB_CHAPTER_STORE_NAME], "readwrite").objectStore(IDB_CHAPTER_STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = function (event) {
            return resolve(
                new Response("Successfully deleted"), {
                status: 200,
                statusText: "OK",
            })
        };

        req.onerror = function (event) {
            return resolve(
                new Response("Page not found", {
                    status: 404,
                    statusText: "NOT_FOUND",
                })
            );
        };
    })
}

self.addEventListener('fetch', function (event) {
    if (new URL(event.request.url).pathname == "/persist/save") {
        event.respondWith(handleSaveChapterFile(event));
    } else if (new URL(event.request.url).pathname == "/persist/get") {
        event.respondWith(handleServeFile(event));
    } else if (new URL(event.request.url).pathname == "/persist/delete") {
        event.respondWith(handleDeleteFile(event));
    } else {
        return;
    }

});