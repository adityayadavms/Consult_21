/*
=====================================
NETWORK RECOVERY CONFIG
=====================================
*/

const MAX_QUEUE_SIZE = 50;

const MAX_RETRIES = 3;

const REQUEST_TTL = 5 * 60 * 1000; // 5 mins


/*
=====================================
FAILED REQUEST QUEUE
=====================================
*/

let requestQueue = [];

let requestExecutor = null;


/*
=====================================
REGISTER REQUEST EXECUTOR
=====================================
*/

export function setRequestExecutor(executor) {

    requestExecutor = executor;

}

/*
=====================================
GENERATE UNIQUE REQUEST KEY
Prevents duplicates
=====================================
*/

function generateRequestKey(request) {

    return `${request.method}:${request.url}:${JSON.stringify(request.data || {})}`;

}


/*
=====================================
REMOVE EXPIRED REQUESTS
=====================================
*/

function removeExpiredRequests() {

    const now = Date.now();

    requestQueue = requestQueue.filter(

        request =>
            (now - request.timestamp) < REQUEST_TTL

    );

}


/*
=====================================
QUEUE REQUEST
=====================================
*/

export function queueRequest(request) {

    removeExpiredRequests();

    const requestKey = generateRequestKey(request);

    /*
    ===============================
    PREVENT DUPLICATES
    ===============================
    */

    const alreadyExists = requestQueue.some(

        req => generateRequestKey(req) === requestKey

    );

    if (alreadyExists) {

        console.log(
            "Duplicate request ignored:",
            request.url
        );

        return;

    }

    /*
    ===============================
    LIMIT QUEUE SIZE
    ===============================
    */

    if (requestQueue.length >= MAX_QUEUE_SIZE) {

        requestQueue.shift();

    }

    /*
    ===============================
    STORE REQUEST
    ===============================
    */

    requestQueue.push({

        id: crypto.randomUUID(),

        url: request.url,

        method: request.method,

        data: request.data,

        headers: request.headers,

        timestamp: Date.now(),

        retryCount: 0

    });

    console.log(
        "Queued request:",
        request.url
    );

}


/*
=====================================
GET QUEUED REQUESTS
=====================================
*/

export function getQueuedRequests() {

    removeExpiredRequests();

    return requestQueue;

}


/*
=====================================
CLEAR QUEUE
=====================================
*/

export function clearQueue() {

    requestQueue = [];

}


/*
=====================================
REMOVE SPECIFIC REQUEST
=====================================
*/

export function removeRequest(requestId) {

    requestQueue = requestQueue.filter(

        request => request.id !== requestId

    );

}


/*
=====================================
INCREMENT RETRY COUNT
=====================================
*/

export function incrementRetry(requestId) {

    requestQueue = requestQueue.map(

        request => {

            if (request.id === requestId) {

                return {

                    ...request,

                    retryCount:
                        request.retryCount + 1

                };

            }

            return request;

        }

    );

}


/*
=====================================
GET RETRIABLE REQUESTS
=====================================
*/

export function getRetriableRequests() {

    removeExpiredRequests();

    return requestQueue.filter(

        request =>
            request.retryCount < MAX_RETRIES

    );

}

/*
=====================================
RETRY QUEUED REQUESTS
=====================================
*/

export async function retryQueuedRequests() {

    removeExpiredRequests();

    const requests = getRetriableRequests();

    console.log(
        `Retrying ${requests.length} queued requests`
    );

    for (const request of requests) {

        try {

            if (!requestExecutor) {
                throw new Error(
                    "Request executor not registered"
                );
            }

            await requestExecutor({

                url: request.url,

                method: request.method,

                data: request.data,

                headers: request.headers

            });

            /*
            ===============================
            SUCCESS
            REMOVE FROM QUEUE
            ===============================
            */

            removeRequest(request.id);

            console.log(
                "Request succeeded:",
                request.url
            );

        }

        catch (error) {

            /*
            ===============================
            FAILED AGAIN
            ===============================
            */

            incrementRetry(
                request.id
            );

            console.log(
                "Retry failed:",
                request.url
            );

        }

    }

}