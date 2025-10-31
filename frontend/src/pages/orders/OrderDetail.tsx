import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Loader2,
  Package,
  XCircle,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useOrder } from '@/api/hooks/useOrders';
import { DemoBanner } from '@/components/common/DemoBanner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const statusConfig = {
  pending: {
    label: 'Pendiente',
    icon: Clock,
    color: 'text-yellow-600',
    bg: 'bg-yellow-100',
  },
  processing: {
    label: 'En Proceso',
    icon: Package,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
  },
  completed: {
    label: 'Completado',
    icon: CheckCircle2,
    color: 'text-green-600',
    bg: 'bg-green-100',
  },
  cancelled: {
    label: 'Cancelado',
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-100',
  },
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useOrder(id ? Number(id) : undefined);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando detalles del pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'No se pudo cargar el pedido'}
            </AlertDescription>
          </Alert>
          <Button
            className="mt-4"
            onClick={() => navigate('/orders')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a pedidos
          </Button>
        </div>
      </div>
    );
  }

  const status = order.status || 'pending';
  const statusInfo = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = statusInfo.icon;

  const totalAmount =
    order.items?.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">¡Pedido de Demostración Confirmado!</AlertTitle>
          <AlertDescription className="text-green-700">
            Tu pedido simulado #{order.id} ha sido creado exitosamente. Este es un pedido de
            práctica - no se procesarán pagos ni envíos reales.
          </AlertDescription>
        </Alert>

        <DemoBanner
          className="mb-6"
          title="Proyecto Educativo"
          description="Este es un proyecto de práctica con fines demostrativos. Los pedidos, productos y estados son simulados."
        />

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Pedido #{order.id}</CardTitle>
                <CardDescription>
                  Realizado el{' '}
                  {new Date(order.created_at || '').toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </CardDescription>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusInfo.bg}`}>
                <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                <span className={`text-sm font-medium ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Productos</h3>
                <div className="space-y-3">
                  {order.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b last:border-b-0"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">Producto #{item.product_id}</h4>
                          <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          €{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">€{(item.price || 0).toFixed(2)} c/u</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-2xl text-blue-600">€{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Simulación de Proceso</CardTitle>
            <CardDescription>Así funcionaría el proceso </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium">Procesamiento del pedido</p>
                  <p className="text-gray-600">
                    Se verificaría el pedido y se prepararían los productos
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">2</span>
                </div>
                <div>
                  <p className="font-medium">Preparación para envío</p>
                  <p className="text-gray-600">Se empaquetarían los productos cuidadosamente</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">3</span>
                </div>
                <div>
                  <p className="font-medium">Entrega</p>
                  <p className="text-gray-600">Se entregaría el pedido en la dirección indicada</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-center">
          <Button
            size="lg"
            asChild
          >
            <Link to="/products">Continuar Comprando</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
