import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCart } from '@/context/CartContext';

import { CartItem } from './CartItem';

export function Cart() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative transition-transform duration-300 hover:scale-110 hover:rotate-6"
        >
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>
            Carrito de Compras ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})
          </SheetTitle>
          <SheetDescription>
            Revisa y gestiona los productos en tu carrito de compras.
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-8">
            <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center">Tu carrito está vacío</p>
            <p className="text-sm text-gray-400 text-center mt-2">Añade productos para comenzar</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                />
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-2xl font-bold text-indigo-600">€{totalPrice.toFixed(2)}</span>
              </div>

              <Link
                to="/checkout"
                className="block interactive-link"
                onClick={() => setOpen(false)}
              >
                <Button
                  className="w-full interactive-action"
                  size="lg"
                >
                  Finalizar Compra
                </Button>
              </Link>

              <Button
                variant="outline"
                className="w-full"
                onClick={clearCart}
              >
                Vaciar Carrito
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
