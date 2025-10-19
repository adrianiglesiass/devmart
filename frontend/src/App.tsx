import { Navigate, Route, Routes } from 'react-router-dom';

import AdminPanel from '@/pages/admin/AdminPanel';
import Login from '@/pages/auth/Login';
import Home from '@/pages/public/Home';
import { ProtectedRoute } from '@/routes/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route
        path="/"
        element={<Home />}
      />
      <Route
        path="/login"
        element={<Login />}
      />

      {/*Requiere autenticación) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminPanel />
          </ProtectedRoute>
        }
      />

      {/* Ruta 404 */}
      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;
