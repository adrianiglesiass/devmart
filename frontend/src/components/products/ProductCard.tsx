import { Link } from 'react-router-dom';

import { useAddToCart } from '@/api/hooks/useAddToCart';
import type { Product } from '@/api/types/types';
import { Flex } from '@/components/common/Flex';
import { getStockStatus } from '@/components/products/ProductStockBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
}

const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400/ccc/ffffff?text=Sin+Imagen';
const ERROR_IMAGE = 'https://placehold.co/600x400/ef4444/ffffff?text=Error+al+cargar';

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useAddToCart();
  const stockStatus = getStockStatus(product.stock);
  const isOutOfStock = !product.stock || product.stock === 0;

  const buttonStyles = isOutOfStock
    ? 'bg-gray-400 text-white cursor-not-allowed hover:bg-gray-400'
    : 'bg-indigo-600 text-white hover:bg-indigo-700';

  const handleAddToCart = () => addToCart(product);

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      {/* Image Section */}
      <div className="h-60 overflow-hidden">
        <Link
          to={`/products/${product.id}`}
          className="interactive-link block"
        >
          <img
            src={product.image_url || PLACEHOLDER_IMAGE}
            alt={`Imagen de ${product.name}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => (e.currentTarget.src = ERROR_IMAGE)}
          />
        </Link>
      </div>

      {/* Title Section */}
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-gray-900 truncate">
          <Link
            to={`/products/${product.id}`}
            className="hover:text-indigo-600 transition-colors interactive-link"
          >
            {product.name}
          </Link>
        </CardTitle>
      </CardHeader>

      {/* Content Section */}
      <CardContent className="pb-4">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description || 'Sin descripción.'}
        </p>
        <Flex className="justify-between items-center">
          <span className="text-2xl font-bold text-indigo-600">€{product.price?.toFixed(2)}</span>
          <span className={`text-xs ${stockStatus.className} px-2 py-1 rounded-full font-medium`}>
            {stockStatus.text}
          </span>
        </Flex>
      </CardContent>

      {/* Action Section */}
      <CardFooter className="pt-0">
        <Button
          className={`w-full py-2 rounded-lg font-semibold transition-colors interactive-action ${buttonStyles}`}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? 'Agotado' : 'Añadir al carrito'}
        </Button>
      </CardFooter>
    </Card>
  );
}
