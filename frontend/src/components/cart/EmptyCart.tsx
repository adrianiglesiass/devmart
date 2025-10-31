import { Package, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Flex } from '@/components/common/Flex';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const EMPTY_CART_TITLE = 'Carrito Vacío';
const EMPTY_CART_DESCRIPTION = 'No tienes productos en tu carrito';
const EMPTY_CART_MESSAGE = 'Añade algunos productos a tu carrito para continuar con tu compra';
const EXPLORE_BUTTON_TEXT = 'Explorar Productos';

export function EmptyCart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6" />
          {EMPTY_CART_TITLE}
        </CardTitle>
        <CardDescription>{EMPTY_CART_DESCRIPTION}</CardDescription>
      </CardHeader>
      <CardContent className="text-center py-8">
        <Flex className="flex-col items-center">
          <Package className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500 mb-6">{EMPTY_CART_MESSAGE}</p>
          <Button
            asChild
            size="lg"
          >
            <Link to="/products">{EXPLORE_BUTTON_TEXT}</Link>
          </Button>
        </Flex>
      </CardContent>
    </Card>
  );
}
