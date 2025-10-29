import type { InternalAxiosRequestConfig } from 'axios';

import axiosInstance from './axios';

export const setAccessToken = (token?: string) => {
  if (token) {
    localStorage.setItem('access_token', token);
  } else {
    localStorage.removeItem('access_token');
  }
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem('access_token');
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // No redirigir a login si ya estamos en login o register
    const isAuthRoute =
      error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');

    if (error.response?.status === 401 && error.config.method !== 'get' && !isAuthRoute) {
      setAccessToken();
      window.location.href = '/login';
    }

    if (error.response?.status === 500) {
      console.error('Server error', error.response.data);
    }

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An error occurred';
    error.message = errorMessage;

    return Promise.reject(error);
  },
);
