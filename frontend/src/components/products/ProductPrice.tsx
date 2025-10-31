import { Package } from 'lucide-react';

import { Flex } from '@/components/common/Flex';
import { Card, CardContent } from '@/components/ui/card';

interface ProductPriceProps {
  price?: number;
  stock?: number;
}

export function ProductPrice({ price, stock }: ProductPriceProps) {
  const isOutOfStock = !stock || stock <= 0;
  const formattedPrice = price ? `€${price.toFixed(2)}` : 'Precio no disponible';

  const stockMessage = isOutOfStock ? (
    <span className="text-red-600 font-medium">Sin stock disponible</span>
  ) : (
    <>
      <strong>{stock}</strong> unidades disponibles
    </>
  );

  return (
    <Card className="mb-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
      <CardContent className="pt-6">
        {/* Price Section */}
        <Flex className="items-baseline gap-2 mb-2">
          <span className="text-3xl lg:text-5xl font-bold text-indigo-600">{formattedPrice}</span>
          {price && <span className="text-gray-500 text-lg">IVA incluido</span>}
        </Flex>

        {/* Stock Section */}
        <Flex className="items-center gap-2 mt-4">
          <Package className="w-5 h-5 flex-shrink-0 text-gray-700" />
          <span className="text-base text-gray-700">{stockMessage}</span>
        </Flex>
      </CardContent>
    </Card>
  );
}
