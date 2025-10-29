import { Cpu, Headphones, Laptop } from 'lucide-react';

import { CategoryCard } from '@/components/home/CategoryCard';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { HeroSection } from '@/components/home/HeroSection';
import { Layout } from '@/components/layout/Layout';

export default function Home() {
  return (
    <Layout>
      <HeroSection />

      <section className="py-24 bg-gray-50">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          Categorías Destacadas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <CategoryCard
            icon={<Cpu />}
            title="Electrónica"
            description="Gadgets, wearables y lo último en tecnología de consumo."
            link="/categories/electronics"
            buttonText="Ver productos"
          />

          <CategoryCard
            icon={<Laptop />}
            title="Ordenadores"
            description="Laptops, PCs de escritorio y componentes de alto rendimiento."
            link="/categories/computers"
            buttonText="Ver productos"
          />

          <CategoryCard
            icon={<Headphones />}
            title="Accesorios"
            description="Todo lo que necesitas para complementar tu setup perfecto."
            link="/categories/accessories"
            buttonText="Ver productos"
          />
        </div>
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
