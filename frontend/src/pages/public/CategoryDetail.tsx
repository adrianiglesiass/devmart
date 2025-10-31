import { useParams } from 'react-router-dom';

import { useCategoryBySlug, useCategoryProducts } from '@/api/hooks/useCategories';
import { BackButton } from '@/components/common/BackButton';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: category,
    isLoading: isLoadingCategory,
    error: categoryError,
  } = useCategoryBySlug(slug);

  const {
    data: products,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useCategoryProducts(category?.id);

  if (isLoadingCategory) {
    return (
      <Layout>
        <LoadingState
          message="Cargando categoría..."
          minHeight="min-h-[300px]"
        />
      </Layout>
    );
  }

  if (categoryError || !category) {
    return (
      <Layout>
        <ErrorState
          message="Categoría no encontrada"
          actionLabel="Volver atrás"
          onAction={() => window.history.back()}
          minHeight="min-h-[400px]"
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <BackButton
          to="/categories"
          text="Volver a categorías"
        />

        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-3xl">{category.name}</CardTitle>
              <Badge
                variant="outline"
                className="text-xs px-1 py-0.5 sm:text-sm sm:px-2 sm:py-1"
              >
                {category.product_count === 1
                  ? '1 producto'
                  : `${category.product_count} productos`}
              </Badge>
            </div>
            {category.description && (
              <CardDescription className="text-lg">{category.description}</CardDescription>
            )}
          </CardHeader>
        </Card>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Productos</h2>
        </div>
        {isLoadingProducts ? (
          <LoadingState
            message="Cargando productos..."
            minHeight="min-h-[300px]"
          />
        ) : productsError ? (
          <p className="text-center text-red-600">Error al cargar los productos</p>
        ) : !products || products.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">
                No hay productos disponibles en esta categoría
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
