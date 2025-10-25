import { Navigate, createBrowserRouter } from 'react-router-dom';

import AdminPanel from '@/pages/admin/AdminPanel';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Checkout from '@/pages/orders/Checkout';
import OrderDetail from '@/pages/orders/OrderDetail';
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
    path: '/register',
    element: <Register />,
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
    path: '/checkout',
    element: (
      <ProtectedRoute>
        <Checkout />
      </ProtectedRoute>
    ),
  },
  {
    path: '/orders/:id',
    element: (
      <ProtectedRoute>
        <OrderDetail />
      </ProtectedRoute>
    ),
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
