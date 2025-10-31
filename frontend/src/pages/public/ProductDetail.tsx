import { Package, Shield, ShoppingCart, Truck } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { useAddToCart } from '@/api/hooks/useAddToCart';
import { useProduct } from '@/api/hooks/useProducts';
import { BackButton } from '@/components/common/BackButton';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProduct(Number(id));
  const addToCart = useAddToCart();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[500px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando producto...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-red-600 text-lg mb-4">Producto no encontrado</p>
          <Link to="/products">
            <Button>Volver a productos</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton
          to="/products"
          text="Volver a productos"
        />

        {/* Contenido principal */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Columna izquierda - Imagen */}
          <div>
            <Card className="overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-auto aspect-square object-contain bg-gray-50"
                  onError={(e) =>
                    (e.currentTarget.src =
                      'https://placehold.co/800x800/e5e7eb/6b7280?text=Sin+Imagen')
                  }
                />
              ) : (
                <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                  <Package className="w-24 h-24 text-gray-300" />
                </div>
              )}
            </Card>
          </div>

          {/* Columna derecha - Información */}
          <div className="flex flex-col">
            {/* Badge de stock */}
            <div className="mb-4">
              <span
                className={`inline-block text-xs ${stock.className} px-3 py-1 rounded-full font-semibold`}
              >
                {stock.text}
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {product.name}
            </h1>

            {/* Precio */}
            <Card className="mb-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
              <CardContent className="pt-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-indigo-600">
                    €{product.price?.toFixed(2)}
                  </span>
                  <span className="text-gray-500 text-lg">IVA incluido</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 mt-4">
                  <Package className="w-5 h-5" />
                  <span className="text-base">
                    {(product.stock ?? 0) > 0 ? (
                      <>
                        <strong>{product.stock}</strong> unidades disponibles
                      </>
                    ) : (
                      <span className="text-red-600 font-medium">Sin stock disponible</span>
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">Descripción</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-base leading-relaxed">
                  {product.description || 'Sin descripción disponible.'}
                </p>
              </CardContent>
            </Card>

            <div className="mb-8">
              <Button
                size="lg"
                className={`w-full py-6 text-lg font-semibold rounded-lg transition-all interactive-action ${
                  product.stock
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!product.stock}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.stock ? 'Añadir al carrito' : 'Producto agotado'}
              </Button>
            </div>

            {/* Características / Ventajas */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="border-2 hover:border-indigo-200 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Truck className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Envío rápido</h3>
                      <p className="text-sm text-gray-600">Entrega en 2-3 días hábiles</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-indigo-200 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Garantía de 2 años</h3>
                      <p className="text-sm text-gray-600">Protección completa del fabricante</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-indigo-200 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Devoluciones gratis</h3>
                      <p className="text-sm text-gray-600">30 días para cambios y devoluciones</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
