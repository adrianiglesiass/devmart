import { setAccessToken } from '../config/auth.interceptor';
import axiosInstance from '../config/axios';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/types';

export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
    setAccessToken(data.access_token);
    return data;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/register', userData);
    if (data.access_token) {
      setAccessToken(data.access_token);
    }
    return data;
  },

  async getCurrentUser(): Promise<User> {
    try {
      const { data } = await axiosInstance.get<User>('/auth/me');
      return data;
    } catch (error: any) {
      // Silenciar errores esperados cuando no hay autenticación
      if (error?.response?.status === 401 || error?.response?.status === 404) {
        // Re-throw sin log para que React Query lo maneje
        throw error;
      }
      // Para otros errores, sí mostrar en consola
      console.error('Error al obtener usuario actual:', error);
      throw error;
    }
  },

  logout(): void {
    setAccessToken();
  },
};
