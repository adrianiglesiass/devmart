import { Link } from 'react-router-dom';

import type { Product } from '@/api/types/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const getStockStatus = () => {
    if (!product.stock || product.stock === 0) {
      return { text: 'Agotado', className: 'text-red-600 bg-red-100' };
    }
    if (product.stock < 10) {
      return { text: 'Pocas unidades', className: 'text-yellow-600 bg-yellow-100' };
    }
    return { text: 'En Stock', className: 'text-green-600 bg-green-100' };
  };

  const stock = getStockStatus();
  const isAgotado = !product.stock || product.stock === 0;

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      {/* Imagen con efecto hover zoom */}
      <div className="h-60 overflow-hidden">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.image_url || 'https://placehold.co/600x400/ccc/ffffff?text=Sin+Imagen'}
            alt={`Imagen de ${product.name}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) =>
              (e.currentTarget.src =
                'https://placehold.co/600x400/ef4444/ffffff?text=Error+al+cargar')
            }
          />
        </Link>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-gray-900 truncate">
          <Link
            to={`/products/${product.id}`}
            className="hover:text-indigo-600 transition-colors"
          >
            {product.name}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-gray-600 text-sm mb-4 h-10 overflow-hidden">
          {product.description || 'Sin descripción.'}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-indigo-600">€{product.price?.toFixed(2)}</span>
          <span className={`text-xs ${stock.className} px-2 py-1 rounded-full font-medium`}>
            {stock.text}
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          className={`w-full text-white py-2 rounded-lg font-semibold transition-colors ${
            isAgotado
              ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
          disabled={isAgotado}
          onClick={() => addItem(product)}
        >
          {isAgotado ? 'Agotado' : 'Añadir al carrito'}
        </Button>
      </CardFooter>
    </Card>
  );
}
