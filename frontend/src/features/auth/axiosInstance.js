import axios from 'axios';

// We import the store lazily to avoid circular dependency issues
// (store imports slices, slices would import store)
let store;

export const injectStore = (_store) => {
  store = _store;
};

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor — attaches Bearer token on every request automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store?.getState()?.auth?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;