import { useCategories } from '@/api/hooks/useCategories';
import { BackButton } from '@/components/common/BackButton';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { CategoryCard } from '@/components/home/CategoryCard';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { getCategoryIcon } from '@/lib/utils/categoryIcons';

export default function Categories() {
  const { data: categories, isLoading, error } = useCategories();
  const hasCategories = Boolean(categories && categories.length > 0);

  const categoriesContent = (() => {
    if (isLoading) {
      return (
        <LoadingState
          message="Cargando categorías..."
          minHeight="min-h-[300px]"
        />
      );
    }

    if (error) {
      return (
        <ErrorState
          message="Error al cargar las categorías"
          actionLabel="Reintentar"
          onAction={() => window.location.reload()}
          minHeight="min-h-[300px]"
        />
      );
    }

    if (!hasCategories) {
      return (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">No hay categorías disponibles</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories!.map((category) => {
          const icon = getCategoryIcon(category.slug);
          const productCount = category.product_count ?? 0;
          const badgeText = productCount === 1 ? '1 producto' : `${productCount} productos`;
          const categoryName = category.name ?? 'Categoría sin nombre';
          const categoryDescription = category.description ?? undefined;
          const slug = category.slug ?? '';
          const categoryLink = slug ? `/categories/${slug}` : '/categories';
          const categoryKey = category.id ?? slug ?? categoryName;

          return (
            <CategoryCard
              key={categoryKey}
              icon={icon}
              title={categoryName}
              description={categoryDescription}
              link={categoryLink}
              buttonText="Ver productos"
              badgeText={badgeText}
            />
          );
        })}
      </div>
    );
  })();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <BackButton
            to="/"
            text="Volver al inicio"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Todas las Categorías</h1>
          <p className="text-gray-600 text-lg">
            Explora nuestras categorías y encuentra lo que buscas
          </p>
        </div>

        {categoriesContent}
      </div>
    </Layout>
  );
}
