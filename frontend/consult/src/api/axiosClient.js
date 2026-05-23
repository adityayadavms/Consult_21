import axios from "axios";


import {queueRequest ,setRequestExecutor} from "../utils/networkRecovery";


/*
=====================================
CLEAR AUTH DATA
=====================================
*/

function clearAuthData() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

/*
=====================================
SAFE RETRY METHODS
=====================================
*/

const SAFE_METHODS = ["get"];


/*
=====================================
CHECK IF REQUEST CAN BE QUEUED
=====================================
*/

function shouldQueueRequest(error) {

    const request = error.config;

    if (!request) return false;

    /*
    ===============================
    ONLY NETWORK ERRORS
    ===============================
    */

    if (error.response) {
        return false;
    }

    /*
    ===============================
    BROWSER IS OFFLINE
    ===============================
    */

    if (navigator.onLine) {
        return false;
    }

    /*
    ===============================
    ALLOW SAFE METHODS ONLY
    ===============================
    */

    const method =
        request.method?.toLowerCase();

    return SAFE_METHODS.includes(method);

}

/*
=====================================
MAIN AXIOS INSTANCE
=====================================
*/

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

/*
=====================================
REFRESH CLIENT (NO INTERCEPTORS)
=====================================
*/

const refreshClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

/*
=====================================
REFRESH CONTROL VARIABLES
=====================================
*/

let isRefreshing = false;
let refreshSubscribers = [];

/*
=====================================
QUEUE HELPERS
=====================================
*/

function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback);
}

function onRefreshed(newToken) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

/*
=====================================
REQUEST INTERCEPTOR
Attach access token
=====================================
*/

axiosClient.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

  },
  (error) => Promise.reject(error)
);

/*
=====================================
RESPONSE INTERCEPTOR
Handles:
1. Access token expiration
2. Refresh token rotation
3. Multiple request queue
=====================================
*/

axiosClient.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config || {};

    /*
    ===============================
    NETWORK RECOVERY
    ===============================
    */

    if (shouldQueueRequest(error)) {

        queueRequest({

            url: originalRequest.url,

            method: originalRequest.method,

            data: originalRequest.data,

            headers: originalRequest.headers

        });

        console.log(
            "Request queued for retry:",
            originalRequest.url
        );

        return Promise.reject({

            ...error,

            message:
            "No internet connection. Request queued."

        });

    }

    /*
    ===============================
    HANDLE BLACKLISTED TOKEN
    ===============================
    */

    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "Token blacklisted"
    ) {

      clearAuthData();

      return Promise.reject(error);
    }

    /*
    ===============================
    ONLY HANDLE AUTH ERRORS
    ===============================
    */

    const isAuthError =
      error.response?.status === 401;

    if (!isAuthError) {
      return Promise.reject(error);
    }

    /*
    ===============================
    PREVENT INFINITE LOOP
    ===============================
    */

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    /*
    ===============================
    GET REFRESH TOKEN
    ===============================
    */

    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {

      clearAuthData();

      return Promise.reject(error);
    }

    /*
    ===============================
    IF REFRESH ALREADY RUNNING
    ===============================
    */

    if (isRefreshing) {

      return new Promise((resolve) => {

        subscribeTokenRefresh((newToken) => {

          originalRequest.headers.Authorization =
            `Bearer ${newToken}`;

          resolve(axiosClient(originalRequest));

        });

      });

    }

    /*
    ===============================
    START REFRESH PROCESS
    ===============================
    */

    originalRequest._retry = true;
    isRefreshing = true;

    try {

      const response = await refreshClient.post(
        "/auth/refresh",
        { refreshToken }
      );

      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      } = response.data.data;

      /*
      ===============================
      STORE ROTATED TOKENS
      ===============================
      */

      localStorage.setItem(
        "accessToken",
        newAccessToken
      );

      localStorage.setItem(
        "refreshToken",
        newRefreshToken
      );

      /*
      ===============================
      RELEASE QUEUED REQUESTS
      ===============================
      */

      onRefreshed(newAccessToken);

      /*
      ===============================
      RETRY ORIGINAL REQUEST
      ===============================
      */

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return axiosClient(originalRequest);

    }

    catch (refreshError) {

      /*
      ===============================
      REFRESH FAILED
      ===============================
      */

      clearAuthData();

      return Promise.reject(refreshError);

    }

    finally {

      isRefreshing = false;

    }

  }
  
);
/*
=====================================
REGISTER AXIOS EXECUTOR
=====================================
*/

setRequestExecutor(axiosClient);


export default axiosClient;
export { refreshClient };