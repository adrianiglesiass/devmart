import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useState } from 'react';

import { useCreateOrder } from '@/api/hooks/useOrders';
import { CheckoutActions } from '@/components/cart/CheckoutActions';
import { CheckoutDisclaimer } from '@/components/cart/CheckoutDisclaimer';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { OrderSummary } from '@/components/cart/OrderSummary';
import { DemoBanner } from '@/components/common/DemoBanner';
import { SimulationInfo } from '@/components/common/SimulationInfo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

export default function Checkout() {
  const { items, clearCart, totalPrice } = useCart();
  const createOrder = useCreateOrder();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const hasItems = items.length > 0;

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

  if (!hasItems) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <EmptyCart />
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

        <OrderSummary
          items={items}
          totalPrice={totalPrice}
        />

        <SimulationInfo className="mb-6" />

        <CheckoutActions
          isLoading={createOrder.isPending}
          isEmpty={items.length === 0}
          onConfirm={handleConfirm}
        />

        <CheckoutDisclaimer />
      </div>
    </div>
  );
}
