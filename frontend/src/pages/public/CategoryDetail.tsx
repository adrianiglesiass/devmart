import { PackageX } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { useCategoryBySlug, useCategoryProducts } from '@/api/hooks/useCategories';
import { BackButton } from '@/components/common/BackButton';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600">Cargando categoría...</p>
        </div>
      </Layout>
    );
  }

  if (categoryError || !category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <PackageX className="w-20 h-20 text-gray-400 mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Categoría no encontrada</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-md">
              La categoría que buscas no existe o ha sido eliminada.
            </p>
            <div className="flex gap-4">
              <Link to="/categories">
                <Button
                  variant="default"
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Ver todas las categorías
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline">Volver al inicio</Button>
              </Link>
            </div>
          </div>
        </div>
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
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl">{category.name}</CardTitle>
              <Badge variant="secondary">
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
          <p className="text-center text-gray-600">Cargando productos...</p>
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
