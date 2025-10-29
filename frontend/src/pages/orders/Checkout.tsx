import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Package, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useState } from 'react';

import { useCreateOrder } from '@/api/hooks/useOrders';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DemoBanner } from '@/components/ui/demo-banner';
import { SimulationInfo } from '@/components/ui/simulation-info';
import { useCart } from '@/context/CartContext';

export default function Checkout() {
  const { items, clearCart, totalPrice } = useCart();
  const createOrder = useCreateOrder();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleConfirm = async () => {
    if (items.length === 0 || createOrder.isPending) return;

    setError(null);

    try {
      const payload = {
        items: items.map((item) => ({
          product_id: item.id!,
          quantity: item.quantity,
        })),
      };

      const response = await createOrder.mutateAsync(payload);

      clearCart();

      if (response.order?.id) {
        navigate(`/orders/${response.order.id}`);
      } else {
        navigate('/orders');
      }
    } catch (err) {
      console.error('Error al crear la orden:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al procesar tu orden. Inténtalo de nuevo.',
      );
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-6 w-6" />
                Carrito Vacío
              </CardTitle>
              <CardDescription>No tienes productos en tu carrito</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-6">
                Añade algunos productos a tu carrito para continuar con tu compra
              </p>
              <Button
                asChild
                size="lg"
              >
                <Link to="/products">Explorar Productos</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-4"
          asChild
        >
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Seguir Comprando
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-4">Confirmar Pedido</h1>

        <DemoBanner className="mb-6" />

        {error && (
          <Alert
            variant="destructive"
            className="mb-6"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Resumen del Pedido</CardTitle>
            <CardDescription>
              {items.length} {items.length === 1 ? 'producto' : 'productos'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3 border-b last:border-b-0"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      €{((item.price || 0) * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">€{(item.price || 0).toFixed(2)} c/u</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="w-full flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-2xl text-indigo-600">€{totalPrice.toFixed(2)}</span>
            </div>
          </CardFooter>
        </Card>

        <SimulationInfo className="mb-6" />

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            asChild
          >
            <Link to="/products">Cancelar</Link>
          </Button>
          <Button
            size="lg"
            className="flex-1"
            onClick={handleConfirm}
            disabled={createOrder.isPending || items.length === 0}
          >
            {createOrder.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Confirmar Pedido (Demo)
              </>
            )}
          </Button>
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            <strong>Aviso:</strong> Este sitio web es un proyecto de práctica con fines educativos.
            No se realizan transacciones reales, no se recopilan datos personales sensibles, y no se
            envían productos físicos. Todos los pedidos son simulaciones.
          </p>
        </div>
      </div>
    </div>
  );
}
