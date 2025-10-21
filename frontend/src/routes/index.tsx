import { Navigate, createBrowserRouter } from 'react-router-dom';

import AdminPanel from '@/pages/admin/AdminPanel';
import Login from '@/pages/auth/Login';
import Home from '@/pages/public/Home';
import ProductDetail from '@/pages/public/ProductDetail';
import Products from '@/pages/public/Products';

import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/products',
    element: <Products />,
  },
  {
    path: '/products/:id',
    element: <ProductDetail />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin>
        <AdminPanel />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: (
      <Navigate
        to="/"
        replace
      />
    ),
  },
]);
