import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * Resolves the API Base URL based on environment variables and runtime mode.
 * - In local development: defaults to 'http://localhost:5000/api' if VITE_API_URL is unset.
 * - In production: expects VITE_API_URL to be supplied by the hosting environment.
 *   If missing in production, logs a clear diagnostic error and falls back to relative '/api'
 *   rather than silently failing against localhost.
 * - Always normalizes the URL to guarantee clean '/api' routing without duplicate path segments.
 */
const resolveApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL?.trim();

  if (envUrl) {
    const sanitized = envUrl.replace(/\/+$/, '');
    return sanitized.endsWith('/api') ? sanitized : `${sanitized}/api`;
  }

  if (import.meta.env.PROD) {
    console.error(
      '[MediCore Configuration Error]: VITE_API_URL environment variable is not defined in production. ' +
      'Please configure VITE_API_URL in your hosting provider settings (e.g. https://api.yourdomain.com/api).'
    );
    return '/api';
  }

  return 'http://localhost:5000/api';
};

const API_BASE_URL = resolveApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('medicore_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling & session expiration
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // Clear auth state on unauthorized/expired token
        localStorage.removeItem('medicore_token');
        localStorage.removeItem('medicore_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
