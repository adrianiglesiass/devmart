import { Link } from 'react-router-dom';

import { useOrders } from '@/api/hooks/useOrders';
import { BackButton } from '@/components/common/BackButton';
import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MyOrders() {
  const { data: orders, isLoading, error } = useOrders();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Cargando pedidos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">Error al cargar pedidos</p>
            <Button onClick={() => window.location.reload()}>Reintentar</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <BackButton
          to="/"
          text="Volver al inicio"
        />
        <h1 className="text-4xl font-bold mb-2 leading-relaxed">Mis Pedidos</h1>
        <p className="text-gray-600">Revisa el historial de tus compras</p>
      </div>

      {orders && orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="shadow-md"
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
                  <Badge
                    variant={
                      order.status === 'delivered'
                        ? 'default'
                        : order.status === 'cancelled'
                          ? 'destructive'
                          : 'secondary'
                    }
                  >
                    {order.status === 'pending' && 'Pendiente'}
                    {order.status === 'processing' && 'Procesando'}
                    {order.status === 'shipped' && 'Enviado'}
                    {order.status === 'delivered' && 'Entregado'}
                    {order.status === 'cancelled' && 'Cancelado'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  Fecha: {new Date(order.created_at || '').toLocaleDateString('es-ES')}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      {order.items?.length} producto{order.items?.length !== 1 ? 's' : ''}
                    </p>
                    <p className="text-lg font-semibold">Total: ${order.total?.toFixed(2)}</p>
                  </div>
                  <Link
                    to={`/orders/${order.id}`}
                    className="interactive-link"
                  >
                    <Button variant="outline">Ver Detalles</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-4">No tienes pedidos aún</p>
          <Link
            to="/products"
            className="interactive-link"
          >
            <Button>Explorar Productos</Button>
          </Link>
        </div>
      )}
    </Layout>
  );
}
