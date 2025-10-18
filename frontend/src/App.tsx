import { useAuth } from './context/AuthContext';

function App() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>DevMart</h1>
      {isAuthenticated ? <p>Bienvenido, {user?.email}!</p> : <p>No autenticado</p>}
    </>
  );
}

export default App;
