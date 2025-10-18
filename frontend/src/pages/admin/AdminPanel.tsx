import { useAuth } from '@/context/AuthContext';

export default function AdminPanel() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Panel de Administación</h1>
      <p>Bienvenido, {user?.username}</p>
      <p>Aquí podrás gestionar productos,categorías y órdenes</p>
    </div>
  );
}
