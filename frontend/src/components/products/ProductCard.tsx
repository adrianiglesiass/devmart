import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { Product } from '@/api/types/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      {product.image_url && (
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <CardHeader>
        <CardTitle className="leading-relaxed">{product.name}</CardTitle>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {product.description || 'Sin descripción disponible'}
        </p>

        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-blue-600">${product.price?.toFixed(2)}</p>
          <p className="text-sm text-gray-500">Stock: {product.stock || 0}</p>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Link
          to={`/products/${product.id}`}
          className="flex-1"
        >
          <Button
            variant="outline"
            className="w-full"
          >
            Ver detalles
          </Button>
        </Link>
        <Button
          className="flex-1"
          disabled={!product.stock}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Añadir
        </Button>
      </CardFooter>
    </Card>
  );
}
