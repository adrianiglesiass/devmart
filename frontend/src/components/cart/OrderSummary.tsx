import type { Product } from '@/api/types/types';
import { Flex } from '@/components/common/Flex';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface CartItem extends Product {
  quantity: number;
}

interface OrderSummaryItemProps {
  item: CartItem;
}

function OrderSummaryItem({ item }: OrderSummaryItemProps) {
  const subtotal = (item.price || 0) * item.quantity;
  const unitPrice = item.price || 0;

  return (
    <Flex className="items-center justify-between py-3 border-b last:border-b-0">
      <Flex className="items-center gap-4 flex-1">
        {item.image_url && (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-16 h-16 object-cover rounded"
          />
        )}
        <Flex className="flex-1 flex-col">
          <h3 className="font-medium">{item.name}</h3>
          <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
        </Flex>
      </Flex>
      <Flex className="flex-col items-end">
        <p className="font-semibold">€{subtotal.toFixed(2)}</p>
        <p className="text-sm text-gray-500">€{unitPrice.toFixed(2)} c/u</p>
      </Flex>
    </Flex>
  );
}

interface OrderSummaryProps {
  items: CartItem[];
  totalPrice: number;
}

export function OrderSummary({ items, totalPrice }: OrderSummaryProps) {
  const itemCount = items.length;
  const itemLabel = itemCount === 1 ? 'producto' : 'productos';
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Resumen del Pedido</CardTitle>
        <CardDescription>
          {itemCount} {itemLabel}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Flex className="flex-col gap-4">
          {items.map((item) => (
            <OrderSummaryItem
              key={item.id}
              item={item}
            />
          ))}
        </Flex>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Flex className="w-full justify-between items-center text-lg font-bold">
          <span>Total:</span>
          <span className="text-2xl text-indigo-600">€{totalPrice.toFixed(2)}</span>
        </Flex>
      </CardFooter>
    </Card>
  );
}
