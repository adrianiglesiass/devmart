import React, { createContext, useContext, useMemo } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getAccessToken } from '@/api/config/auth.interceptor';
import { authApi } from '@/api/services/auth.api';
import type { LoginRequest, RegisterRequest, User } from '@/api/types/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const ME_QUERY_KEY = ['me'];

  // Cargar usuario actual si hay token almacenado
  const hasToken = !!getAccessToken();
  const { data: me, isFetching: isFetchingUser } = useQuery<User>({
    queryKey: ME_QUERY_KEY,
    queryFn: authApi.getCurrentUser,
    enabled: hasToken,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 1;
    },
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      queryClient.setQueryData<User>(ME_QUERY_KEY, data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData<User>(ME_QUERY_KEY, data.user);
      }
    },
  });

  const login = async (credentials: LoginRequest) => {
    await loginMutation.mutateAsync(credentials);
  };

  const register = async (userData: RegisterRequest) => {
    await registerMutation.mutateAsync(userData);
  };

  const logout = () => {
    authApi.logout();
    queryClient.removeQueries({ queryKey: ME_QUERY_KEY });
  };

  const isLoading = isFetchingUser || loginMutation.isPending || registerMutation.isPending;

  const value = useMemo<AuthContextType>(
    () => ({
      user: me ?? null,
      isLoading,
      isAuthenticated: !!me,
      login,
      register,
      logout,
    }),
    [isLoading, me],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para acceder al contexto de autenticación.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
