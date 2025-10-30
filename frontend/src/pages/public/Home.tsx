import { useCategories } from '@/api/hooks/useCategories';
import { CategoryCard } from '@/components/home/CategoryCard';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { HeroSection } from '@/components/home/HeroSection';
import { Layout } from '@/components/layout/Layout';
import { getCategoryIcon } from '@/lib/utils/categoryIcons';

export default function Home() {
  const { data: categories, isLoading } = useCategories();

  return (
    <Layout>
      <HeroSection />

      <section className="py-24 bg-gray-50">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          Categorías Destacadas
        </h2>
        {isLoading ? (
          <p className="text-center text-gray-600">Cargando categorías...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {categories?.map((category) => (
              <CategoryCard
                key={category.id}
                icon={getCategoryIcon(category.slug)}
                title={category.name || ''}
                description={category.description || ''}
                link={`/categories/${category.slug}`}
                buttonText="Ver productos"
              />
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <h2 className="text-4xl font-bold text-center text-indigo-600 mb-16">
          Productos Destacados
        </h2>
        <FeaturedProducts />
      </section>
    </Layout>
  );
}
