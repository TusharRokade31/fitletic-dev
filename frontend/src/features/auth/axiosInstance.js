import axios from 'axios';
import Cookies from 'js-cookie';
import { logout } from './authSlice'; // Adjust this path if necessary

let store;

export const injectStore = (_store) => {
  store = _store;
};

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  // withCredentials: true // Uncomment this if your refresh token is sent via HTTP-only cookies
});

// --- Request Interceptor ---
axiosInstance.interceptors.request.use(
  (config) => {
    // Grab the latest token from Redux state (or Cookies)
    const token = store?.getState()?.auth?.accessToken || Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Refresh Token Logic Variables ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- Response Interceptor ---
axiosInstance.interceptors.response.use(
  (response) => response, // If the request succeeds, just return the response
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Prevent an infinite loop if the refresh endpoint itself fails with a 401
      if (originalRequest.url.includes('/auth/refresh')) {
        store?.dispatch(logout());
        return Promise.reject(error);
      }

      // If a refresh is already in progress, put this request in a queue to wait
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axiosInstance(originalRequest); // Retry with the new token
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Assume you have an endpoint that triggers `rotateRefreshToken`
        // If your refresh token is in js-cookie/Redux, pass it in the body.
        // If it's an HTTP-only cookie, just use { withCredentials: true }
        const refreshToken = Cookies.get('refreshToken'); // Adjust based on where you store it
        
        const { data } = await axios.post('http://localhost:5000/api/auth/refresh', {
          token: refreshToken 
        });

        const newAccessToken = data.data.accessToken;
        
        // Update the cookie so future requests get it immediately
        Cookies.set('accessToken', newAccessToken, { expires: 7 });
        
        // Optionally update the new refresh token if your backend rotates it
        if (data.data.refreshToken) {
            Cookies.set('refreshToken', data.data.refreshToken, { expires: 7 });
        }

        // You may also want to dispatch an action to update Redux here if needed
        // store.dispatch(updateTokens({ accessToken: newAccessToken }));

        // Resolve all queued requests with the new token
        processQueue(null, newAccessToken);

        // Retry the original failed request
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        // If the refresh token is invalid/expired, the user MUST log in again
        processQueue(refreshError, null);
        
        store?.dispatch(logout());
        
        // Fallback hard redirect if the React Router Navigate isn't catching it immediately
        if (window.location.pathname !== '/auth') {
           window.location.href = '/auth'; 
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Return any other errors (400, 404, 500) normally
    return Promise.reject(error);
  }
);

export default axiosInstance;