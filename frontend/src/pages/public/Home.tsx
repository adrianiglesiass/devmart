import { Link } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div>
      <h1>Bienvenido a DevMart</h1>
      {isAuthenticated ? (
        <div>
          <p>Hola, {user?.username}!</p>
          <p>Email: {user?.email}</p>
          <button onClick={logout}>Logout</button>
          {user?.role === 'admin' && (
            <Link to="/admin">
              <button>Ir al Panel Admin</button>
            </Link>
          )}
        </div>
      ) : (
        <div>
          <p>Inicia sesión para acceder a más funcionalidades</p>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      )}
    </div>
  );
}
