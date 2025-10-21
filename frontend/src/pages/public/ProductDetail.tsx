import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { useProduct } from '@/api/hooks/useProducts';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct(Number(id));
  const { addItem } = useCart();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-lg">Cargando...</p>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="text-center py-16">
          <p className="text-red-600 text-lg mb-4">Producto no encontrado</p>
          <Button onClick={() => navigate('/products')}>Volver a productos</Button>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <Layout>
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate('/products')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a productos
      </Button>

      {/* Product detail */}
      <Card>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Sin imagen</p>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold mb-4 leading-relaxed">{product.name}</h1>

              <p className="text-gray-600 mb-6">
                {product.description || 'Sin descripción disponible'}
              </p>

              <div className="mb-6">
                <p className="text-4xl font-bold text-blue-600">${product.price?.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Stock disponible: {product.stock || 0} unidades
                </p>
              </div>

              <div className="flex gap-4 mt-auto">
                <Button
                  size="lg"
                  className="flex-1"
                  disabled={!product.stock}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Añadir al carrito
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}
