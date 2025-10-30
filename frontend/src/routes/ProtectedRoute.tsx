import { Navigate } from 'react-router-dom';

import { useAuth } from '@/api/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (requireAdmin && user?.role !== 'admin') {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <>{children}</>;
};
