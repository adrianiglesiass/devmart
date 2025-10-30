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
    // Silenciar errores esperados de verificación de autenticación
    const isAuthMeEndpoint = error.config?.url?.includes('/auth/me');
    const isUnauthorizedOrNotFound =
      error.response?.status === 401 || error.response?.status === 404;

    // No redirigir a login si ya estamos en login o register
    const isAuthRoute =
      error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');

    if (error.response?.status === 401 && error.config.method !== 'get' && !isAuthRoute) {
      setAccessToken();
      window.location.href = '/login';
    }

    // Solo mostrar errores 500 en consola (errores de servidor)
    if (error.response?.status === 500) {
      console.error('Server error', error.response.data);
    }

    // Si es el endpoint /auth/me con 401 o 404, es esperado cuando no hay usuario autenticado
    // No necesitamos hacer nada especial, solo pasar el error
    if (isAuthMeEndpoint && isUnauthorizedOrNotFound) {
      return Promise.reject(error);
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
