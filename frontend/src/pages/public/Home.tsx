import { CategoryCard } from '@/components/home/CategoryCard';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { HeroSection } from '@/components/home/HeroSection';
import { Layout } from '@/components/layout/Layout';

export default function Home() {
  return (
    <Layout>
      <HeroSection />

      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Categorías Destacadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CategoryCard
            title="Electrónica"
            description="Últimos gadgets y tecnología de punta"
            link="/categories/electronics"
            buttonText="Ver productos"
          />

          <CategoryCard
            title="Ordenadores"
            description="Laptops,PCs"
            link="/categories/computers"
            buttonText="Ver productos"
          />

          <CategoryCard
            title="Accesorios"
            description="Todo lo que necesitas para tu setup"
            link="/categories/accessories"
            buttonText="Ver productos"
          />
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white rounded-lg shadow-sm">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Productos Destacados
        </h2>
        <FeaturedProducts />
      </section>
    </Layout>
  );
}
