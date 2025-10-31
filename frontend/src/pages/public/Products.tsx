import { useProducts } from '@/api/hooks/useProducts';
import { BackButton } from '@/components/common/BackButton';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';

export default function Products() {
  const { data: products, isLoading, error } = useProducts();

  if (isLoading) {
    return (
      <Layout>
        <LoadingState
          message="Cargando productos..."
          minHeight="min-h-[400px]"
        />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorState
          message="Error al cargar productos"
          actionLabel="Reintentar"
          onAction={() => window.location.reload()}
          minHeight="min-h-[400px]"
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <BackButton
          to="/"
          text="Volver al inicio"
        />
        <h1 className="text-4xl font-bold mb-2 leading-relaxed">Productos</h1>
        <p className="text-gray-600">Explora nuestro catálogo completo</p>
      </div>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg mb-4">No hay productos disponibles</p>
          <p className="text-gray-500 text-sm">Vuelve más tarde para ver nuevos productos</p>
        </div>
      )}
    </Layout>
  );
}
