import { Loader2 } from 'lucide-react';

import { useProducts } from '@/api/hooks/useProducts';

import { ProductCard } from '../products/ProductCard';

export function FeaturedProducts() {
  const { data: products, isLoading } = useProducts();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600"></Loader2>
      </div>
    );
  }

  const featured = products?.slice(0, 3) || [];

  if (featured.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {featured.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}
