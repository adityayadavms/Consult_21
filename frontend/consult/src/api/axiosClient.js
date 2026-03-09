import axios from "axios";

/*
=====================================
AXIOS INSTANCE
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
Attach access token automatically
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
    const originalRequest = error.config;

    /*
    ===============================
    IF NOT 401 → NORMAL ERROR
    ===============================
    */

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    /*
    ===============================
    GET REFRESH TOKEN
    ===============================
    */

    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    /*
    ===============================
    IF REFRESH ALREADY RUNNING
    Queue the request
    ===============================
    */

    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
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
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/refresh",
        { refreshToken }
      );

      const newAccessToken = response.data.accessToken;
      const newRefreshToken = response.data.refreshToken;

      /*
      ===============================
      STORE ROTATED TOKENS
      ===============================
      */

      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

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

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return axiosClient(originalRequest);

    } catch (refreshError) {

      /*
      ===============================
      REFRESH FAILED → LOGOUT
      ===============================
      */

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      window.location.href = "/login";

      return Promise.reject(refreshError);

    } finally {

      /*
      ===============================
      RESET REFRESH FLAG
      ===============================
      */

      isRefreshing = false;
    }
  }
);

export default axiosClient;