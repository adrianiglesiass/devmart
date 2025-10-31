import { useProducts } from '@/api/hooks/useProducts';
import { BackButton } from '@/components/common/BackButton';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';

export default function Products() {
  const { data: products, isLoading, error } = useProducts();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]"></div>
        <div className="text-center">
          <div className="animate-spin rounded-b-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Cargando productos...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]:">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">Error al cargar productos</p>
            <Button onClick={() => window.location.reload()}>Reitentar</Button>
          </div>
        </div>
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
