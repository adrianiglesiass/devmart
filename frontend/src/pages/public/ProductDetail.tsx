import { useParams } from 'react-router-dom';

import { useAddToCart } from '@/api/hooks/useAddToCart';
import { useProduct } from '@/api/hooks/useProducts';
import { BackButton } from '@/components/common/BackButton';
import { ErrorState } from '@/components/common/ErrorState';
import { Flex } from '@/components/common/Flex';
import { LoadingState } from '@/components/common/LoadingState';
import { Layout } from '@/components/layout/Layout';
import { ProductAddToCartButton } from '@/components/products/ProductAddToCartButton';
import { ProductDescription } from '@/components/products/ProductDescription';
import { ProductFeatures } from '@/components/products/ProductFeatures';
import { ProductImage } from '@/components/products/ProductImage';
import { ProductPrice } from '@/components/products/ProductPrice';
import { ProductStockBadge } from '@/components/products/ProductStockBadge';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProduct(Number(id));
  const addToCart = useAddToCart();

  if (isLoading) {
    return (
      <Layout>
        <LoadingState message="Cargando producto..." />
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <ErrorState
          message="Producto no encontrado"
          actionLabel="Volver a productos"
          onAction={() => window.history.back()}
        />
      </Layout>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <BackButton
          to="/products"
          text="Volver a productos"
        />

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16">
          {/* Columna izquierda - Imagen */}
          <div>
            <ProductImage
              imageUrl={product.image_url}
              name={product.name}
            />
          </div>

          {/* Columna derecha - Información */}
          <Flex className="flex-col">
            <div className="mb-4">
              <ProductStockBadge stock={product.stock} />
            </div>

            <h1 className="text-2xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {product.name}
            </h1>

            {/* Precio */}
            <ProductPrice
              price={product.price}
              stock={product.stock}
            />

            <ProductDescription description={product.description} />

            <ProductAddToCartButton
              stock={product.stock}
              onClick={handleAddToCart}
            />

            {/* Características / Ventajas */}
            <ProductFeatures />
          </Flex>
        </div>
      </div>
    </Layout>
  );
}
