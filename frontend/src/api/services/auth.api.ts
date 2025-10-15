import { setAccessToken } from '../config/auth.interceptor';
import axiosInstance from '../config/axios';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

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
    const { data } = await axiosInstance.get<User>('/auth/me');
    return data;
  },

  logout(): void {
    setAccessToken();
  },
};
